const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  jobId: {
    type: String,
    unique: true,
    index: true
    // Will be auto-generated in pre-save middleware
  },
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Head of Department is required'],
    index: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters'],
    index: true
  },
  positionTitle: {
    type: String,
    required: [true, 'Position title is required'],
    trim: true,
    maxlength: [200, 'Position title cannot exceed 200 characters']
  },
  expectedExperience: {
    type: String,
    trim: true,
    maxlength: [50, 'Expected experience cannot exceed 50 characters']
  },
  expectedDoj: {
    type: Date,
    required: [true, 'Expected Date of Joining is required'],
    index: true,
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Expected DOJ must be a future date'
    }
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [2000, 'Job description cannot exceed 2000 characters']
  },
  hardwareRequirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Hardware requirements cannot exceed 1000 characters']
  },
  softwareRequirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Software requirements cannot exceed 1000 characters']
  },
  budgetApproved: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
    validate: {
      validator: function(value) {
        return value == null || value >= 0;
      },
      message: 'Budget must be a positive number'
    }
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  approvalDocuments: [{
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    }
  }],
  
  // Workflow Status
  status: {
    type: String,
    enum: {
      values: ['draft', 'pending_approval', 'approved', 'in_procurement', 'filled', 'cancelled'],
      message: 'Invalid status'
    },
    default: 'draft',
    index: true
  },
  
  // Priority level for processing
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Approval Workflow
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  approvalComments: {
    type: String,
    maxlength: [500, 'Approval comments cannot exceed 500 characters']
  },
  
  // Rejection details
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  
  // Procurement details
  procurementAssignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  procurementAssignedAt: {
    type: Date
  },
  procurementNotes: {
    type: String,
    maxlength: [1000, 'Procurement notes cannot exceed 1000 characters']
  },
  
  // Job fulfillment
  filledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Associate'
  },
  filledAt: {
    type: Date
  },
  
  // Additional metadata
  urgencyReason: {
    type: String,
    maxlength: [500, 'Urgency reason cannot exceed 500 characters']
  },
  specialInstructions: {
    type: String,
    maxlength: [1000, 'Special instructions cannot exceed 1000 characters']
  },
  
  // Workflow tracking
  workflowHistory: [{
    action: {
      type: String,
      enum: ['created', 'submitted', 'approved', 'rejected', 'assigned_procurement', 'filled', 'cancelled'],
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    comments: String,
    fromStatus: String,
    toStatus: String
  }],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days until expected DOJ
jobPostingSchema.virtual('daysUntilDoj').get(function() {
  if (!this.expectedDoj) return null;
  const today = new Date();
  const diffTime = this.expectedDoj - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for workflow status display
jobPostingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'draft': 'Draft',
    'pending_approval': 'Pending Approval',
    'approved': 'Approved',
    'in_procurement': 'In Procurement',
    'filled': 'Filled',
    'cancelled': 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for checking if job is overdue
jobPostingSchema.virtual('isOverdue').get(function() {
  if (this.status === 'filled' || this.status === 'cancelled') return false;
  return this.expectedDoj < new Date();
});

// Indexes for efficient queries
jobPostingSchema.index({ jobId: 1 }, { unique: true });
jobPostingSchema.index({ hod: 1, status: 1 });
jobPostingSchema.index({ department: 1, status: 1 });
jobPostingSchema.index({ expectedDoj: 1, status: 1 });
jobPostingSchema.index({ createdAt: -1 });
jobPostingSchema.index({ status: 1, priority: 1 });

// Text index for search
jobPostingSchema.index({
  jobId: 'text',
  positionTitle: 'text',
  department: 'text',
  jobDescription: 'text'
});

// Pre-save middleware to generate Job ID
jobPostingSchema.pre('save', async function(next) {
  if (!this.jobId && this.isNew) {
    try {
      const year = new Date().getFullYear();
      const prefix = `JOB-${year}-`;
      
      // Find the latest job ID for this year
      const latestJob = await this.constructor.findOne({
        jobId: new RegExp(`^${prefix}`)
      }).sort({ jobId: -1 });
      
      let sequence = 1;
      if (latestJob && latestJob.jobId) {
        const lastSequence = parseInt(latestJob.jobId.split('-').pop());
        sequence = lastSequence + 1;
      }
      
      // Generate job ID with 4-digit sequence
      this.jobId = `${prefix}${sequence.toString().padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  
  // Auto-populate department based on HOD
  if (this.isModified('hod') && this.hod) {
    try {
      const User = mongoose.model('User');
      const hod = await User.findById(this.hod);
      if (hod && hod.department) {
        this.department = hod.department;
      }
    } catch (error) {
      // Don't fail the save if HOD lookup fails
      console.warn('Failed to auto-populate department:', error.message);
    }
  }
  
  next();
});

// Pre-save middleware to track workflow changes
jobPostingSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    const oldStatus = this.get('status', null, { getters: false });
    this.workflowHistory.push({
      action: this.status,
      performedBy: this.modifiedBy || this.createdBy,
      fromStatus: oldStatus,
      toStatus: this.status,
      comments: this.workflowComment || ''
    });
    
    // Clear the temporary workflow comment
    this.workflowComment = undefined;
  }
  next();
});

// Static method to find jobs by status
jobPostingSchema.statics.findByStatus = function(status, options = {}) {
  const query = { status };
  if (options.department) query.department = options.department;
  if (options.hod) query.hod = options.hod;
  
  return this.find(query)
    .populate('hod', 'firstName lastName email department')
    .populate('approvedBy', 'firstName lastName email')
    .populate('procurementAssignedTo', 'firstName lastName email')
    .sort(options.sort || { createdAt: -1 });
};

// Static method to find overdue jobs
jobPostingSchema.statics.findOverdueJobs = function() {
  return this.find({
    expectedDoj: { $lt: new Date() },
    status: { $in: ['pending_approval', 'approved', 'in_procurement'] }
  }).populate('hod', 'firstName lastName email');
};

// Static method to find jobs for procurement
jobPostingSchema.statics.findForProcurement = function() {
  return this.find({ status: 'approved' })
    .populate('hod', 'firstName lastName email department')
    .sort({ priority: 1, expectedDoj: 1 });
};

// Static method for job search
jobPostingSchema.statics.searchJobs = function(query, options = {}) {
  const {
    status,
    department,
    hod,
    fromDate,
    toDate,
    limit = 20,
    page = 1
  } = options;
  
  const searchCriteria = {};
  
  if (status) searchCriteria.status = status;
  if (department) searchCriteria.department = department;
  if (hod) searchCriteria.hod = hod;
  if (fromDate || toDate) {
    searchCriteria.createdAt = {};
    if (fromDate) searchCriteria.createdAt.$gte = new Date(fromDate);
    if (toDate) searchCriteria.createdAt.$lte = new Date(toDate);
  }
  
  if (query) {
    searchCriteria.$text = { $search: query };
  }
  
  return this.find(searchCriteria)
    .populate('hod', 'firstName lastName email department')
    .populate('approvedBy', 'firstName lastName email')
    .populate('createdBy', 'firstName lastName email')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 });
};

// Instance method to add workflow entry
jobPostingSchema.methods.addWorkflowEntry = function(action, performedBy, comments = '') {
  this.workflowHistory.push({
    action,
    performedBy,
    comments,
    fromStatus: this.status,
    toStatus: this.status
  });
};

// Instance method to approve job
jobPostingSchema.methods.approve = function(approvedBy, comments = '') {
  this.status = 'approved';
  this.approvedBy = approvedBy;
  this.approvedAt = new Date();
  this.approvalComments = comments;
  this.workflowComment = comments;
  this.modifiedBy = approvedBy;
};

// Instance method to reject job
jobPostingSchema.methods.reject = function(rejectedBy, reason) {
  this.status = 'draft'; // Send back to draft for revision
  this.rejectedBy = rejectedBy;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  this.workflowComment = `Rejected: ${reason}`;
  this.modifiedBy = rejectedBy;
};

// Instance method to assign to procurement
jobPostingSchema.methods.assignToProcurement = function(assignedTo, assignedBy, notes = '') {
  this.status = 'in_procurement';
  this.procurementAssignedTo = assignedTo;
  this.procurementAssignedAt = new Date();
  this.procurementNotes = notes;
  this.workflowComment = `Assigned to procurement: ${notes}`;
  this.modifiedBy = assignedBy;
};

module.exports = mongoose.model('JobPosting', jobPostingSchema);