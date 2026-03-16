/**
 * Product Categories Enum
 * Based on the 18 main categories from the architecture document
 */
export enum ProductCategory {
    // Metal Products
    METAL_ROOFING_SHEET = 'METAL_ROOFING_SHEET',
    METAL_SANDWICH_PANEL = 'METAL_SANDWICH_PANEL',
    METAL_CLADDING = 'METAL_CLADDING',
    METAL_ACCESSORIES = 'METAL_ACCESSORIES',

    // Concrete Products
    CONCRETE_ROOF_TILE = 'CONCRETE_ROOF_TILE',
    CONCRETE_RIDGE_TILE = 'CONCRETE_RIDGE_TILE',

    // Clay Products
    CLAY_ROOF_TILE = 'CLAY_ROOF_TILE',
    CLAY_RIDGE_TILE = 'CLAY_RIDGE_TILE',

    // Fiber Cement Products
    FIBER_CEMENT_SHEET = 'FIBER_CEMENT_SHEET',
    FIBER_CEMENT_ACCESSORY = 'FIBER_CEMENT_ACCESSORY',

    // Polycarbonate Products
    POLYCARBONATE_SHEET = 'POLYCARBONATE_SHEET',
    POLYCARBONATE_SYSTEM = 'POLYCARBONATE_SYSTEM',

    // Skylight Products
    SKYLIGHT_PANEL = 'SKYLIGHT_PANEL',
    SKYLIGHT_ACCESSORY = 'SKYLIGHT_ACCESSORY',

    // FRP Products
    FRP_SHEET = 'FRP_SHEET',

    // PVC Products
    PVC_SHEET = 'PVC_SHEET',

    // Insulation Products
    INSULATION_MATERIAL = 'INSULATION_MATERIAL',

    // Other/Accessories
    OTHER_ACCESSORIES = 'OTHER_ACCESSORIES',
}

/**
 * Product Status Enum
 */
export enum ProductStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DISCONTINUED = 'DISCONTINUED',
}

/**
 * 3D Model Status
 */
export enum Model3DStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    READY = 'READY',
    FAILED = 'FAILED',
}

/**
 * File Type for Documents
 */
export enum FileType {
    PDF = 'PDF',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    MODEL_3D = 'MODEL_3D',
    DOCUMENT = 'DOCUMENT',
}

/**
 * 3D Model Format
 */
export enum Model3DFormat {
    GLB = 'GLB',
    GLTF = 'GLTF',
    OBJ = 'OBJ',
    FBX = 'FBX',
}

/**
 * Product Specification Interface
 */
export interface IProductSpecification {
    name: string;
    value: string;
    unit?: string;
}

/**
 * 3D Model Interface
 */
export interface IModel3D {
    url: string;
    format: Model3DFormat;
    size: number; // in bytes
    thumbnailUrl?: string;
    status: Model3DStatus;
    uploadedAt: Date;
    processedAt?: Date;
}

/**
 * Product Image Interface
 */
export interface IProductImage {
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
}

/**
 * Product Document Interface
 */
export interface IProductDocument {
    title: string;
    description?: string;
    fileUrl: string;
    fileType: FileType;
    fileSize: number;
    isGated: boolean; // Requires form submission to download
    watermarkEnabled: boolean;
}

/**
 * SEO Metadata Interface
 */
export interface ISEOMetadata {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
}

/**
 * Product Interface
 */
export interface IProduct {
    id: string;
    name: string;
    slug: string; // URL-friendly name
    shortDescription?: string;
    fullDescription?: string;
    category: ProductCategory;
    subCategory?: string;
    sku?: string;
    status: ProductStatus;

    // Media
    images: IProductImage[];
    videos?: string[];
    model3D?: IModel3D;

    // Specifications
    specifications: IProductSpecification[];
    technicalDetails?: string;

    // Documents
    documents: IProductDocument[];
    dataSheet?: string; // URL to data sheet
    installationGuide?: string; // URL to installation guide

    // Pricing (optional, can be hidden for some products)
    showPrice: boolean;
    basePrice?: number;
    currency?: string;
    priceUnit?: string; // e.g., "per sqm", "per piece"

    // Features
    features?: string[];
    applications?: string[];

    // Related Products
    relatedProducts?: string[]; // Product IDs

    // SEO
    seo: ISEOMetadata;

    // Analytics
    viewCount: number;
    downloadCount: number;
    inquiryCount: number;

    // Audit
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
    isDeleted: boolean;
}

/**
 * Product Creation DTO
 */
export interface ICreateProduct {
    name: string;
    shortDescription?: string;
    fullDescription?: string;
    category: ProductCategory;
    subCategory?: string;
    sku?: string;
    specifications?: IProductSpecification[];
    showPrice?: boolean;
    basePrice?: number;
    currency?: string;
    createdBy: string;
}

/**
 * Product Update DTO
 */
export interface IUpdateProduct {
    name?: string;
    shortDescription?: string;
    fullDescription?: string;
    category?: ProductCategory;
    subCategory?: string;
    status?: ProductStatus;
    specifications?: IProductSpecification[];
    showPrice?: boolean;
    basePrice?: number;
    updatedBy: string;
}
