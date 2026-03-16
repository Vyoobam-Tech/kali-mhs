import { z } from 'zod';
import { LeadSource, LeadStatus, LeadPriority, ActivityType } from '@domain/lead.interface';

// Create Lead
export const createLeadSchema = z.object({
    body: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        source: z.nativeEnum(LeadSource),
        interestedIn: z.array(z.string()).optional(),
        message: z.string().optional(),
    }),
});

// Update Lead
export const updateLeadSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        status: z.nativeEnum(LeadStatus).optional(),
        priority: z.nativeEnum(LeadPriority).optional(),
        notes: z.string().optional(),
    }),
});

// Query schemas
export const getLeadsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
        status: z.nativeEnum(LeadStatus).optional(),
        source: z.nativeEnum(LeadSource).optional(),
        priority: z.nativeEnum(LeadPriority).optional(),
        search: z.string().optional(),
    }),
});

// Activity
export const addActivitySchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        type: z.nativeEnum(ActivityType),
        subject: z.string().min(1),
        description: z.string().optional(),
    }),
});

export const assignLeadSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        assignedTo: z.string().min(1),
    }),
});

export const convertLeadSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        dealValue: z.number().positive(),
    }),
});
