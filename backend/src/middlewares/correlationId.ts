import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Extend Express Request type to include correlationId
declare global {
    namespace Express {
        interface Request {
            correlationId?: string;
        }
    }
}

/**
 * Correlation ID Middleware
 * Generates or extracts a unique correlation ID for each request
 * Useful for distributed tracing and log aggregation
 */
export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Check if correlation ID exists in headers, otherwise generate new one
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();

    // Attach to request object
    req.correlationId = correlationId;

    // Add to response headers
    res.setHeader('X-Correlation-ID', correlationId);

    next();
};
