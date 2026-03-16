/**
 * RFQ (Request for Quote) Status
 */
export enum RFQStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    QUOTED = 'QUOTED',
    NEGOTIATION = 'NEGOTIATION',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
}

/**
 * RFQ Priority
 */
export enum RFQPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

/**
 * Project Type
 */
export enum ProjectType {
    RESIDENTIAL = 'RESIDENTIAL',
    COMMERCIAL = 'COMMERCIAL',
    INDUSTRIAL = 'INDUSTRIAL',
    INSTITUTIONAL = 'INSTITUTIONAL',
    INFRASTRUCTURE = 'INFRASTRUCTURE',
}

/**
 * RFQ Item Interface
 */
export interface IRFQItem {
    productId?: string; // Optional - may not be in catalog
    productName: string;
    category: string;
    quantity: number;
    unit: string; // sqm, pieces, etc.
    specifications?: string;
    notes?: string;
}

/**
 * Quote Response Interface
 */
export interface IQuoteResponse {
    items: IQuoteItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
    validUntil: Date;
    terms?: string;
    notes?: string;
    quotedBy: string; // User ID
    quotedAt: Date;
}

/**
 * Quote Item Interface
 */
export interface IQuoteItem {
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    leadTime?: string;
    notes?: string;
}

/**
 * Contact Details Interface
 */
export interface IContactDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    designation?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
}

/**
 * Project Details Interface
 */
export interface IProjectDetails {
    projectName?: string;
    projectType: ProjectType;
    projectLocation?: string;
    projectTimeline?: string;
    budget?: string;
    description?: string;
}

/**
 * RFQ Interface
 */
export interface IRFQ {
    id: string;
    rfqNumber: string; // Auto-generated unique number
    status: RFQStatus;
    priority: RFQPriority;

    // Contact Information
    contact: IContactDetails;

    // Project Information
    project: IProjectDetails;

    // RFQ Items
    items: IRFQItem[];

    // Attachments (drawings, specifications, etc.)
    attachments?: string[]; // URLs

    // Quote Response
    quote?: IQuoteResponse;

    // Communication
    notes?: string; // Internal notes
    customerNotes?: string; // Customer-facing notes

    // Timeline
    submittedAt?: Date;
    reviewedAt?: Date;
    quotedAt?: Date;
    expiresAt?: Date;

    // Assignment
    assignedTo?: string; // User ID
    assignedAt?: Date;

    // Audit
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string; // User ID if submitted by registered user
    updatedBy?: string;
}

/**
 * RFQ Creation DTO
 */
export interface ICreateRFQ {
    contact: IContactDetails;
    project: IProjectDetails;
    items: IRFQItem[];
    notes?: string;
    createdBy?: string;
}

/**
 * RFQ Update DTO
 */
export interface IUpdateRFQ {
    status?: RFQStatus;
    priority?: RFQPriority;
    assignedTo?: string;
    notes?: string;
    updatedBy: string;
}
