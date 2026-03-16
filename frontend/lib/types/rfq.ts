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

export enum RFQPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum ProjectType {
    RESIDENTIAL = 'RESIDENTIAL',
    COMMERCIAL = 'COMMERCIAL',
    INDUSTRIAL = 'INDUSTRIAL',
    INSTITUTIONAL = 'INSTITUTIONAL',
    INFRASTRUCTURE = 'INFRASTRUCTURE',
}

export interface RFQItem {
    productId?: string;
    productName: string;
    category: string;
    quantity: number;
    unit: string;
    specifications?: string;
    notes?: string;
}

export interface QuoteItem {
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    leadTime?: string;
    notes?: string;
}

export interface QuoteResponse {
    items: QuoteItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
    validUntil: string;
    terms?: string;
    notes?: string;
    quotedBy: string;
    quotedAt: string;
}

export interface ContactDetails {
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

export interface ProjectDetails {
    projectName?: string;
    projectType: ProjectType;
    projectLocation?: string;
    projectTimeline?: string;
    budget?: string;
    description?: string;
}

export interface RFQ {
    id: string;
    rfqNumber: string;
    status: RFQStatus;
    priority: RFQPriority;
    contact: ContactDetails;
    project: ProjectDetails;
    items: RFQItem[];
    attachments?: string[];
    quote?: QuoteResponse;
    notes?: string;
    submittedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRFQPayload {
    contact: ContactDetails;
    project: ProjectDetails;
    items: RFQItem[];
    notes?: string;
}

export interface RFQFilters {
    status?: RFQStatus;
    search?: string;
    page?: number;
    limit?: number;
}
