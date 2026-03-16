export enum ProductCategory {
    METAL_ROOFING_SHEET = 'METAL_ROOFING_SHEET',
    METAL_SANDWICH_PANEL = 'METAL_SANDWICH_PANEL',
    METAL_CLADDING = 'METAL_CLADDING',
    METAL_ACCESSORIES = 'METAL_ACCESSORIES',
    CONCRETE_ROOF_TILE = 'CONCRETE_ROOF_TILE',
    CONCRETE_RIDGE_TILE = 'CONCRETE_RIDGE_TILE',
    CLAY_ROOF_TILE = 'CLAY_ROOF_TILE',
    CLAY_RIDGE_TILE = 'CLAY_RIDGE_TILE',
    FIBER_CEMENT_SHEET = 'FIBER_CEMENT_SHEET',
    FIBER_CEMENT_ACCESSORY = 'FIBER_CEMENT_ACCESSORY',
    POLYCARBONATE_SHEET = 'POLYCARBONATE_SHEET',
    POLYCARBONATE_SYSTEM = 'POLYCARBONATE_SYSTEM',
    SKYLIGHT_PANEL = 'SKYLIGHT_PANEL',
    SKYLIGHT_ACCESSORY = 'SKYLIGHT_ACCESSORY',
    FRP_SHEET = 'FRP_SHEET',
    PVC_SHEET = 'PVC_SHEET',
    INSULATION_MATERIAL = 'INSULATION_MATERIAL',
    OTHER_ACCESSORIES = 'OTHER_ACCESSORIES',
}

export const ProductCategoryLabel: Record<ProductCategory, string> = {
    [ProductCategory.METAL_ROOFING_SHEET]: 'Metal Roofing Sheets',
    [ProductCategory.METAL_SANDWICH_PANEL]: 'Metal Sandwich Panels',
    [ProductCategory.METAL_CLADDING]: 'Metal Cladding',
    [ProductCategory.METAL_ACCESSORIES]: 'Metal Accessories',
    [ProductCategory.CONCRETE_ROOF_TILE]: 'Concrete Roof Tiles',
    [ProductCategory.CONCRETE_RIDGE_TILE]: 'Concrete Ridge Tiles',
    [ProductCategory.CLAY_ROOF_TILE]: 'Clay Roof Tiles',
    [ProductCategory.CLAY_RIDGE_TILE]: 'Clay Ridge Tiles',
    [ProductCategory.FIBER_CEMENT_SHEET]: 'Fiber Cement Sheets',
    [ProductCategory.FIBER_CEMENT_ACCESSORY]: 'Fiber Cement Accessories',
    [ProductCategory.POLYCARBONATE_SHEET]: 'Polycarbonate Sheets',
    [ProductCategory.POLYCARBONATE_SYSTEM]: 'Polycarbonate Systems',
    [ProductCategory.SKYLIGHT_PANEL]: 'Skylight Panels',
    [ProductCategory.SKYLIGHT_ACCESSORY]: 'Skylight Accessories',
    [ProductCategory.FRP_SHEET]: 'FRP Sheets',
    [ProductCategory.PVC_SHEET]: 'PVC Sheets',
    [ProductCategory.INSULATION_MATERIAL]: 'Insulation Materials',
    [ProductCategory.OTHER_ACCESSORIES]: 'Other Accessories',
};

export enum ProductStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DISCONTINUED = 'DISCONTINUED',
}

export enum Model3DStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    READY = 'READY',
    FAILED = 'FAILED',
}

export enum FileType {
    PDF = 'PDF',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    MODEL_3D = 'MODEL_3D',
    DOCUMENT = 'DOCUMENT',
}

export enum Model3DFormat {
    GLB = 'GLB',
    GLTF = 'GLTF',
    OBJ = 'OBJ',
    FBX = 'FBX',
}

export interface ProductSpecification {
    name: string;
    value: string;
    unit?: string;
}

export interface Model3D {
    url: string;
    format: Model3DFormat;
    size: number;
    thumbnailUrl?: string;
    status: Model3DStatus;
    uploadedAt: string;
    processedAt?: string;
}

export interface ProductImage {
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
}

export interface ProductDocument {
    title: string;
    description?: string;
    fileUrl: string;
    fileType: FileType;
    fileSize: number;
    isGated: boolean;
    watermarkEnabled: boolean;
}

export interface SEOMetadata {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    fullDescription?: string;
    category: ProductCategory;
    subCategory?: string;
    sku?: string;
    status: ProductStatus;
    images: ProductImage[];
    videos?: string[];
    model3D?: Model3D;
    specifications: ProductSpecification[];
    technicalDetails?: string;
    documents: ProductDocument[];
    dataSheet?: string;
    installationGuide?: string;
    showPrice: boolean;
    basePrice?: number;
    currency?: string;
    priceUnit?: string;
    features?: string[];
    applications?: string[];
    relatedProducts?: Product[];
    seo: SEOMetadata;
    viewCount: number;
    downloadCount: number;
    inquiryCount: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy?: string;
    isDeleted: boolean;
}

export interface ProductFilters {
    category?: ProductCategory;
    status?: ProductStatus;
    search?: string;
    page?: number;
    limit?: number;
}
