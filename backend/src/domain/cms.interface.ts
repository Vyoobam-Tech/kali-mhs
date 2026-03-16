/**
 * CMS Content Type
 */
export enum CMSContentType {
    PAGE = 'PAGE',
    BLOG_POST = 'BLOG_POST',
    NEWS = 'NEWS',
    ANNOUNCEMENT = 'ANNOUNCEMENT',
    FAQ = 'FAQ',
    TESTIMONIAL = 'TESTIMONIAL',
    BANNER = 'BANNER',
    POPUP = 'POPUP',
}

/**
 * Content Status
 */
export enum ContentStatus {
    DRAFT = 'DRAFT',
    SCHEDULED = 'SCHEDULED',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

/**
 * Content Block Type (for flexible page builder)
 */
export enum BlockType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    GALLERY = 'GALLERY',
    CTA = 'CTA', // Call to Action
    FORM = 'FORM',
    PRODUCT_LIST = 'PRODUCT_LIST',
    PROJECT_LIST = 'PROJECT_LIST',
    CUSTOM_HTML = 'CUSTOM_HTML',
}

/**
 * Content Block Interface
 */
export interface IContentBlock {
    type: BlockType;
    order: number;
    content: any; // Flexible content based on type
    settings?: any; // Block-specific settings
}

/**
 * CMS Content Interface
 */
export interface ICMSContent {
    id: string;
    type: CMSContentType;
    status: ContentStatus;

    // Content
    title: string;
    slug: string;
    excerpt?: string;
    content?: string; // Rich text content
    blocks?: IContentBlock[]; // For page builder

    // Media
    featuredImage?: string;
    gallery?: string[];

    // Categorization
    category?: string;
    tags?: string[];

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;

    // Author
    author: string; // User ID
    authorName?: string; // Denormalized

    // Publishing
    publishedAt?: Date;
    scheduledFor?: Date;
    expiresAt?: Date;

    // Features
    isFeatured: boolean;
    allowComments: boolean;
    template?: string; // Page template

    // Analytics
    viewCount: number;
    shareCount: number;

    // Related Content
    relatedContent?: string[]; // Content IDs

    // Audit
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
    isDeleted: boolean;
}

/**
 * FAQ Interface
 */
export interface IFAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isPublished: boolean;
    searchKeywords?: string[];
    viewCount: number;
    helpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}

/**
 * Testimonial Interface
 */
export interface ITestimonial {
    id: string;
    clientName: string;
    clientCompany?: string;
    clientDesignation?: string;
    clientImage?: string;
    testimonial: string;
    rating: number; // 1-5
    isPublished: boolean;
    isFeatured: boolean;
    projectId?: string;
    productIds?: string[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Banner Interface (for hero sections, promotions)
 */
export interface IBanner {
    id: string;
    title: string;
    description?: string;
    image: string;
    mobileImage?: string;
    link?: string;
    linkText?: string;
    position: string; // 'home-hero', 'product-page-top', etc.
    order: number;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * CMS Content Creation DTO
 */
export interface ICreateCMSContent {
    type: CMSContentType;
    title: string;
    excerpt?: string;
    content?: string;
    category?: string;
    tags?: string[];
    featuredImage?: string;
    createdBy: string;
}

/**
 * CMS Content Update DTO
 */
export interface IUpdateCMSContent {
    title?: string;
    excerpt?: string;
    content?: string;
    status?: ContentStatus;
    category?: string;
    tags?: string[];
    isFeatured?: boolean;
    updatedBy: string;
}

// Type aliases for simplified usage
export type ICMSPage = ICMSContent;
export type ICreateCMSPage = ICreateCMSContent;
export type IUpdateCMSPage = IUpdateCMSContent;
