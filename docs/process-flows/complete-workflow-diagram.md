# Associate 360 Platform - Complete Workflow Diagrams

## Overview

This document outlines all major process flows within the Associate 360 Platform, providing detailed workflow diagrams for each core business process from job creation to final clearance.

## 1. Job Creation and Approval Workflow

### Manager Job Creation Process

```mermaid
graph TD
    A[Manager Login] --> B[Access Job Creation]
    B --> C[Fill Job Details Form]
    C --> D{Form Validation}
    D -->|Invalid| C
    D -->|Valid| E[Auto-populate Department]
    E --> F[Upload Approval Documents]
    F --> G[Auto-generate Job ID]
    G --> H[Submit Job for Approval]
    H --> I[Job Status: Pending Approval]
    I --> J[Email Notification to Approver]
    J --> K[Job Routed to Procurement Inbox]
```

### Job Approval Workflow

```mermaid
graph TD
    A[Job in Pending Status] --> B[Approver Reviews Job]
    B --> C{Approval Decision}
    C -->|Approve| D[Update Status to Approved]
    C -->|Reject| E[Update Status to Draft]
    D --> F[Email Notification to Manager]
    D --> G[Route to Procurement Team]
    E --> H[Email Rejection Notification]
    E --> I[Manager Can Revise and Resubmit]
    F --> J[Create Jira Ticket for Procurement]
    G --> K[Job Available in Procurement Inbox]
```

### Procurement Processing

```mermaid
graph TD
    A[Job in Procurement Inbox] --> B[Procurement Team Reviews]
    B --> C[Candidate Sourcing Process]
    C --> D[Technical Leader Selection]
    D --> E[Update Candidate Information]
    E --> F[Confirm Final DOJ]
    F --> G[Trigger Auto-tickets]
    G --> H[Asset Allocation Ticket]
    G --> I[Domain ID Creation Ticket]
    G --> J[RMail ID Creation Ticket]
    H --> K[Asset Team Assignment]
    I --> L[IT Team Assignment]
    J --> M[IT Team Assignment]
```

## 2. Associate Onboarding Process

### Complete Onboarding Workflow

```mermaid
graph TD
    A[Job Filled by Procurement] --> B[Auto-generate Associate ID]
    B --> C[Create Associate Record]
    C --> D[Initiate Onboarding Process]
    D --> E[Parallel Processing]
    E --> F[Asset Allocation Process]
    E --> G[IT Provisioning Process]
    E --> H[HR Documentation Process]
    
    F --> F1[Check Asset Requirements]
    F1 --> F2[Identify Available Assets]
    F2 --> F3[Allocate Assets to Associate]
    F3 --> F4[Update Asset Status to Allocated]
    F4 --> F5[Generate Asset Assignment Record]
    
    G --> G1[Create Domain ID]
    G1 --> G2[Create RMail ID]
    G2 --> G3[Setup Access Permissions]
    G3 --> G4[Generate IT Credentials]
    
    H --> H1[Prepare Welcome Kit]
    H1 --> H2[Setup Workstation]
    H2 --> H3[Orientation Schedule]
    
    F5 --> I[All Processes Complete]
    G4 --> I
    H3 --> I
    I --> J[Onboarding Completion Email]
    J --> K[Associate Status: Active]
```

### Asset Allocation Sub-process

```mermaid
graph TD
    A[Asset Allocation Request] --> B[Review Hardware Requirements]
    B --> C[Query Available Assets]
    C --> D{Assets Available?}
    D -->|Yes| E[Select Appropriate Assets]
    D -->|No| F[Procurement Request]
    E --> G[Verify Asset Condition]
    G --> H[Assign Assets to Associate]
    H --> I[Update Asset Status]
    I --> J[Generate Assignment Record]
    J --> K[Create Jira Ticket for Physical Handover]
    F --> L[Purchase Process]
    L --> M[Asset Received]
    M --> E
```

## 3. Attendance and Leave Management

### Daily Attendance Process

```mermaid
graph TD
    A[Associate Check-in] --> B[Record Attendance Entry]
    B --> C[Validate Work Location]
    C --> D{Location Valid?}
    D -->|Yes| E[Update Attendance Record]
    D -->|No| F[Flag for Manager Review]
    E --> G[Calculate Work Hours]
    G --> H[Update Daily Summary]
    F --> I[Manager Approval Required]
    I --> J{Manager Approves?}
    J -->|Yes| E
    J -->|No| K[Mark as Irregular]
```

### Leave Application Process

```mermaid
graph TD
    A[Associate Applies for Leave] --> B[Select Leave Type]
    B --> C[Enter Leave Dates]
    C --> D[Provide Reason]
    D --> E[Submit Application]
    E --> F[Auto-generate Leave ID]
    F --> G[Route to Manager]
    G --> H[Manager Reviews Application]
    H --> I{Manager Decision}
    I -->|Approve| J[Update Leave Status]
    I -->|Reject| K[Return with Comments]
    J --> L[Update Attendance Calendar]
    L --> M[Email Confirmation]
    K --> N[Associate Can Reapply]
```

## 4. Asset Management Workflow

### Asset Lifecycle Management

```mermaid
graph TD
    A[Asset Procurement] --> B[Asset Registration]
    B --> C[Generate Asset ID]
    C --> D[Quality Check]
    D --> E[Update Asset Inventory]
    E --> F[Asset Available for Allocation]
    F --> G{Assignment Request?}
    G -->|Yes| H[Asset Assignment Process]
    G -->|No| I[Asset in Available Pool]
    H --> J[Asset Status: Allocated]
    J --> K[Monitor Asset Usage]
    K --> L{Maintenance Due?}
    L -->|Yes| M[Schedule Maintenance]
    L -->|No| N{Return Request?}
    M --> O[Asset Under Maintenance]
    O --> P[Maintenance Complete]
    P --> Q[Update Asset Condition]
    N -->|Yes| R[Asset Return Process]
    N -->|No| K
    R --> S[Asset Available]
    Q --> T{Asset Usable?}
    T -->|Yes| S
    T -->|No| U[Asset Disposal Process]
```

### Asset Return and Recovery

```mermaid
graph TD
    A[Asset Return Initiated] --> B[Schedule Return Appointment]
    B --> C[Physical Asset Inspection]
    C --> D[Condition Assessment]
    D --> E{Asset Condition}
    E -->|Excellent/Good| F[Asset Ready for Reallocation]
    E -->|Fair| G[Minor Refurbishment Required]
    E -->|Poor/Damaged| H[Major Repair/Disposal]
    F --> I[Update Asset Status to Available]
    G --> J[Schedule Refurbishment]
    H --> K[Asset Marked for Disposal]
    J --> L[Refurbishment Complete]
    L --> F
    I --> M[Asset Back in Inventory Pool]
```

## 5. Resignation and Offboarding Process

### Resignation Initiation

```mermaid
graph TD
    A[Associate Submits Resignation] --> B[Manager Reviews Resignation]
    B --> C{Manager Decision}
    C -->|Accept| D[Calculate Last Working Day]
    C -->|Negotiate| E[Discussion with Associate]
    D --> F[Update Associate Status]
    F --> G[Auto-initiate Clearance Process]
    G --> H[Create Clearance Record]
    H --> I[Distribute Clearance Tasks]
    E --> J{Agreement Reached?}
    J -->|Yes| K[Update Resignation Terms]
    J -->|No| D
    K --> D
```

### Comprehensive Clearance Process

```mermaid
graph TD
    A[Clearance Process Initiated] --> B[Create Clearance Record]
    B --> C[Generate Clearance ID]
    C --> D[Parallel Clearance Processes]
    
    D --> E[Asset Clearance]
    D --> F[IT Clearance]
    D --> G[Finance Clearance]
    D --> H[HR Clearance]
    
    E --> E1[Identify Assigned Assets]
    E1 --> E2[Schedule Asset Recovery]
    E2 --> E3[Physical Asset Collection]
    E3 --> E4[Asset Condition Assessment]
    E4 --> E5[Update Asset Records]
    E5 --> E6[Asset Clearance Complete]
    
    F --> F1[Revoke System Access]
    F1 --> F2[Disable Domain Account]
    F2 --> F3[Revoke Email Access]
    F3 --> F4[Remove VPN Access]
    F4 --> F5[IT Clearance Complete]
    
    G --> G1[Final Salary Calculation]
    G1 --> G2[Process Final Settlement]
    G2 --> G3[Clear Outstanding Dues]
    G3 --> G4[Finance Clearance Complete]
    
    H --> H1[Return ID Card/Access Cards]
    H1 --> H2[Complete Exit Interview]
    H2 --> H3[Final Documentation]
    H3 --> H4[HR Clearance Complete]
    
    E6 --> I[Check All Clearances]
    F5 --> I
    G4 --> I
    H4 --> I
    
    I --> J{All Clearances Complete?}
    J -->|Yes| K[Overall Clearance Approved]
    J -->|No| L[Pending Clearance Items]
    K --> M[Final Clearance Email]
    M --> N[Archive Associate Record]
    L --> O[Follow-up on Pending Items]
```

## 6. Bulk Clearance Process

### Template-based Bulk Processing

```mermaid
graph TD
    A[Upload Bulk Clearance Template] --> B[Validate Template Format]
    B --> C{Template Valid?}
    C -->|No| D[Return Validation Errors]
    C -->|Yes| E[Process Each Record]
    E --> F[Validate Associate Data]
    F --> G{Data Valid?}
    G -->|No| H[Mark Record as Error]
    G -->|Yes| I[Update Clearance Status]
    I --> J[Check Conditional Logic]
    J --> K{Conditions Met?}
    K -->|Yes| L[Approve Clearance]
    K -->|No| M[Mark as Pending]
    L --> N[Update Bulk Process Status]
    M --> N
    H --> N
    N --> O{More Records?}
    O -->|Yes| E
    O -->|No| P[Generate Bulk Process Report]
    P --> Q[Email Summary to Processor]
```

## 7. Automated Notification System

### Email Notification Triggers

```mermaid
graph TD
    A[System Event Occurs] --> B{Event Type}
    B -->|Job Approval| C[Job Approval Email]
    B -->|Resignation Approval| D[Resignation Approval Email]
    B -->|Asset Clearance| E[Asset Clearance Email]
    B -->|LWD Alert 15 Days| F[15-Day LWD Alert]
    B -->|LWD Alert 1 Day| G[1-Day LWD Alert]
    B -->|Resignation Initiation| H[Resignation Notification]
    
    C --> I[Select Email Template]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J[Personalize Email Content]
    J --> K[Identify Recipients]
    K --> L[Send Email]
    L --> M[Log Email Status]
    M --> N{Email Sent Successfully?}
    N -->|Yes| O[Update Notification Record]
    N -->|No| P[Retry Logic]
    P --> Q{Retry Attempts < Max?}
    Q -->|Yes| L
    Q -->|No| R[Mark as Failed]
```

## 8. Integration Workflows

### Jira Integration Process

```mermaid
graph TD
    A[Business Event Triggered] --> B{Integration Type}
    B -->|Onboarding| C[Create Onboarding Ticket]
    B -->|Offboarding| D[Create Offboarding Ticket]
    B -->|Asset Allocation| E[Create Asset Ticket]
    B -->|Domain Creation| F[Create Domain Ticket]
    B -->|Email Creation| G[Create Email Ticket]
    
    C --> H[Generate Ticket Details]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I[Call Jira API]
    I --> J{API Success?}
    J -->|Yes| K[Store Jira Ticket ID]
    J -->|No| L[Log Error and Retry]
    K --> M[Update Internal Record]
    M --> N[Track Ticket Status]
    L --> O{Retry Attempts < Max?}
    O -->|Yes| I
    O -->|No| P[Mark Integration Failed]
```

### Asset Portal Synchronization

```mermaid
graph TD
    A[Daily Batch Job Triggered] --> B[Query Asset Changes]
    B --> C[Identify Modified Assets]
    C --> D{Assets to Sync?}
    D -->|No| E[Log No Changes]
    D -->|Yes| F[Prepare Sync Payload]
    F --> G[Call Asset Portal API]
    G --> H{API Success?}
    H -->|Yes| I[Update Sync Status]
    H -->|No| J[Log Sync Error]
    I --> K[Mark Assets as Synced]
    K --> L[Generate Sync Report]
    J --> M[Retry Failed Records]
    M --> N{Retry Success?}
    N -->|Yes| I
    N -->|No| O[Flag for Manual Review]
```

## 9. Reporting and Analytics Workflow

### Real-time Dashboard Updates

```mermaid
graph TD
    A[Data Change Event] --> B[Identify Affected Metrics]
    B --> C[Recalculate Statistics]
    C --> D[Update Dashboard Cache]
    D --> E[Notify Connected Clients]
    E --> F[Push Update to Frontend]
    F --> G[Refresh Dashboard Widgets]
```

### Scheduled Report Generation

```mermaid
graph TD
    A[Scheduled Time Reached] --> B[Execute Report Query]
    B --> C[Aggregate Data]
    C --> D[Apply Formatting]
    D --> E[Generate Report File]
    E --> F{Report Type}
    F -->|PDF| G[Generate PDF]
    F -->|Excel| H[Generate Excel]
    F -->|CSV| I[Generate CSV]
    G --> J[Email Report]
    H --> J
    I --> J
    J --> K[Log Report Generation]
```

## 10. Error Handling and Recovery

### System Error Recovery

```mermaid
graph TD
    A[Error Detected] --> B{Error Type}
    B -->|Validation| C[Return Validation Messages]
    B -->|Database| D[Log Database Error]
    B -->|Integration| E[Log Integration Error]
    B -->|System| F[Log System Error]
    
    D --> G[Retry Database Operation]
    E --> H[Retry Integration Call]
    F --> I[System Recovery Procedure]
    
    G --> J{Success?}
    H --> K{Success?}
    I --> L{Recovery Success?}
    
    J -->|Yes| M[Continue Process]
    J -->|No| N[Escalate to Admin]
    K -->|Yes| M
    K -->|No| O[Queue for Manual Processing]
    L -->|Yes| M
    L -->|No| P[Critical Error Alert]
```

This comprehensive workflow documentation provides detailed process flows for all major operations within the Associate 360 Platform, ensuring clear understanding of business processes and system interactions.