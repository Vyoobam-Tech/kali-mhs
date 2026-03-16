/**
 * Project Status
 */
export enum ProjectStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    FEATURED = 'FEATURED',
    ARCHIVED = 'ARCHIVED',
}

/**
 * Project Category
 */
export enum ProjectCategory {
    RESIDENTIAL = 'RESIDENTIAL',
    COMMERCIAL = 'COMMERCIAL',
    INDUSTRIAL = 'INDUSTRIAL',
    INSTITUTIONAL = 'INSTITUTIONAL',
    INFRASTRUCTURE = 'INFRASTRUCTURE',
    RENOVATION = 'RENOVATION',
    NEW_CONSTRUCTION = 'NEW_CONSTRUCTION',
}

/**
 * Project Image Interface
 */
export interface IProjectImage {
    url: string;
    caption?: string;
    isPrimary: boolean;
    order: number;
}

/**
 * Project Product Used Interface
 */
export interface IProjectProductUsed {
    productId: string;
    productName: string;
    category: string;
    quantity?: number;
    unit?: string;
}

/**
 * Client Testimonial Interface
 */
export interface IClientTestimonial {
    clientName: string;
    clientCompany?: string;
    clientDesignation?: string;
    testimonial: string;
    rating?: number; // 1-5
    date?: Date;
}

/**
 * Project Interface
 */
export interface IProject {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    fullDescription?: string;
    category: ProjectCategory;
    subCategory?: string;
    status: ProjectStatus;

    // Location
    location: string;
    city?: string;
    state?: string;
    country?: string;

    // Timeline
    startDate?: Date;
    completionDate?: Date;
    duration?: string; // e.g., "6 months"

    // Media
    images: IProjectImage[];
    videos?: string[];
    virtualTourUrl?: string;

    // Project Details
    client?: string;
    architect?: string;
    contractor?: string;
    area?: number; // in sqm
    areaUnit?: string;

    // Products Used
    productsUsed: IProjectProductUsed[];

    // Key Features
    keyFeatures?: string[];
    challenges?: string[];
    solutions?: string[];

    // Testimonial
    testimonial?: IClientTestimonial;

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];

    // Analytics
    viewCount: number;
    likeCount: number;

    // Display Order (for featured projects)
    displayOrder: number;
    isFeatured: boolean;

    // Audit
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
    publishedAt?: Date;
    isDeleted: boolean;
}

/**
 * Project Creation DTO
 */
export interface ICreateProject {
    title: string;
    shortDescription?: string;
    fullDescription?: string;
    category: ProjectCategory;
    location: string;
    productsUsed?: IProjectProductUsed[];
    createdBy: string;
}

/**
 * Project Update DTO
 */
export interface IUpdateProject {
    title?: string;
    shortDescription?: string;
    fullDescription?: string;
    category?: ProjectCategory;
    status?: ProjectStatus;
    location?: string;
    isFeatured?: boolean;
    updatedBy: string;
}
