/**
 * Audit Action Type
 */
export enum AuditAction {
    // User Actions
    USER_LOGIN = 'USER_LOGIN',
    USER_LOGOUT = 'USER_LOGOUT',
    USER_REGISTER = 'USER_REGISTER',
    USER_PASSWORD_CHANGE = 'USER_PASSWORD_CHANGE',
    USER_PROFILE_UPDATE = 'USER_PROFILE_UPDATE',

    // Content Management
    CONTENT_CREATE = 'CONTENT_CREATE',
    CONTENT_UPDATE = 'CONTENT_UPDATE',
    CONTENT_DELETE = 'CONTENT_DELETE',
    CONTENT_PUBLISH = 'CONTENT_PUBLISH',
    CONTENT_UNPUBLISH = 'CONTENT_UNPUBLISH',

    // Product Management
    PRODUCT_CREATE = 'PRODUCT_CREATE',
    PRODUCT_UPDATE = 'PRODUCT_UPDATE',
    PRODUCT_DELETE = 'PRODUCT_DELETE',
    PRODUCT_VIEW = 'PRODUCT_VIEW',

    // Document Management
    DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
    DOCUMENT_UPDATE = 'DOCUMENT_UPDATE',
    DOCUMENT_DELETE = 'DOCUMENT_DELETE',
    DOCUMENT_DOWNLOAD = 'DOCUMENT_DOWNLOAD',
    DOCUMENT_VIEW = 'DOCUMENT_VIEW',

    // RFQ Management
    RFQ_SUBMIT = 'RFQ_SUBMIT',
    RFQ_UPDATE = 'RFQ_UPDATE',
    RFQ_ASSIGN = 'RFQ_ASSIGN',
    RFQ_QUOTE = 'RFQ_QUOTE',
    RFQ_ACCEPT = 'RFQ_ACCEPT',
    RFQ_REJECT = 'RFQ_REJECT',

    // Lead Management
    LEAD_CREATE = 'LEAD_CREATE',
    LEAD_UPDATE = 'LEAD_UPDATE',
    LEAD_ASSIGN = 'LEAD_ASSIGN',
    LEAD_CONVERT = 'LEAD_CONVERT',

    // Job/Career Management
    JOB_CREATE = 'JOB_CREATE',
    JOB_UPDATE = 'JOB_UPDATE',
    JOB_DELETE = 'JOB_DELETE',
    APPLICATION_SUBMIT = 'APPLICATION_SUBMIT',
    APPLICATION_UPDATE = 'APPLICATION_UPDATE',

    // System Actions
    SETTINGS_UPDATE = 'SETTINGS_UPDATE',
    API_KEY_GENERATE = 'API_KEY_GENERATE',
    BACKUP_CREATE = 'BACKUP_CREATE',
    BACKUP_RESTORE = 'BACKUP_RESTORE',

    // Security Events
    LOGIN_FAILED = 'LOGIN_FAILED',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

/**
 * Audit Level
 */
export enum AuditLevel {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
}

/**
 * Audit Log Interface
 */
export interface IAuditLog {
    id: string;
    action: AuditAction;
    level: AuditLevel;

    // Actor (who performed the action)
    userId?: string; // User ID if authenticated
    userEmail?: string;
    userName?: string;
    userRole?: string;

    // Resource (what was affected)
    resourceType: string; // 'Product', 'User', 'Document', etc.
    resourceId?: string;
    resourceName?: string;

    // Details
    description: string;
    changes?: any; // Before/after values for updates
    metadata?: any; // Additional context

    // Request Context
    ipAddress?: string;
    userAgent?: string;
    requestId?: string; // Correlation ID
    sessionId?: string;

    // Location
    country?: string;
    city?: string;

    // Timestamp
    timestamp: Date;

    // Security
    isSuccessful: boolean;
    errorMessage?: string;
    riskScore?: number; // 0-100 for suspicious activity
}

/**
 * Audit Log Creation DTO
 */
export interface ICreateAuditLog {
    action: AuditAction;
    level?: AuditLevel;
    userId?: string;
    userEmail?: string;
    resourceType: string;
    resourceId?: string;
    description: string;
    changes?: any;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
}

/**
 * Audit Log Query Interface
 */
export interface IAuditLogQuery {
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    action?: AuditAction;
    level?: AuditLevel;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}
