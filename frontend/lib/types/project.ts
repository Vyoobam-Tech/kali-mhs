export enum ProjectCategory {
    RESIDENTIAL = 'RESIDENTIAL',
    COMMERCIAL = 'COMMERCIAL',
    INDUSTRIAL = 'INDUSTRIAL',
    INFRASTRUCTURE = 'INFRASTRUCTURE',
    INSTITUTIONAL = 'INSTITUTIONAL',
    RENOVATION = 'RENOVATION',
}

export enum ProjectStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    FEATURED = 'FEATURED',
    ARCHIVED = 'ARCHIVED',
}

export interface ProjectLocation {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

export interface ProjectImage {
    url: string;
    caption?: string;
    order: number;
}

export interface ProductUsed {
    product: string; // Product ID
    productName: string;
    quantity?: number;
    unit?: string;
    notes?: string;
}

export interface Testimonial {
    quote: string;
    author: string;
    designation?: string;
    company?: string;
    avatarUrl?: string;
    rating?: number;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    category: ProjectCategory;
    status: ProjectStatus;
    shortDescription?: string;
    fullDescription?: string;
    location?: ProjectLocation;

    startDate?: string;
    completionDate?: string;
    duration?: string;

    clientName?: string;
    clientCompany?: string;
    clientWebsite?: string;

    featuredImage?: {
        url: string;
        alt?: string;
    };
    images: ProjectImage[];
    videos?: any[]; // Simplified for now
    virtualTourUrl?: string;

    productsUsed?: ProductUsed[];

    projectSize?: string;
    budget?: string;
    teamSize?: number;

    keyFeatures?: string[];
    challenges?: string[];
    solutions?: string[];

    testimonial?: Testimonial;

    tags?: string[];

    isFeatured: boolean;
    displayOnHomepage: boolean;

    viewCount: number;

    createdAt: string;
    publishedAt?: string;
}

export interface ProjectFilters {
    category?: ProjectCategory;
    status?: ProjectStatus;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
