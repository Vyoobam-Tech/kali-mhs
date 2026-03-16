import { z } from 'zod';

export const rfqStep1Schema = z.object({
    contact: z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
        email: z.string().email('Please enter a valid email'),
        phone: z.string().min(7, 'Please enter a valid phone number'),
        company: z.string().optional(),
        designation: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
    }),
});

export const rfqStep2Schema = z.object({
    project: z.object({
        projectName: z.string().optional(),
        projectType: z.string().min(1, 'Please select a project type'),
        description: z.string().min(10, 'Please describe your project (min 10 chars)'),
        timeline: z.string().optional(),
        budgetRange: z.string().optional(),
    }),
});

export const rfqStep4Schema = z.object({
    specifications: z.string().optional(),
    notes: z.string().optional(),
});

export const fullRFQSchema = rfqStep1Schema.merge(rfqStep2Schema).merge(rfqStep4Schema);

export type RFQFormData = z.infer<typeof fullRFQSchema>;

export interface RFQItem {
    id: string;
    productName: string;
    category: string;
    quantity: number;
    unit: string;
    notes?: string;
}
