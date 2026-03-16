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

export enum LeadPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum ActivityType {
    EMAIL = 'EMAIL',
    CALL = 'CALL',
    MEETING = 'MEETING',
    NOTE = 'NOTE',
    TASK = 'TASK',
    PROPOSAL = 'PROPOSAL',
    QUOTATION = 'QUOTATION',
}

export interface LeadActivity {
    type: ActivityType;
    subject: string;
    description?: string;
    performedBy: string;
    performedAt: string; // ISO Date
    nextFollowUp?: string;
}

export interface Lead {
    id: string;
    source: LeadSource;
    status: LeadStatus;
    priority: LeadPriority;

    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    designation?: string;

    city?: string;
    country?: string;

    interestedProducts?: string[];
    budget?: string;
    timeline?: string;
    projectDetails?: string;

    activities: LeadActivity[];
    score: number;

    assignedTo?: string;
    nextFollowUpAt?: string;

    createdAt: string;
    updatedAt: string;
}

export interface LeadFilters {
    status?: LeadStatus;
    source?: LeadSource;
    search?: string;
    page?: number;
    limit?: number;
}
