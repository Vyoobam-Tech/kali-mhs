import { z } from 'zod';
import { RFQStatus, RFQPriority, ProjectType } from '@domain/rfq.interface';

/**
 * Contact Details Schema
 */
const contactDetailsSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    company: z.string().optional(),
    designation: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pincode: z.string().optional(),
});

/**
 * Project Details Schema
 */
const projectDetailsSchema = z.object({
    projectName: z.string().optional(),
    projectType: z.nativeEnum(ProjectType),
    projectLocation: z.string().optional(),
    projectTimeline: z.string().optional(),
    budget: z.string().optional(),
    description: z.string().optional(),
});

/**
 * RFQ Item Schema
 */
const rfqItemSchema = z.object({
    productId: z.string().optional(),
    productName: z.string().min(1, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unit: z.string().min(1, 'Unit is required'),
    specifications: z.string().optional(),
    notes: z.string().optional(),
});

/**
 * Quote Item Schema
 */
const quoteItemSchema = z.object({
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.number().positive('Quantity must be positive'),
    unit: z.string().min(1, 'Unit is required'),
    unitPrice: z.number().positive('Unit price must be positive'),
    totalPrice: z.number().positive('Total price must be positive'),
    leadTime: z.string().optional(),
    notes: z.string().optional(),
});

/**
 * Quote Response Schema
 */
const quoteResponseSchema = z.object({
    items: z.array(quoteItemSchema).min(1, 'At least one quote item is required'),
    subtotal: z.number().nonnegative().optional(),
    tax: z.number().nonnegative().optional(),
    discount: z.number().nonnegative().optional(),
    total: z.number().positive().optional(),
    currency: z.string().length(3).default('INR'),
    validUntil: z.string().datetime().transform((str) => new Date(str)),
    terms: z.string().optional(),
    notes: z.string().optional(),
});

/**
 * Create RFQ Schema
 */
export const createRFQSchema = z.object({
    body: z.object({
        contact: contactDetailsSchema,
        project: projectDetailsSchema,
        items: z.array(rfqItemSchema).min(1, 'At least one item is required'),
        notes: z.string().optional(),
    }),
});

/**
 * Update RFQ Schema
 */
export const updateRFQSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'RFQ ID is required'),
    }),
    body: z.object({
        status: z.nativeEnum(RFQStatus).optional(),
        priority: z.nativeEnum(RFQPriority).optional(),
        assignedTo: z.string().optional(),
        notes: z.string().optional(),
    }),
});

/**
 * Get RFQ by ID Schema
 */
export const getRFQByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'RFQ ID is required'),
    }),
});

/**
 * Get RFQ by Number Schema
 */
export const getRFQByNumberSchema = z.object({
    params: z.object({
        rfqNumber: z.string().min(1, 'RFQ number is required'),
    }),
});

/**
 * Get RFQs Query Schema
 */
export const getRFQsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
        status: z.nativeEnum(RFQStatus).optional(),
        priority: z.nativeEnum(RFQPriority).optional(),
        assignedTo: z.string().optional(),
    }),
});

/**
 * Assign RFQ Schema
 */
export const assignRFQSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'RFQ ID is required'),
    }),
    body: z.object({
        assignedTo: z.string().min(1, 'User ID is required'),
    }),
});

/**
 * Add Quote Schema
 */
export const addQuoteSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'RFQ ID is required'),
    }),
    body: quoteResponseSchema,
});

/**
 * Accept/Reject RFQ Schema
 */
export const acceptRejectRFQSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'RFQ ID is required'),
    }),
    body: z.object({
        reason: z.string().optional(),
    }),
});

/**
 * Search RFQs Schema
 */
export const searchRFQsSchema = z.object({
    query: z.object({
        q: z.string().min(1, 'Search query is required'),
    }),
});

/**
 * Submit RFQ Schema
 */
export const submitRFQSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'RFQ ID is required'),
    }),
});

/**
 * Export type inference helpers
 */
export type CreateRFQInput = z.infer<typeof createRFQSchema>['body'];
export type UpdateRFQInput = z.infer<typeof updateRFQSchema>['body'];
export type AddQuoteInput = z.infer<typeof addQuoteSchema>['body'];
export type GetRFQsQuery = z.infer<typeof getRFQsQuerySchema>['query'];
