import { z } from 'zod';
import { ContentStatus } from '@domain/cms.interface';

export const createCMSPageSchema = z.object({
    body: z.object({
        title: z.string().min(1),
        type: z.enum(['PAGE', 'BLOG_POST', 'NEWS', 'FAQ']).optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        featuredImage: z.string().url().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
});

export const updateCMSPageSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
    }),
});

export const getCMSPagesQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
        type: z.string().optional(),
        status: z.nativeEnum(ContentStatus).optional(),
    }),
});
