import { z } from 'zod';
import { ProjectCategory, ProjectStatus } from '@domain/project.interface';

/**
 * Location Schema
 */
const locationSchema = z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    coordinates: z
        .object({
            latitude: z.number().min(-90).max(90),
            longitude: z.number().min(-180).max(180),
        })
        .optional(),
});

/**
 * Image Schema
 */
const imageSchema = z.object({
    url: z.string().url('Invalid image URL'),
    caption: z.string().optional(),
    order: z.number().optional(),
});

/**
 * Video Schema
 */
const videoSchema = z.object({
    url: z.string().url('Invalid video URL'),
    title: z.string().optional(),
    thumbnail: z.string().url().optional(),
});

/**
 * Product Used Schema
 */
const productUsedSchema = z.object({
    product: z.string().min(1, 'Product ID is required'),
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.number().positive().optional(),
    unit: z.string().optional(),
    notes: z.string().optional(),
});

/**
 * Testimonial Schema
 */
const testimonialSchema = z.object({
    quote: z.string().min(1, 'Quote is required'),
    author: z.string().min(1, 'Author is required'),
    designation: z.string().optional(),
    company: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    rating: z.number().min(1).max(5).optional(),
});

/**
 * Create Project Schema
 */
export const createProjectSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
        category: z.nativeEnum(ProjectCategory),
        shortDescription: z.string().max(500).optional(),
        fullDescription: z.string().optional(),
        location: locationSchema.optional(),
        startDate: z.string().datetime().transform((str) => new Date(str)).optional(),
        completionDate: z.string().datetime().transform((str) => new Date(str)).optional(),
        duration: z.string().optional(),
        clientName: z.string().optional(),
        clientCompany: z.string().optional(),
        featuredImage: z.object({ url: z.string().url(), alt: z.string().optional() }).optional(),
        images: z.array(imageSchema).optional(),
        videos: z.array(videoSchema).optional(),
        virtualTourUrl: z.string().url().optional(),
        projectSize: z.string().optional(),
        budget: z.string().optional(),
        teamSize: z.number().positive().optional(),
        keyFeatures: z.array(z.string()).optional(),
        challenges: z.array(z.string()).optional(),
        solutions: z.array(z.string()).optional(),
        testimonial: testimonialSchema.optional(),
        tags: z.array(z.string()).optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isFeatured: z.boolean().optional(),
        displayOnHomepage: z.boolean().optional(),
    }),
});

/**
 * Update Project Schema
 */
export const updateProjectSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Project ID is required'),
    }),
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        category: z.nativeEnum(ProjectCategory).optional(),
        status: z.nativeEnum(ProjectStatus).optional(),
        shortDescription: z.string().max(500).optional(),
        fullDescription: z.string().optional(),
        location: locationSchema.optional(),
        startDate: z.string().datetime().transform((str) => new Date(str)).optional(),
        completionDate: z.string().datetime().transform((str) => new Date(str)).optional(),
        isFeatured: z.boolean().optional(),
        displayOnHomepage: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
    }),
});

/**
 * Get Project by ID Schema
 */
export const getProjectByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Project ID is required'),
    }),
});

/**
 * Get Project by Slug Schema
 */
export const getProjectBySlugSchema = z.object({
    params: z.object({
        slug: z.string().min(1, 'Project slug is required'),
    }),
});

/**
 * Get Projects Query Schema
 */
export const getProjectsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
        category: z.nativeEnum(ProjectCategory).optional(),
        status: z.nativeEnum(ProjectStatus).optional(),
        isFeatured: z.string().optional().transform((val) => val === 'true'),
        search: z.string().optional(),
    }),
});

/**
 * Add Project Image Schema
 */
export const addProjectImageSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Project ID is required'),
    }),
    body: imageSchema,
});

/**
 * Remove Project Image Schema
 */
export const removeProjectImageSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Project ID is required'),
    }),
    body: z.object({
        imageUrl: z.string().url('Invalid image URL'),
    }),
});

/**
 * Add Product to Project Schema
 */
export const addProductToProjectSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Project ID is required'),
    }),
    body: productUsedSchema,
});

/**
 * Search Projects Schema
 */
export const searchProjectsSchema = z.object({
    query: z.object({
        q: z.string().min(1, 'Search query is required'),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    }),
});

/**
 * Publish Project Schema
 */
export const publishProjectSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Project ID is required'),
    }),
});

/**
 * Export type inference helpers
 */
export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
export type GetProjectsQuery = z.infer<typeof getProjectsQuerySchema>['query'];
