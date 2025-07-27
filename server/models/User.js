const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['manager', 'procurement', 'asset_team', 'branch_ops', 'admin', 'it_team'],
      message: 'Invalid role specified'
    },
    index: true
  },
  department: {
    type: String,
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters'],
    index: true
  },
  designation: {
    type: String,
    trim: true,
    maxlength: [100, 'Designation cannot exceed 100 characters']
  },
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastLogin: {
    type: Date
  },
  profilePicture: {
    type: String // File path for profile picture
  },
  permissions: {
    canCreateJobs: { type: Boolean, default: false },
    canApproveJobs: { type: Boolean, default: false },
    canManageAssets: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canProcessClearance: { type: Boolean, default: false },
    canAccessProcurement: { type: Boolean, default: false }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    dashboardLayout: { type: String, default: 'default' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    language: { type: String, default: 'en' }
  },
  // Password reset functionality
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Account verification
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  // Security
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpire;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpire;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual to check if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for text search
userSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  employeeId: 'text',
  department: 'text'
});

// Compound indexes for efficient queries
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ department: 1, isActive: 1 });
userSchema.index({ reportingManager: 1, isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to set permissions based on role
userSchema.pre('save', function(next) {
  if (!this.isModified('role')) return next();
  
  // Reset all permissions
  this.permissions = {
    canCreateJobs: false,
    canApproveJobs: false,
    canManageAssets: false,
    canViewReports: false,
    canManageUsers: false,
    canProcessClearance: false,
    canAccessProcurement: false
  };
  
  // Set permissions based on role
  switch (this.role) {
    case 'admin':
      this.permissions = {
        canCreateJobs: true,
        canApproveJobs: true,
        canManageAssets: true,
        canViewReports: true,
        canManageUsers: true,
        canProcessClearance: true,
        canAccessProcurement: true
      };
      break;
    case 'manager':
      this.permissions.canCreateJobs = true;
      this.permissions.canApproveJobs = true;
      this.permissions.canViewReports = true;
      break;
    case 'procurement':
      this.permissions.canAccessProcurement = true;
      this.permissions.canViewReports = true;
      break;
    case 'asset_team':
      this.permissions.canManageAssets = true;
      this.permissions.canProcessClearance = true;
      this.permissions.canViewReports = true;
      break;
    case 'branch_ops':
    case 'it_team':
      this.permissions.canViewReports = true;
      break;
  }
  
  next();
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we've hit the max attempts and aren't already locked, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
  }
  
  return this.updateOne(updates);
};

// Static method to find users by role
userSchema.statics.findByRole = function(role, active = true) {
  return this.find({ role, isActive: active });
};

// Static method to find managers in a department
userSchema.statics.findDepartmentManagers = function(department) {
  return this.find({ 
    department, 
    role: 'manager', 
    isActive: true 
  });
};

// Static method for user search
userSchema.statics.searchUsers = function(query, options = {}) {
  const {
    role,
    department,
    isActive = true,
    limit = 20,
    page = 1
  } = options;
  
  const searchCriteria = { isActive };
  
  if (role) searchCriteria.role = role;
  if (department) searchCriteria.department = department;
  if (query) {
    searchCriteria.$text = { $search: query };
  }
  
  return this.find(searchCriteria)
    .populate('reportingManager', 'firstName lastName email')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort(query ? { score: { $meta: 'textScore' } } : { firstName: 1 });
};

module.exports = mongoose.model('User', userSchema);