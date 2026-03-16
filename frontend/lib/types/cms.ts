export enum ContentStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    SCHEDULED = 'SCHEDULED',
    ARCHIVED = 'ARCHIVED',
}

export enum PageType {
    PAGE = 'PAGE',
    BLOG_POST = 'BLOG_POST',
    NEWS = 'NEWS',
    FAQ = 'FAQ',
}

export interface CMSPage {
    id: string;
    title: string;
    slug: string;
    type: PageType;
    status: ContentStatus;

    content?: string;
    excerpt?: string;
    featuredImage?: string;

    category?: string;
    tags?: string[];

    metaTitle?: string;
    metaDescription?: string;

    publishedAt?: string;
    scheduledAt?: string;

    createdAt: string;
    updatedAt: string;
}

export interface CMSFilters {
    type?: PageType;
    status?: ContentStatus;
    search?: string;
    page?: number;
    limit?: number;
}
