/**
 * Lead Source
 */
export enum LeadSource {
    WEBSITE_FORM = 'WEBSITE_FORM',
    RFQ = 'RFQ',
    GATED_CONTENT = 'GATED_CONTENT',
    NEWSLETTER = 'NEWSLETTER',
    WEBINAR = 'WEBINAR',
    TRADE_SHOW = 'TRADE_SHOW',
    REFERRAL = 'REFERRAL',
    SOCIAL_MEDIA = 'SOCIAL_MEDIA',
    EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
    DIRECT_INQUIRY = 'DIRECT_INQUIRY',
    OTHER = 'OTHER',
}

/**
 * Lead Status
 */
export enum LeadStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    QUALIFIED = 'QUALIFIED',
    PROPOSAL_SENT = 'PROPOSAL_SENT',
    NEGOTIATION = 'NEGOTIATION',
    WON = 'WON',
    LOST = 'LOST',
    NURTURING = 'NURTURING',
}

/**
 * Lead Priority
 */
export enum LeadPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

/**
 * Contact Activity Type
 */
export enum ActivityType {
    EMAIL = 'EMAIL',
    CALL = 'CALL',
    MEETING = 'MEETING',
    NOTE = 'NOTE',
    TASK = 'TASK',
    PROPOSAL = 'PROPOSAL',
    QUOTATION = 'QUOTATION',
}

/**
 * Lead Activity Interface
 */
export interface ILeadActivity {
    type: ActivityType;
    subject: string;
    description?: string;
    performedBy: string; // User ID
    performedAt: Date;
    nextFollowUp?: Date;
}

/**
 * Lead Interface
 */
export interface ILead {
    id: string;
    source: LeadSource;
    status: LeadStatus;
    priority: LeadPriority;

    // Contact Information
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    alternatePhone?: string;

    // Company Information
    company?: string;
    designation?: string;
    industry?: string;
    companySize?: string;
    website?: string;

    // Location
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;

    // Interest
    interestedProducts?: string[]; // Product IDs or names
    interestedCategories?: string[];
    budget?: string;
    timeline?: string;
    projectDetails?: string;

    // Engagement
    activities: ILeadActivity[];
    lastContactedAt?: Date;
    nextFollowUpAt?: Date;

    // Assignment
    assignedTo?: string; // User ID (Sales rep)
    assignedAt?: Date;

    // Score (lead scoring)
    score: number; // 0-100
    scoreUpdatedAt?: Date;

    // Marketing
    emailOptIn: boolean;
    smsOptIn: boolean;

    // Notes
    notes?: string;

    // Conversion
    convertedToCustomer: boolean;
    convertedAt?: Date;
    dealValue?: number;
    currency?: string;

    // Related Entities
    rfqIds?: string[]; // Related RFQs
    documentDownloads?: string[]; // Document IDs

    // Audit
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    isDeleted: boolean;
}

/**
 * Contact Form Submission Interface
 */
export interface IContactForm {
    id: string;
    formType: string; // 'general', 'product-inquiry', 'support', etc.

    // Contact Info
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;

    // Message
    subject: string;
    message: string;

    // Context
    pageUrl?: string; // Where form was submitted
    referrer?: string;
    productId?: string; // If inquiry about specific product

    // Status
    isProcessed: boolean;
    processedAt?: Date;
    processedBy?: string; // User ID
    convertedToLead: boolean;
    leadId?: string;

    // Audit
    createdAt: Date;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Lead Creation DTO
 */
export interface ICreateLead {
    source: LeadSource;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    projectDetails?: string;
    assignedTo?: string;
    createdBy?: string;
}

/**
 * Lead Update DTO
 */
export interface IUpdateLead {
    status?: LeadStatus;
    priority?: LeadPriority;
    assignedTo?: string;
    nextFollowUpAt?: Date;
    notes?: string;
    score?: number;
    updatedBy: string;
}

/**
 * Contact Form Submission DTO
 */
export interface ICreateContactForm {
    formType: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    pageUrl?: string;
    productId?: string;
}

/**
 * Lead Activity Creation DTO
 */
export interface ICreateLeadActivity {
    lead: string;
    type: ActivityType;
    subject: string;
    description?: string;
    performedBy: string;
}
