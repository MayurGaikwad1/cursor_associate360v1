const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetId: {
    type: String,
    unique: true,
    index: true
    // Will be auto-generated in pre-save middleware
  },
  assetType: {
    type: String,
    required: [true, 'Asset type is required'],
    enum: {
      values: ['laptop', 'desktop', 'monitor', 'keyboard', 'mouse', 'headset', 'mobile', 'tablet', 'printer', 'scanner', 'projector', 'other'],
      message: 'Invalid asset type'
    },
    index: true
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  model: {
    type: String,
    trim: true,
    maxlength: [100, 'Model name cannot exceed 100 characters']
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true,
    maxlength: [100, 'Serial number cannot exceed 100 characters']
  },
  specifications: {
    processor: String,
    ram: String,
    storage: String,
    graphics: String,
    operatingSystem: String,
    screenSize: String,
    resolution: String,
    connectivity: [String],
    other: String
  },
  purchaseDate: {
    type: Date,
    index: true
  },
  purchaseCost: {
    type: Number,
    min: [0, 'Purchase cost cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  vendor: {
    name: String,
    contactEmail: String,
    contactPhone: String,
    address: String
  },
  warrantyExpiry: {
    type: Date,
    index: true
  },
  depreciationRate: {
    type: Number,
    min: [0, 'Depreciation rate cannot be negative'],
    max: [100, 'Depreciation rate cannot exceed 100%'],
    default: 20 // 20% per year
  },
  currentValue: {
    type: Number,
    min: [0, 'Current value cannot be negative']
  },
  
  // Asset Status
  status: {
    type: String,
    enum: {
      values: ['available', 'allocated', 'under_maintenance', 'damaged', 'disposed', 'lost', 'in_transit'],
      message: 'Invalid asset status'
    },
    default: 'available',
    index: true
  },
  conditionRating: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'damaged'],
    default: 'excellent'
  },
  
  // Location and Assignment
  currentLocation: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Associate',
    index: true
  },
  assignedDate: {
    type: Date,
    index: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Maintenance and Service History
  maintenanceHistory: [{
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ['routine', 'repair', 'upgrade', 'cleaning', 'inspection'],
      required: true
    },
    description: { type: String, required: true },
    cost: { type: Number, min: 0 },
    performedBy: String,
    serviceProvider: String,
    nextMaintenanceDate: Date,
    warrantyClaimId: String,
    notes: String,
    attachments: [{
      filename: String,
      path: String,
      uploadedAt: { type: Date, default: Date.now }
    }]
  }],
  
  // Asset Tags and Labels
  tags: [String],
  qrCode: String,
  barcode: String,
  
  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    coverage: Number,
    validFrom: Date,
    validUntil: Date,
    premium: Number
  },
  
  // Compliance and Certifications
  compliance: {
    isCompliant: { type: Boolean, default: true },
    standards: [String], // ISO, FCC, CE, etc.
    certifications: [{
      name: String,
      number: String,
      validUntil: Date,
      issuedBy: String
    }],
    lastAuditDate: Date,
    nextAuditDate: Date
  },
  
  // Financial Information
  accounting: {
    assetCategory: String,
    costCenter: String,
    budgetCode: String,
    leaseContract: String,
    leaseExpiry: Date,
    monthlyLeaseCost: Number,
    taxDeductible: { type: Boolean, default: true }
  },
  
  // Disposal Information
  disposal: {
    disposalDate: Date,
    disposalMethod: {
      type: String,
      enum: ['sold', 'donated', 'recycled', 'destroyed', 'returned_vendor']
    },
    disposalValue: Number,
    disposalNotes: String,
    environmentalCertificate: String,
    disposedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Custom Fields for extensibility
  customFields: [{
    name: { type: String, required: true },
    value: String,
    type: {
      type: String,
      enum: ['text', 'number', 'date', 'boolean'],
      default: 'text'
    }
  }],
  
  // Asset History Tracking
  statusHistory: [{
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: String,
    previousStatus: String
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

// Virtual for asset age in years
assetSchema.virtual('ageInYears').get(function() {
  if (!this.purchaseDate) return null;
  const today = new Date();
  const ageInMs = today - this.purchaseDate;
  return Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365));
});

// Virtual for calculated current value based on depreciation
assetSchema.virtual('calculatedValue').get(function() {
  if (!this.purchaseCost || !this.purchaseDate || !this.depreciationRate) {
    return this.currentValue || this.purchaseCost || 0;
  }
  
  const ageInYears = this.ageInYears;
  const depreciationAmount = this.purchaseCost * (this.depreciationRate / 100) * ageInYears;
  const calculatedValue = Math.max(0, this.purchaseCost - depreciationAmount);
  
  return Math.round(calculatedValue * 100) / 100; // Round to 2 decimal places
};

// Virtual for warranty status
assetSchema.virtual('warrantyStatus').get(function() {
  if (!this.warrantyExpiry) return 'unknown';
  const today = new Date();
  
  if (this.warrantyExpiry > today) {
    const daysLeft = Math.ceil((this.warrantyExpiry - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30) return 'expiring_soon';
    return 'active';
  }
  return 'expired';
});

// Virtual for next maintenance due
assetSchema.virtual('nextMaintenanceDue').get(function() {
  if (!this.maintenanceHistory.length) return null;
  
  const lastMaintenance = this.maintenanceHistory[this.maintenanceHistory.length - 1];
  return lastMaintenance.nextMaintenanceDate;
});

// Virtual for full asset name
assetSchema.virtual('fullName').get(function() {
  const parts = [this.brand, this.model, this.assetType].filter(Boolean);
  return parts.join(' ') || this.assetId;
});

// Compound indexes for efficient queries
assetSchema.index({ assetType: 1, status: 1 });
assetSchema.index({ assignedTo: 1, status: 1 });
assetSchema.index({ status: 1, currentLocation: 1 });
assetSchema.index({ warrantyExpiry: 1, status: 1 });
assetSchema.index({ purchaseDate: 1, status: 1 });

// Text index for search
assetSchema.index({
  assetId: 'text',
  brand: 'text',
  model: 'text',
  serialNumber: 'text',
  currentLocation: 'text',
  tags: 'text'
});

// Pre-save middleware to generate Asset ID
assetSchema.pre('save', async function(next) {
  if (!this.assetId && this.isNew) {
    try {
      const year = new Date().getFullYear();
      const prefix = `ASSET-${year}-`;
      
      // Find the latest asset ID for this year
      const latestAsset = await this.constructor.findOne({
        assetId: new RegExp(`^${prefix}`)
      }).sort({ assetId: -1 });
      
      let sequence = 1;
      if (latestAsset && latestAsset.assetId) {
        const lastSequence = parseInt(latestAsset.assetId.split('-').pop());
        sequence = lastSequence + 1;
      }
      
      // Generate asset ID with 6-digit sequence
      this.assetId = `${prefix}${sequence.toString().padStart(6, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

// Pre-save middleware to update current value
assetSchema.pre('save', function(next) {
  if (this.isModified('purchaseCost') || this.isModified('purchaseDate') || this.isModified('depreciationRate')) {
    this.currentValue = this.calculatedValue;
  }
  next();
});

// Pre-save middleware to track status changes
assetSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    const oldStatus = this.get('status', null, { getters: false });
    this.statusHistory.push({
      status: this.status,
      changedBy: this.modifiedBy || this.createdBy,
      reason: this.statusChangeReason || '',
      previousStatus: oldStatus
    });
    
    // Clear temporary fields
    this.statusChangeReason = undefined;
  }
  next();
});

// Static method to find available assets
assetSchema.statics.findAvailable = function(assetType = null) {
  const query = { status: 'available' };
  if (assetType) query.assetType = assetType;
  
  return this.find(query).sort({ purchaseDate: -1 });
};

// Static method to find assets by location
assetSchema.statics.findByLocation = function(location) {
  return this.find({ currentLocation: location })
    .populate('assignedTo', 'firstName lastName associateId')
    .sort({ assetType: 1, brand: 1 });
};

// Static method to find assets needing maintenance
assetSchema.statics.findMaintenanceDue = function() {
  const today = new Date();
  
  return this.find({
    status: { $in: ['allocated', 'available'] },
    'maintenanceHistory.nextMaintenanceDate': { $lte: today }
  });
};

// Static method to find expiring warranties
assetSchema.statics.findExpiringWarranties = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    warrantyExpiry: {
      $gte: new Date(),
      $lte: futureDate
    },
    status: { $ne: 'disposed' }
  }).sort({ warrantyExpiry: 1 });
};

// Static method for asset search
assetSchema.statics.searchAssets = function(query, options = {}) {
  const {
    assetType,
    status,
    location,
    assignedTo,
    fromDate,
    toDate,
    limit = 20,
    page = 1
  } = options;
  
  const searchCriteria = {};
  
  if (assetType) searchCriteria.assetType = assetType;
  if (status) searchCriteria.status = status;
  if (location) searchCriteria.currentLocation = new RegExp(location, 'i');
  if (assignedTo) searchCriteria.assignedTo = assignedTo;
  if (fromDate || toDate) {
    searchCriteria.purchaseDate = {};
    if (fromDate) searchCriteria.purchaseDate.$gte = new Date(fromDate);
    if (toDate) searchCriteria.purchaseDate.$lte = new Date(toDate);
  }
  
  if (query) {
    searchCriteria.$text = { $search: query };
  }
  
  return this.find(searchCriteria)
    .populate('assignedTo', 'firstName lastName associateId email')
    .populate('createdBy', 'firstName lastName email')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 });
};

// Instance method to assign asset
assetSchema.methods.assignTo = function(associateId, assignedBy, location = null) {
  this.assignedTo = associateId;
  this.assignedDate = new Date();
  this.assignedBy = assignedBy;
  this.status = 'allocated';
  if (location) this.currentLocation = location;
  this.statusChangeReason = `Assigned to associate: ${associateId}`;
  this.modifiedBy = assignedBy;
};

// Instance method to return asset
assetSchema.methods.returnAsset = function(returnedBy, condition = 'good', location = null) {
  this.assignedTo = null;
  this.assignedDate = null;
  this.assignedBy = null;
  this.status = 'available';
  this.conditionRating = condition;
  if (location) this.currentLocation = location;
  this.statusChangeReason = `Asset returned in ${condition} condition`;
  this.modifiedBy = returnedBy;
};

// Instance method to add maintenance record
assetSchema.methods.addMaintenance = function(maintenanceData) {
  this.maintenanceHistory.push({
    ...maintenanceData,
    date: maintenanceData.date || new Date()
  });
  
  // Sort maintenance history by date (most recent first)
  this.maintenanceHistory.sort((a, b) => b.date - a.date);
};

// Instance method to update condition
assetSchema.methods.updateCondition = function(condition, updatedBy, notes = '') {
  this.conditionRating = condition;
  this.statusChangeReason = `Condition updated to ${condition}: ${notes}`;
  this.modifiedBy = updatedBy;
  
  // If asset is damaged, update status
  if (condition === 'damaged' && this.status !== 'under_maintenance') {
    this.status = 'damaged';
  }
};

module.exports = mongoose.model('Asset', assetSchema);