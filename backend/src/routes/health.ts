import { Router, Request, Response } from 'express';
import { database } from '@config/database';
import { authenticate, isAdminOrAbove } from '@middlewares/auth';

const router = Router();

/**
 * Public Health Check — minimal response for load balancers and uptime monitors
 */
router.get('/', (req: Request, res: Response) => {
    const isConnected = database.isConnectedToDatabase();
    res.status(isConnected ? 200 : 503).json({ status: isConnected ? 'ok' : 'degraded' });
});

/**
 * Detailed Health Check — protected, for ops/monitoring only
 */
router.get('/details', authenticate, isAdminOrAbove, (req: Request, res: Response) => {
    const mem = process.memoryUsage();
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: database.isConnectedToDatabase() ? 'connected' : 'disconnected',
        memory: {
            rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
            heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
            heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
        },
    });
});

export { router };
