/**
 * Document Category
 */
export enum DocumentCategory {
    TECHNICAL_DATASHEET = 'TECHNICAL_DATASHEET',
    INSTALLATION_GUIDE = 'INSTALLATION_GUIDE',
    CATALOG = 'CATALOG',
    BROCHURE = 'BROCHURE',
    CERTIFICATION = 'CERTIFICATION',
    CASE_STUDY = 'CASE_STUDY',
    WHITEPAPER = 'WHITEPAPER',
    VIDEO_TUTORIAL = 'VIDEO_TUTORIAL',
    WARRANTY = 'WARRANTY',
    COMPLIANCE_DOC = 'COMPLIANCE_DOC',
    OTHER = 'OTHER',
}

/**
 * Document Access Level
 */
export enum DocumentAccessLevel {
    PUBLIC = 'PUBLIC', // Anyone can download
    GATED = 'GATED', // Requires form submission (lead capture)
    AUTHENTICATED = 'AUTHENTICATED', // Requires login
    RESTRICTED = 'RESTRICTED', // Only specific roles
}

/**
 * Document Status
 */
export enum DocumentStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

/**
 * Lead Information Interface (for gated documents)
 */
export interface ILeadInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    designation?: string;
    country?: string;
    downloadedAt: Date;
}

/**
 * Document Interface
 */
export interface IDocument {
    id: string;
    title: string;
    description?: string;
    category: DocumentCategory;
    status: DocumentStatus;

    // File Details
    fileUrl: string;
    fileName: string;
    fileType: string; // MIME type
    fileSize: number; // in bytes

    // Thumbnail
    thumbnailUrl?: string;

    // Access Control
    accessLevel: DocumentAccessLevel;
    allowedRoles?: string[]; // For RESTRICTED access
    watermarkEnabled: boolean;
    watermarkText?: string;

    // Related Entities
    relatedProducts?: string[]; // Product IDs
    relatedProjects?: string[]; // Project IDs

    // SEO & Discovery
    tags?: string[];
    keywords?: string[];
    slug: string;

    // Analytics
    viewCount: number;
    downloadCount: number;
    leads?: ILeadInfo[]; // Captured leads for gated content

    // Version Control
    version: string;
    previousVersions?: string[]; // Document IDs

    // Expiry (for time-sensitive documents)
    expiresAt?: Date;

    // Audit
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
    publishedAt?: Date;
    publishedBy?: string;
    isDeleted: boolean;
}

/**
 * Document Creation DTO
 */
export interface ICreateDocument {
    title: string;
    description?: string;
    category: DocumentCategory;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    accessLevel: DocumentAccessLevel;
    watermarkEnabled?: boolean;
    tags?: string[];
    createdBy: string;
}

/**
 * Document Update DTO
 */
export interface IUpdateDocument {
    title?: string;
    description?: string;
    category?: DocumentCategory;
    status?: DocumentStatus;
    accessLevel?: DocumentAccessLevel;
    watermarkEnabled?: boolean;
    tags?: string[];
    updatedBy: string;
}

/**
 * Document Download Request Interface
 */
export interface IDocumentDownloadRequest {
    documentId: string;
    leadInfo?: ILeadInfo; // Required for gated documents
    userId?: string; // For authenticated users
}
