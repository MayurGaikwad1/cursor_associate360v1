# Associate 360 Platform

A comprehensive Associate and Asset Management platform designed for managing off-role employees under T&M (Time and Material) agreements. The platform provides end-to-end lifecycle management including hiring, onboarding, asset allocation, attendance tracking, leave management, and offboarding with complete asset recovery.

## 🚀 Features

### Core Functionality

#### 🏢 Job Management
- **Custom Manager Interface**: Job posting page with HOD, department auto-generation, experience requirements, DOJ, job description capture
- **Hardware/Software Requirements**: Detailed asset requirements specification
- **Upload-based Approvals**: Document upload system for job approvals
- **Auto Job ID Generation**: Automatic generation of unique Job IDs (JOB-YYYY-NNNN format)
- **Procurement Routing**: Automatic routing to procurement inbox after approval

#### 📧 Procurement Inbox
- **Centralized Job Management**: Receive approved job details from managers
- **Candidate Data Management**: Fill in candidate information post-TL selection
- **DOJ Updates**: Update and confirm Date of Joining
- **Auto-ticket Generation**: Trigger automated tickets for Asset Allocation, Domain ID Creation, and RMail ID creation

#### 👥 Associate Management
- **Complete Lifecycle Management**: From onboarding to offboarding
- **Auto Associate ID Generation**: Unique associate identifiers (ASSOC-YYYY-NNNN)
- **Attendance Tracking**: Comprehensive time tracking with multiple work modes
- **Leave Management**: Application, approval, and calendar integration
- **Cost Tracking**: Monthly cost and budget management

#### 💻 Asset Management
- **Comprehensive Asset Inventory**: Complete asset lifecycle tracking
- **Auto Asset ID Generation**: Unique asset identifiers (ASSET-YYYY-NNNNNN)
- **Assignment Tracking**: Real-time asset allocation and recovery
- **Maintenance Management**: Scheduled and reactive maintenance tracking
- **Depreciation Calculations**: Automatic asset value calculations
- **Serial Number Tracking**: Complete traceability

#### ✅ Clearance Management
- **Multi-department Clearance**: Asset, IT, Finance, and HR clearance tracking
- **Advanced Filtering**: Filter by employee ID, status, LWD range
- **Search Capabilities**: Comprehensive search across clearance records
- **Asset Recovery Tracking**: Serial number matching and recovery status
- **Bulk Clearance**: Template-based bulk processing with conditional status
- **Clearance Status Tracking**: Approved vs. Pending status management

#### 📧 Automated Notifications
- **Job Approval Emails**: Automatic notifications on job approvals
- **Resignation Workflow**: Approval and initiation notifications
- **Asset Clearance Alerts**: Asset recovery and clearance notifications
- **LWD Alerts**: 15-day and 1-day prior last working day alerts
- **Comprehensive Email Templates**: Professional email templates for all workflows

#### 🔐 Role-based Access Control
- **Managers**: Job creation, resignation initiation/approval, LWD editing
- **Procurement**: Job data filling, candidate management, provisioning ticket triggers
- **Asset Team**: Asset receipt updates, recovery operations, report generation
- **Branch Ops/Admin/IT**: Asset detail submission with restricted access
- **Granular Permissions**: Fine-grained access control per user role

#### 🔄 External Integrations
- **Jira Integration**: Automatic ticket creation and tracking for onboarding/offboarding tasks
- **Asset Management Portal**: Bidirectional synchronization with external asset systems
- **Daily Batch Updates**: Automated synchronization of associate-level asset history
- **Jira Ticket Tracking**: Auto-generated and tracked Jira Ticket IDs for visibility

#### 📊 Reporting & Analytics
- **Real-time Dashboards**: Role-based dashboard with live updates
- **Cost Analysis**: Resource and asset cost tracking and analytics
- **Asset Utilization**: Comprehensive asset utilization reports
- **Attendance Analytics**: Detailed attendance and leave analytics
- **Custom Reports**: Configurable reporting system

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **Angular 17**: Modern SPA with TypeScript
- **Angular Material**: Google's Material Design components
- **PrimeNG**: Rich UI component library
- **Chart.js**: Interactive charts and analytics
- **ngx-toastr**: Toast notifications
- **Responsive Design**: Mobile-first responsive interface

#### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication
- **Multer**: File upload handling
- **node-cron**: Scheduled job processing
- **Comprehensive API**: RESTful API design

#### Security
- **JWT Tokens**: Stateless authentication
- **bcrypt**: Password hashing
- **Helmet**: Security headers
- **Rate Limiting**: DDoS protection
- **Role-based Access**: Granular permission system
- **Input Validation**: Comprehensive request validation

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd associate360-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   ```bash
   cp server/.env.example server/.env
   ```

4. **Configure environment variables in `server/.env`**
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/associate360

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@company.com
   EMAIL_PASS=your_email_password

   # Jira Configuration
   JIRA_BASE_URL=https://your-domain.atlassian.net
   JIRA_USERNAME=your_jira_username
   JIRA_API_TOKEN=your_jira_api_token
   JIRA_PROJECT_KEY=ASSOC360

   # Asset Portal Configuration
   ASSET_PORTAL_URL=https://your-asset-portal.com/api
   ASSET_PORTAL_API_KEY=your_asset_portal_api_key
   ```

5. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod

   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:5.0
   ```

6. **Initialize Database**
   ```bash
   cd server
   npm run init-db  # This will create initial collections and seed data
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Angular CLI globally (if not installed)**
   ```bash
   npm install -g @angular/cli
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run server
   ```
   Backend will run on `http://localhost:3000`

2. **Start the frontend (in a new terminal)**
   ```bash
   npm run client
   ```
   Frontend will run on `http://localhost:4200`

3. **Run both simultaneously**
   ```bash
   npm run dev
   ```

### Production Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build:prod
   ```

2. **Start the production server**
   ```bash
   cd server
   NODE_ENV=production npm start
   ```

## 🔧 Configuration

### Default Admin User

The system creates a default admin user during initialization:
- **Email**: admin@associate360.com
- **Password**: Admin@123
- **Role**: admin

**⚠️ Important**: Change the default password immediately after first login.

### Role Configuration

#### Manager Permissions
- Create and manage job postings
- Initiate and approve resignations
- Edit Last Working Day (LWD)
- View team analytics

#### Procurement Permissions
- Access procurement inbox
- Fill candidate data
- Trigger provisioning tickets
- Manage candidate lifecycle

#### Asset Team Permissions
- Manage asset inventory
- Process asset assignments
- Handle asset recovery
- Generate asset reports

#### Admin Permissions
- Complete system access
- User management
- System configuration
- Audit log access

### Email Templates

Customize email templates in `server/templates/`:
- `job-approval.html`
- `resignation-approval.html`
- `asset-clearance.html`
- `lwd-alert.html`
- `onboarding-complete.html`

### Jira Integration

Configure Jira integration for automatic ticket creation:

1. **Create Jira API Token**
   - Go to Jira → Profile → Security → Create API Token

2. **Update Environment Variables**
   ```env
   JIRA_BASE_URL=https://your-domain.atlassian.net
   JIRA_USERNAME=your_email@company.com
   JIRA_API_TOKEN=your_api_token
   JIRA_PROJECT_KEY=ASSOC360
   ```

3. **Ticket Types**
   - Onboarding tickets
   - Offboarding tickets
   - Asset allocation tickets
   - Domain creation tickets
   - Email setup tickets

## 📊 Database Schema

### Key Collections

#### Users
- Role-based user management
- Permission system
- Authentication details

#### Job Postings
- Auto-generated Job IDs
- Approval workflow
- Document attachments

#### Associates
- Complete associate information
- Employment lifecycle
- Cost tracking

#### Assets
- Comprehensive asset inventory
- Assignment history
- Maintenance records

#### Clearance Records
- Multi-department clearance
- Asset recovery tracking
- Status management

For detailed schema information, see `database/schema.sql`

## 🔄 Batch Processing

### Scheduled Jobs

#### Daily Asset Sync (2:00 AM)
- Synchronizes with Asset Management Portal
- Updates asset information
- Processes assignment changes

#### LWD Alert Processing (9:00 AM)
- Sends 15-day LWD alerts
- Sends 1-day LWD alerts
- Updates notification status

#### Email Queue Processing (Every 5 minutes)
- Processes pending emails
- Retries failed deliveries
- Updates email status

#### Attendance Sync (11:30 PM)
- Consolidates daily attendance
- Calculates work hours
- Generates attendance reports

## 🛡️ Security Features

### Authentication
- JWT-based stateless authentication
- Password strength requirements
- Account lockout after failed attempts
- Session timeout management

### Authorization
- Role-based access control (RBAC)
- Granular permissions
- API endpoint protection
- Resource-level security

### Data Protection
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### API Security
- Rate limiting
- Request size limits
- CORS configuration
- Security headers (Helmet)

## 📈 Monitoring & Logging

### Application Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- User activity logging

### Audit Trail
- Complete audit logs
- User action tracking
- Data change history
- Security event logging

### System Health
- Database connection monitoring
- External API health checks
- File system monitoring
- Memory and CPU usage

## 🚀 Deployment

### Production Checklist

1. **Environment Setup**
   - [ ] Production MongoDB cluster
   - [ ] SSL certificates configured
   - [ ] Environment variables set
   - [ ] SMTP server configured

2. **Security Configuration**
   - [ ] Change default passwords
   - [ ] Configure firewall rules
   - [ ] Enable HTTPS
   - [ ] Set up backup strategy

3. **Performance Optimization**
   - [ ] Database indexing optimized
   - [ ] CDN configured for static assets
   - [ ] Compression enabled
   - [ ] Caching implemented

4. **Monitoring Setup**
   - [ ] Log aggregation configured
   - [ ] Performance monitoring enabled
   - [ ] Alerting configured
   - [ ] Backup verification

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale services
docker-compose up -d --scale api=3
```

### Cloud Deployment

The application is cloud-ready and can be deployed on:
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- Microsoft Azure
- DigitalOcean
- Heroku

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Job Management Endpoints
```
GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
POST   /api/jobs/:id/approve
POST   /api/jobs/:id/reject
```

### Asset Management Endpoints
```
GET    /api/assets
POST   /api/assets
GET    /api/assets/:id
PUT    /api/assets/:id
POST   /api/assets/:id/assign
POST   /api/assets/:id/return
```

### Clearance Management Endpoints
```
GET    /api/clearance
POST   /api/clearance
POST   /api/clearance/bulk
GET    /api/clearance/:id
PUT    /api/clearance/:id
```

For complete API documentation, visit `/api/docs` when the server is running.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@associate360.com
- Documentation: [docs/](docs/)
- Issues: GitHub Issues

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Complete job management workflow
- Asset management and tracking
- Clearance process automation
- Role-based access control
- Jira and email integrations
- Comprehensive reporting

### Upcoming Features
- Mobile application
- Advanced analytics with ML
- Biometric attendance integration
- Document management system
- Multi-tenant architecture

---

**Associate 360 Platform** - Comprehensive Associate and Asset Management Solution