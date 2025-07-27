-- Associate 360 Platform Database Schema
-- MongoDB Collections Structure (SQL-like representation for clarity)

-- Users Collection
-- Stores all system users with role-based access control
CREATE TABLE users (
    _id ObjectId PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('manager', 'procurement', 'asset_team', 'branch_ops', 'admin', 'it_team') NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    reporting_manager ObjectId REFERENCES users(_id),
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT true,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by ObjectId REFERENCES users(_id),
    
    -- Indexes
    INDEX idx_employee_id (employee_id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_department (department),
    INDEX idx_is_active (is_active)
);

-- Job Postings Collection
-- Manages job creation and approval workflow
CREATE TABLE job_postings (
    _id ObjectId PRIMARY KEY,
    job_id VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated: JOB-YYYY-NNNN
    hod ObjectId REFERENCES users(_id) NOT NULL,
    department VARCHAR(100) NOT NULL, -- System-generated based on HOD
    position_title VARCHAR(200) NOT NULL,
    expected_experience VARCHAR(50),
    expected_doj DATE,
    job_description TEXT,
    hardware_requirements TEXT,
    software_requirements TEXT,
    budget_approved DECIMAL(10,2),
    approval_documents ARRAY, -- File paths for uploaded approvals
    
    -- Workflow Status
    status ENUM('draft', 'pending_approval', 'approved', 'in_procurement', 'filled', 'cancelled') DEFAULT 'draft',
    
    -- Approval Workflow
    approved_by ObjectId REFERENCES users(_id),
    approved_at DATETIME,
    approval_comments TEXT,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by ObjectId REFERENCES users(_id),
    
    -- Indexes
    INDEX idx_job_id (job_id),
    INDEX idx_hod (hod),
    INDEX idx_department (department),
    INDEX idx_status (status),
    INDEX idx_expected_doj (expected_doj),
    INDEX idx_created_at (created_at)
);

-- Associates Collection
-- Stores information about hired associates
CREATE TABLE associates (
    _id ObjectId PRIMARY KEY,
    associate_id VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated: ASSOC-YYYY-NNNN
    job_id ObjectId REFERENCES job_postings(_id) NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    
    -- Employment Details
    designation VARCHAR(100),
    department VARCHAR(100),
    reporting_manager ObjectId REFERENCES users(_id),
    actual_doj DATE,
    expected_lwd DATE,
    actual_lwd DATE,
    employment_status ENUM('active', 'resigned', 'terminated', 'completed') DEFAULT 'active',
    
    -- Cost Management
    monthly_cost DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'INR',
    
    -- IT Provisioning
    domain_id VARCHAR(100),
    rmail_id VARCHAR(100),
    
    -- Resignation Details
    resignation_date DATE,
    resignation_reason TEXT,
    resignation_approved_by ObjectId REFERENCES users(_id),
    resignation_approved_at DATETIME,
    notice_period_days INTEGER DEFAULT 30,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by ObjectId REFERENCES users(_id),
    
    -- Indexes
    INDEX idx_associate_id (associate_id),
    INDEX idx_job_id (job_id),
    INDEX idx_email (email),
    INDEX idx_department (department),
    INDEX idx_employment_status (employment_status),
    INDEX idx_actual_doj (actual_doj),
    INDEX idx_expected_lwd (expected_lwd),
    INDEX idx_resignation_date (resignation_date)
);

-- Assets Collection
-- Master asset inventory
CREATE TABLE assets (
    _id ObjectId PRIMARY KEY,
    asset_id VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated: ASSET-YYYY-NNNN
    asset_type ENUM('laptop', 'desktop', 'monitor', 'keyboard', 'mouse', 'headset', 'mobile', 'tablet', 'other') NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    specifications TEXT,
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    warranty_expiry DATE,
    depreciation_rate DECIMAL(5,2),
    current_value DECIMAL(10,2),
    
    -- Asset Status
    status ENUM('available', 'allocated', 'under_maintenance', 'damaged', 'disposed') DEFAULT 'available',
    condition_rating ENUM('excellent', 'good', 'fair', 'poor') DEFAULT 'excellent',
    
    -- Location and Assignment
    current_location VARCHAR(200),
    assigned_to ObjectId REFERENCES associates(_id),
    assigned_date DATE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by ObjectId REFERENCES users(_id),
    
    -- Indexes
    INDEX idx_asset_id (asset_id),
    INDEX idx_asset_type (asset_type),
    INDEX idx_serial_number (serial_number),
    INDEX idx_status (status),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_assigned_date (assigned_date)
);

-- Asset Assignments Collection
-- Tracks asset allocation history
CREATE TABLE asset_assignments (
    _id ObjectId PRIMARY KEY,
    assignment_id VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated: ASSIGN-YYYY-NNNN
    asset_id ObjectId REFERENCES assets(_id) NOT NULL,
    associate_id ObjectId REFERENCES associates(_id) NOT NULL,
    
    -- Assignment Details
    assigned_date DATE NOT NULL,
    expected_return_date DATE,
    actual_return_date DATE,
    assignment_reason ENUM('onboarding', 'replacement', 'additional', 'temporary') DEFAULT 'onboarding',
    
    -- Return Details
    return_condition ENUM('excellent', 'good', 'fair', 'poor', 'damaged'),
    return_notes TEXT,
    
    -- Status
    status ENUM('active', 'returned', 'pending_return', 'lost', 'damaged') DEFAULT 'active',
    
    -- Approvals
    assigned_by ObjectId REFERENCES users(_id),
    returned_to ObjectId REFERENCES users(_id),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_assignment_id (assignment_id),
    INDEX idx_asset_id (asset_id),
    INDEX idx_associate_id (associate_id),
    INDEX idx_assigned_date (assigned_date),
    INDEX idx_status (status),
    INDEX idx_actual_return_date (actual_return_date)
);

-- Clearance Records Collection
-- Manages offboarding clearance process
CREATE TABLE clearance_records (
    _id ObjectId PRIMARY KEY,
    clearance_id VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated: CLR-YYYY-NNNN
    associate_id ObjectId REFERENCES associates(_id) NOT NULL,
    
    -- Clearance Status
    overall_status ENUM('pending', 'partial', 'completed', 'escalated') DEFAULT 'pending',
    
    -- Individual Clearance Components
    asset_clearance_status ENUM('pending', 'completed', 'partial', 'waived') DEFAULT 'pending',
    it_clearance_status ENUM('pending', 'completed', 'partial', 'waived') DEFAULT 'pending',
    finance_clearance_status ENUM('pending', 'completed', 'partial', 'waived') DEFAULT 'pending',
    hr_clearance_status ENUM('pending', 'completed', 'partial', 'waived') DEFAULT 'pending',
    
    -- Asset Recovery Details
    total_assets_assigned INTEGER DEFAULT 0,
    assets_recovered INTEGER DEFAULT 0,
    assets_pending INTEGER DEFAULT 0,
    assets_damaged INTEGER DEFAULT 0,
    assets_lost INTEGER DEFAULT 0,
    
    -- Comments and Notes
    clearance_notes TEXT,
    recovery_comments TEXT,
    
    -- Timeline
    clearance_initiated_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    
    -- Responsible Personnel
    initiated_by ObjectId REFERENCES users(_id),
    asset_cleared_by ObjectId REFERENCES users(_id),
    it_cleared_by ObjectId REFERENCES users(_id),
    final_approved_by ObjectId REFERENCES users(_id),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_clearance_id (clearance_id),
    INDEX idx_associate_id (associate_id),
    INDEX idx_overall_status (overall_status),
    INDEX idx_clearance_initiated_date (clearance_initiated_date),
    INDEX idx_expected_completion_date (expected_completion_date)
);

-- Attendance Records Collection
-- Tracks associate attendance
CREATE TABLE attendance_records (
    _id ObjectId PRIMARY KEY,
    associate_id ObjectId REFERENCES associates(_id) NOT NULL,
    attendance_date DATE NOT NULL,
    
    -- Time Tracking
    check_in_time TIME,
    check_out_time TIME,
    break_hours DECIMAL(3,2) DEFAULT 0,
    total_hours DECIMAL(4,2),
    
    -- Status
    status ENUM('present', 'absent', 'half_day', 'leave', 'holiday', 'weekend') NOT NULL,
    attendance_type ENUM('office', 'remote', 'client_site') DEFAULT 'office',
    
    -- Location (for remote/client site work)
    work_location VARCHAR(200),
    
    -- Comments
    remarks TEXT,
    
    -- Approval
    approved_by ObjectId REFERENCES users(_id),
    approved_at DATETIME,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_associate_attendance (associate_id, attendance_date),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_status (status),
    UNIQUE KEY unique_associate_date (associate_id, attendance_date)
);

-- Leave Records Collection
-- Manages leave applications and approvals
CREATE TABLE leave_records (
    _id ObjectId PRIMARY KEY,
    leave_id VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated: LEAVE-YYYY-NNNN
    associate_id ObjectId REFERENCES associates(_id) NOT NULL,
    
    -- Leave Details
    leave_type ENUM('casual', 'sick', 'earned', 'maternity', 'paternity', 'emergency', 'unpaid') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    
    -- Status and Approval
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    approved_by ObjectId REFERENCES users(_id),
    approved_at DATETIME,
    approval_comments TEXT,
    
    -- Emergency Contact (for emergency leaves)
    emergency_contact VARCHAR(15),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_leave_id (leave_id),
    INDEX idx_associate_id (associate_id),
    INDEX idx_leave_dates (start_date, end_date),
    INDEX idx_status (status),
    INDEX idx_leave_type (leave_type)
);

-- Jira Tickets Collection
-- Tracks integration with Jira for task management
CREATE TABLE jira_tickets (
    _id ObjectId PRIMARY KEY,
    ticket_id VARCHAR(20) UNIQUE NOT NULL, -- Jira ticket ID
    internal_ref_id VARCHAR(20), -- Our internal reference
    
    -- Ticket Details
    ticket_type ENUM('onboarding', 'offboarding', 'asset_allocation', 'domain_creation', 'email_creation', 'access_provisioning') NOT NULL,
    summary TEXT NOT NULL,
    description TEXT,
    priority ENUM('lowest', 'low', 'medium', 'high', 'highest') DEFAULT 'medium',
    
    -- Related Entities
    associate_id ObjectId REFERENCES associates(_id),
    job_id ObjectId REFERENCES job_postings(_id),
    asset_id ObjectId REFERENCES assets(_id),
    
    -- Status
    status ENUM('open', 'in_progress', 'resolved', 'closed', 'reopened') DEFAULT 'open',
    assignee VARCHAR(100),
    reporter VARCHAR(100),
    
    -- Timeline
    created_date DATETIME,
    updated_date DATETIME,
    resolved_date DATETIME,
    
    -- Comments and Resolution
    resolution TEXT,
    comments TEXT,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_internal_ref_id (internal_ref_id),
    INDEX idx_ticket_type (ticket_type),
    INDEX idx_associate_id (associate_id),
    INDEX idx_status (status),
    INDEX idx_created_date (created_date)
);

-- Email Notifications Collection
-- Tracks all automated email notifications
CREATE TABLE email_notifications (
    _id ObjectId PRIMARY KEY,
    notification_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Email Details
    email_type ENUM('job_approval', 'resignation_approval', 'asset_clearance', 'lwd_alert_15', 'lwd_alert_1', 'resignation_initiation', 'onboarding_completion', 'offboarding_completion') NOT NULL,
    recipients ARRAY, -- Array of email addresses
    cc_recipients ARRAY,
    bcc_recipients ARRAY,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    
    -- Related Entities
    associate_id ObjectId REFERENCES associates(_id),
    job_id ObjectId REFERENCES job_postings(_id),
    
    -- Status
    status ENUM('pending', 'sent', 'failed', 'bounced') DEFAULT 'pending',
    sent_at DATETIME,
    failed_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Template Information
    template_name VARCHAR(100),
    template_version VARCHAR(10),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_notification_id (notification_id),
    INDEX idx_email_type (email_type),
    INDEX idx_status (status),
    INDEX idx_associate_id (associate_id),
    INDEX idx_sent_at (sent_at)
);

-- Audit Logs Collection
-- Comprehensive audit trail for all system activities
CREATE TABLE audit_logs (
    _id ObjectId PRIMARY KEY,
    log_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Activity Details
    action ENUM('create', 'update', 'delete', 'approve', 'reject', 'assign', 'return', 'login', 'logout') NOT NULL,
    entity_type ENUM('user', 'job', 'associate', 'asset', 'assignment', 'clearance', 'attendance', 'leave', 'ticket') NOT NULL,
    entity_id ObjectId NOT NULL,
    
    -- User and Context
    performed_by ObjectId REFERENCES users(_id),
    user_role VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Changes
    old_values JSON,
    new_values JSON,
    changed_fields ARRAY,
    
    -- Additional Context
    description TEXT,
    session_id VARCHAR(100),
    
    -- Timestamps
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_log_id (log_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_entity_id (entity_id),
    INDEX idx_performed_by (performed_by),
    INDEX idx_timestamp (timestamp)
);

-- System Configuration Collection
-- Stores system-wide configuration settings
CREATE TABLE system_config (
    _id ObjectId PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    config_type ENUM('string', 'number', 'boolean', 'json', 'array') DEFAULT 'string',
    description TEXT,
    is_editable BOOLEAN DEFAULT true,
    category VARCHAR(50),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by ObjectId REFERENCES users(_id),
    
    -- Indexes
    INDEX idx_config_key (config_key),
    INDEX idx_category (category)
);

-- Batch Processing Jobs Collection
-- Tracks scheduled and batch processing jobs
CREATE TABLE batch_jobs (
    _id ObjectId PRIMARY KEY,
    job_name VARCHAR(100) NOT NULL,
    job_type ENUM('daily_asset_sync', 'lwd_alerts', 'attendance_sync', 'jira_sync', 'email_notifications') NOT NULL,
    
    -- Execution Details
    status ENUM('scheduled', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'scheduled',
    scheduled_time DATETIME,
    started_at DATETIME,
    completed_at DATETIME,
    
    -- Processing Statistics
    records_processed INTEGER DEFAULT 0,
    records_successful INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    
    -- Error Handling
    error_message TEXT,
    error_details JSON,
    
    -- Results
    execution_summary JSON,
    log_file_path VARCHAR(500),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_job_type (job_type),
    INDEX idx_status (status),
    INDEX idx_scheduled_time (scheduled_time),
    INDEX idx_started_at (started_at)
);

-- Default Configuration Data
INSERT INTO system_config (config_key, config_value, config_type, description, category) VALUES
('default_notice_period_days', '30', 'number', 'Default notice period in days for associates', 'hr'),
('lwd_alert_days', '[15, 1]', 'array', 'Days before LWD to send alerts', 'notifications'),
('asset_auto_assignment', 'true', 'boolean', 'Enable automatic asset assignment during onboarding', 'assets'),
('jira_integration_enabled', 'true', 'boolean', 'Enable Jira ticket integration', 'integrations'),
('email_notifications_enabled', 'true', 'boolean', 'Enable automated email notifications', 'notifications'),
('batch_processing_enabled', 'true', 'boolean', 'Enable batch processing jobs', 'system'),
('max_file_upload_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)', 'system'),
('supported_file_types', '["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png"]', 'array', 'Supported file types for uploads', 'system'),
('asset_depreciation_rate', '20', 'number', 'Default asset depreciation rate percentage per year', 'assets'),
('automatic_clearance_initiation', 'true', 'boolean', 'Automatically initiate clearance process on resignation approval', 'clearance');