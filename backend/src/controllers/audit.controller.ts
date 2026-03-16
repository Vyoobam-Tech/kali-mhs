import { Request, Response } from 'express';
import { AuditUseCases } from '@usecases/audit.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { AuditAction, AuditLevel } from '@domain/audit.interface';

export class AuditController {
    static getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, action, level, userId, startDate, endDate } = req.query;
        const result = await AuditUseCases.getAuditLogs(
            page ? parseInt(page as string) : 1,
            limit ? parseInt(limit as string) : 50,
            action as AuditAction,
            level as AuditLevel,
            userId as string,
            startDate ? new Date(startDate as string) : undefined,
            endDate ? new Date(endDate as string) : undefined
        );
        res.json({ status: 'success', data: result });
    });

    static getAuditLogById = asyncHandler(async (req: Request, res: Response) => {
        const log = await AuditUseCases.getAuditLogById(req.params.id);
        res.json({ status: 'success', data: { log } });
    });

    static getHighRiskActivities = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        const logs = await AuditUseCases.getHighRiskActivities(limit);
        res.json({ status: 'success', data: { logs } });
    });

    static getAuditStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await AuditUseCases.getAuditStats();
        res.json({ status: 'success', data: stats });
    });
}
