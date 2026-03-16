import { z } from 'zod';
import { AuditAction, AuditLevel } from '@domain/audit.interface';

export const getAuditLogsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 50)),
        action: z.nativeEnum(AuditAction).optional(),
        level: z.nativeEnum(AuditLevel).optional(),
        userId: z.string().optional(),
        startDate: z.string().datetime().transform((str) => new Date(str)).optional(),
        endDate: z.string().datetime().transform((str) => new Date(str)).optional(),
    }),
});
