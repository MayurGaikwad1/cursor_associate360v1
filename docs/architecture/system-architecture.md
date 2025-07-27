# Associate 360 Platform - System Architecture

## Overview

The Associate 360 Platform is a comprehensive solution for managing off-role employees under T&M (Time and Material) agreements. The platform provides end-to-end lifecycle management including hiring, onboarding, asset allocation, attendance tracking, leave management, and offboarding with complete asset recovery.

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Angular 17 SPA with Material Design & PrimeNG Components      │
│  • Role-based dashboards and interfaces                        │
│  • Responsive design for desktop and mobile                    │
│  • Real-time notifications and updates                         │
└─────────────────────────────────────────────────────────────────┘
                                    │
                              HTTP/HTTPS (REST API)
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  Node.js + Express.js with Security Middleware                 │
│  • Authentication & Authorization (JWT)                        │
│  • Rate limiting and request validation                        │
│  • File upload handling (Multer)                              │
│  • Error handling and logging                                  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                              Internal API Calls
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  Microservices Architecture                                     │
│  • Job Management Service                                       │
│  • Associate Management Service                                 │
│  • Asset Management Service                                     │
│  • Clearance Management Service                                 │
│  • Notification Service                                         │
│  • Reporting Service                                            │
│  • Integration Service                                          │
└─────────────────────────────────────────────────────────────────┘
                                    │
                              Database Queries
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB with Mongoose ODM                                      │
│  • User Management Collection                                   │
│  • Job Postings Collection                                      │
│  • Associates Collection                                        │
│  • Assets Collection                                            │
│  • Asset Assignments Collection                                 │
│  • Clearance Records Collection                                 │
│  • Attendance & Leave Collections                               │
│  • Audit Logs Collection                                        │
└─────────────────────────────────────────────────────────────────┘
                                    │
                              External Integrations
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                   External Services Layer                      │
├─────────────────────────────────────────────────────────────────┤
│  • Jira Integration (Ticket Management)                        │
│  • Asset Management Portal API                                  │
│  • Email Service (SMTP/SendGrid)                               │
│  • File Storage (Local/Cloud)                                  │
│  • Backup & Monitoring Services                                │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. Authentication Module
- **Login Component**: Secure authentication with role-based redirection
- **Password Reset**: Self-service password reset with email verification
- **Session Management**: JWT token handling with refresh mechanism

#### 2. Dashboard Module
- **Role-based Dashboards**: Customized views per user role
- **Widget System**: Configurable dashboard widgets
- **Real-time Analytics**: Live data updates and notifications

#### 3. Job Management Module
- **Job Creation**: Rich form with file uploads and validation
- **Job Approval Workflow**: Multi-step approval process
- **Procurement Interface**: Dedicated interface for procurement team

#### 4. Associate Management Module
- **Associate Lifecycle**: Complete onboarding to offboarding workflow
- **Attendance Tracking**: Time tracking with multiple work modes
- **Leave Management**: Comprehensive leave application and approval

#### 5. Asset Management Module
- **Asset Inventory**: Complete asset lifecycle management
- **Assignment Tracking**: Real-time asset allocation status
- **Maintenance Management**: Scheduled and reactive maintenance

#### 6. Clearance Management Module
- **Clearance Dashboard**: Multi-department clearance tracking
- **Bulk Operations**: Template-based bulk clearance processing
- **Recovery Tracking**: Asset recovery with condition assessment

### Backend Services

#### 1. Authentication Service
```javascript
// JWT-based authentication with role-based permissions
- User registration and validation
- Password hashing with bcrypt
- Session management with refresh tokens
- Role-based access control (RBAC)
```

#### 2. Job Management Service
```javascript
// Complete job lifecycle management
- Auto-generated Job IDs (JOB-YYYY-NNNN)
- Department auto-population based on HOD
- Workflow state management
- Document upload and approval tracking
```

#### 3. Asset Management Service
```javascript
// Comprehensive asset tracking
- Auto-generated Asset IDs (ASSET-YYYY-NNNNNN)
- Depreciation calculations
- Maintenance scheduling
- Location and condition tracking
```

#### 4. Integration Service
```javascript
// External system integrations
- Jira ticket creation and tracking
- Asset portal synchronization
- Email notification service
- Batch processing for data sync
```

### Database Design

#### Collection Strategy
```javascript
// Primary Collections
users: {
  _id, employeeId, username, email, role, department,
  permissions, preferences, security_fields
}

job_postings: {
  _id, jobId, hod, department, positionTitle,
  requirements, budget, status, workflow_history
}

associates: {
  _id, associateId, jobId, personal_info,
  employment_details, cost_management, it_provisioning
}

assets: {
  _id, assetId, assetType, specifications,
  financial_info, maintenance_history, location
}

clearance_records: {
  _id, clearanceId, associateId, status_components,
  recovery_details, timeline, approvals
}
```

#### Indexing Strategy
```javascript
// Performance-optimized indexes
- Compound indexes for frequent query patterns
- Text search indexes for search functionality
- TTL indexes for session management
- Sparse indexes for optional fields
```

## Security Architecture

### Authentication & Authorization
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   API Gateway   │───▶│  Auth Service   │
│                 │    │                 │    │                 │
│ JWT Token       │◀───│ Token Validation│◀───│ User Validation │
│ Local Storage   │    │ Rate Limiting   │    │ Password Hash   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Features
- **JWT Authentication**: Stateless authentication with secure tokens
- **Role-Based Access Control**: Granular permissions per user role
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive request validation with Joi
- **File Upload Security**: Secure file handling with type validation
- **CORS Protection**: Controlled cross-origin requests
- **Helmet Security**: Security headers and protection middleware

## Integration Architecture

### Jira Integration
```javascript
// Automated ticket creation and tracking
POST /api/integrations/jira/tickets
{
  "type": "onboarding|offboarding|asset_allocation",
  "associateId": "ASSOC-2024-0001",
  "priority": "medium",
  "description": "Auto-generated ticket details"
}
```

### Asset Portal Integration
```javascript
// Bidirectional asset synchronization
- Daily batch sync for asset master data
- Real-time updates for asset assignments
- Asset lifecycle status synchronization
- Maintenance record integration
```

### Email Service Integration
```javascript
// Automated notification system
- Template-based email generation
- Multi-recipient support with CC/BCC
- Delivery tracking and retry mechanism
- Integration with SMTP/SendGrid
```

## Data Flow Architecture

### Job Creation to Fulfillment Flow
```
Manager Creates Job → Auto-generates Job ID → Routes to Approval
     ↓
Approval Workflow → Procurement Assignment → Candidate Selection
     ↓
Associate Onboarding → IT Provisioning → Asset Allocation
     ↓
Active Employment → Attendance/Leave Tracking → Performance Management
     ↓
Resignation/Completion → Clearance Process → Asset Recovery → Final Settlement
```

### Asset Lifecycle Flow
```
Asset Procurement → Inventory Registration → Quality Check
     ↓
Available Pool → Assignment Request → Asset Allocation
     ↓
Active Usage → Maintenance Tracking → Condition Monitoring
     ↓
Return Request → Condition Assessment → Refurbishment/Disposal
```

### Clearance Process Flow
```
Resignation Initiation → Clearance Record Creation → Multi-department Clearance
     ↓
Asset Recovery → IT Access Revocation → Finance Clearance
     ↓
HR Final Approval → Documentation → Archive
```

## Scalability Considerations

### Horizontal Scaling
- **Microservices Architecture**: Independent service scaling
- **Database Sharding**: Collection-based data distribution
- **Load Balancing**: Multiple server instances with load balancer
- **CDN Integration**: Static asset delivery optimization

### Performance Optimization
- **Caching Strategy**: Redis for session and frequently accessed data
- **Database Optimization**: Proper indexing and query optimization
- **Lazy Loading**: Component and data lazy loading in frontend
- **Pagination**: Efficient data pagination for large datasets

### Monitoring & Observability
- **Application Monitoring**: Performance metrics and error tracking
- **Database Monitoring**: Query performance and connection pooling
- **Log Aggregation**: Centralized logging with structured formats
- **Health Checks**: Service health endpoints and alerting

## Deployment Architecture

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │───▶│   App Servers   │───▶│   Database      │
│                 │    │   (Clustered)   │    │   (Replica Set) │
│ SSL Termination │    │ PM2 Process Mgr │    │ MongoDB Cluster │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   File Storage  │    │   Backup System │
│   (CDN/Nginx)   │    │   (S3/Local)    │    │   (Automated)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular Dev   │───▶│   Node.js API   │───▶│   MongoDB Dev   │
│   (ng serve)    │    │   (nodemon)     │    │   (local)       │
│ Port 4200       │    │ Port 3000       │    │ Port 27017      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Angular 17 with TypeScript
- **UI Library**: Angular Material + PrimeNG
- **State Management**: RxJS with Services
- **Charts**: Chart.js with ng2-charts
- **File Handling**: File upload with validation
- **Notifications**: ngx-toastr for user feedback

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer middleware
- **Email**: Nodemailer with template support
- **Scheduling**: node-cron for batch jobs
- **Validation**: Joi schema validation

### Infrastructure
- **Reverse Proxy**: Nginx (production)
- **Process Manager**: PM2 for Node.js
- **Monitoring**: Custom health checks
- **Backup**: Automated MongoDB backups
- **SSL**: Let's Encrypt certificates
- **CI/CD**: GitHub Actions (optional)

## API Design Principles

### RESTful API Design
```
GET    /api/jobs                 # List jobs with pagination
POST   /api/jobs                 # Create new job
GET    /api/jobs/:id              # Get specific job
PUT    /api/jobs/:id              # Update job
DELETE /api/jobs/:id              # Delete job
POST   /api/jobs/:id/approve      # Approve job
POST   /api/jobs/:id/reject       # Reject job
```

### Response Format
```javascript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}

// Error Response
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [/* validation errors */],
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Future Enhancements

### Phase 1 Extensions
- Mobile application (React Native/Flutter)
- Advanced analytics and machine learning
- Integration with HR systems (SAP/Workday)
- Biometric attendance integration

### Phase 2 Extensions
- Multi-tenant architecture
- Advanced workflow engine
- Document management system
- Contract lifecycle management

### Phase 3 Extensions
- AI-powered asset optimization
- Predictive maintenance
- Advanced cost analytics
- Global deployment capabilities

This architecture provides a solid foundation for the Associate 360 platform while maintaining flexibility for future enhancements and scale requirements.