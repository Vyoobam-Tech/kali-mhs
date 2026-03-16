import { z } from 'zod';
import { DocumentCategory, DocumentAccessLevel, DocumentStatus } from '@domain/document.interface';

/**
 * Lead Info Schema (for gated content)
 */
const leadInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    company: z.string().optional(),
    designation: z.string().optional(),
    country: z.string().optional(),
});

/**
 * Create Document Schema
 */
export const createDocumentSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
        description: z.string().optional(),
        category: z.nativeEnum(DocumentCategory),
        fileUrl: z.string().url('Invalid file URL'),
        fileName: z.string().min(1, 'File name is required'),
        fileType: z.string().min(1, 'File type is required'),
        fileSize: z.number().positive('File size must be positive'),
        thumbnailUrl: z.string().url().optional(),
        accessLevel: z.nativeEnum(DocumentAccessLevel).default(DocumentAccessLevel.PUBLIC),
        watermarkEnabled: z.boolean().default(false),
        watermarkText: z.string().optional(),
        relatedProducts: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        version: z.string().optional(),
        expiresAt: z.string().datetime().transform((str) => new Date(str)).optional(),
    }),
});

/**
 * Update Document Schema
 */
export const updateDocumentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Document ID is required'),
    }),
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        description: z.string().optional(),
        category: z.nativeEnum(DocumentCategory).optional(),
        status: z.nativeEnum(DocumentStatus).optional(),
        accessLevel: z.nativeEnum(DocumentAccessLevel).optional(),
        watermarkEnabled: z.boolean().optional(),
        watermarkText: z.string().optional(),
        tags: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
    }),
});

/**
 * Get Document by ID Schema
 */
export const getDocumentByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Document ID is required'),
    }),
});

/**
 * Get Document by Slug Schema
 */
export const getDocumentBySlugSchema = z.object({
    params: z.object({
        slug: z.string().min(1, 'Document slug is required'),
    }),
});

/**
 * Get Documents Query Schema
 */
export const getDocumentsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
        category: z.nativeEnum(DocumentCategory).optional(),
        status: z.nativeEnum(DocumentStatus).optional(),
        accessLevel: z.nativeEnum(DocumentAccessLevel).optional(),
        search: z.string().optional(),
    }),
});

/**
 * Download Document Schema
 */
export const downloadDocumentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Document ID is required'),
    }),
    body: z.object({
        leadInfo: leadInfoSchema.optional(),
    }),
});

/**
 * Search Documents Schema
 */
export const searchDocumentsSchema = z.object({
    query: z.object({
        q: z.string().min(1, 'Search query is required'),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    }),
});

/**
 * Publish Document Schema
 */
export const publishDocumentSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Document ID is required'),
    }),
});

/**
 * Get Document Leads Schema
 */
export const getDocumentLeadsSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Document ID is required'),
    }),
});

/**
 * Export type inference helpers
 */
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>['body'];
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>['body'];
export type DownloadDocumentInput = z.infer<typeof downloadDocumentSchema>['body'];
export type GetDocumentsQuery = z.infer<typeof getDocumentsQuerySchema>['query'];
