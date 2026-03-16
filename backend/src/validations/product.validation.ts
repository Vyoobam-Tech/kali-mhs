import { z } from 'zod';
import { ProductCategory, ProductStatus, Model3DFormat, FileType } from '@domain/product.interface';

/**
 * Product Specification Schema
 */
const productSpecificationSchema = z.object({
    name: z.string().min(1, 'Specification name is required'),
    value: z.string().min(1, 'Specification value is required'),
    unit: z.string().optional(),
});

/**
 * Product Image Schema
 */
const productImageSchema = z.object({
    url: z.string().url('Invalid image URL'),
    alt: z.string().min(1, 'Image alt text is required'),
    isPrimary: z.boolean().default(false),
    order: z.number().int().min(0).default(0),
});

/**
 * Product Document Schema
 */
const productDocumentSchema = z.object({
    title: z.string().min(1, 'Document title is required'),
    description: z.string().optional(),
    fileUrl: z.string().url('Invalid document URL'),
    fileType: z.nativeEnum(FileType),
    fileSize: z.number().positive('File size must be positive'),
    isGated: z.boolean().default(false),
    watermarkEnabled: z.boolean().default(false),
});

/**
 * 3D Model Schema
 */
const model3DSchema = z.object({
    url: z.string().url('Invalid 3D model URL'),
    format: z.nativeEnum(Model3DFormat),
    size: z.number().positive('File size must be positive'),
    thumbnailUrl: z.string().url().optional(),
});

/**
 * SEO Metadata Schema
 */
const seoMetadataSchema = z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().url().optional(),
});

/**
 * Create Product Schema
 */
export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Product name is required').max(200),
        shortDescription: z.string().max(500).optional(),
        fullDescription: z.string().optional(),
        category: z.nativeEnum(ProductCategory, {
            errorMap: () => ({ message: 'Invalid product category' }),
        }),
        subCategory: z.string().optional(),
        sku: z.string().optional(),
        specifications: z.array(productSpecificationSchema).optional(),
        showPrice: z.boolean().optional().default(false),
        basePrice: z.number().positive().optional(),
        currency: z.string().length(3).optional().default('INR'),
    }),
});

/**
 * Update Product Schema
 */
export const updateProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Product ID is required'),
    }),
    body: z.object({
        name: z.string().min(1).max(200).optional(),
        shortDescription: z.string().max(500).optional(),
        fullDescription: z.string().optional(),
        category: z.nativeEnum(ProductCategory).optional(),
        subCategory: z.string().optional(),
        status: z.nativeEnum(ProductStatus).optional(),
        sku: z.string().optional(),
        specifications: z.array(productSpecificationSchema).optional(),
        showPrice: z.boolean().optional(),
        basePrice: z.number().positive().optional(),
        currency: z.string().length(3).optional(),
        features: z.array(z.string()).optional(),
        applications: z.array(z.string()).optional(),
    }),
});

/**
 * Get Product by ID Schema
 */
export const getProductByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Product ID is required'),
    }),
});

/**
 * Get Product by Slug Schema
 */
export const getProductBySlugSchema = z.object({
    params: z.object({
        slug: z.string().min(1, 'Product slug is required'),
    }),
});

/**
 * Get Products Query Schema
 */
export const getProductsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
        category: z.nativeEnum(ProductCategory).optional(),
        status: z.nativeEnum(ProductStatus).optional(),
        search: z.string().optional(),
    }),
});

/**
 * Add Product Image Schema
 */
export const addProductImageSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Product ID is required'),
    }),
    body: productImageSchema,
});

/**
 * Remove Product Image Schema
 */
export const removeProductImageSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Product ID is required'),
    }),
    body: z.object({
        imageUrl: z.string().url('Invalid image URL'),
    }),
});

/**
 * Update Product Specifications Schema
 */
export const updateSpecificationsSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Product ID is required'),
    }),
    body: z.object({
        specifications: z.array(productSpecificationSchema),
    }),
});

/**
 * Update Product 3D Model Schema
 */
export const update3DModelSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Product ID is required'),
    }),
    body: model3DSchema,
});

/**
 * Add Product Document Schema
 */
export const addProductDocumentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Product ID is required'),
    }),
    body: productDocumentSchema,
});

/**
 * Update SEO Metadata Schema
 */
export const updateSEOSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Product ID is required'),
    }),
    body: seoMetadataSchema,
});

/**
 * Search Products Schema
 */
export const searchProductsSchema = z.object({
    query: z.object({
        q: z.string().min(1, 'Search query is required'),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    }),
});

/**
 * Export type inference helpers
 */
export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>['query'];
