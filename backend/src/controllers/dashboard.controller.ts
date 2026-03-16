import { Request, Response } from 'express';
import { asyncHandler } from '@middlewares/errorHandler';
import { DashboardUseCases } from '@usecases/dashboard.usecases';

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await DashboardUseCases.getStats();
    res.json({ status: 'success', data: stats });
});
