import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Custom error class for application errors
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true,
        public errors?: any[]
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error response interface
interface ErrorResponse {
    status: 'error';
    statusCode: number;
    message: string;
    correlationId?: string;
    errors?: any[];
    stack?: string;
}

/**
 * Global Error Handler Middleware
 * Centralizes error handling and formatting
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        const validationErrors = error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));

        error = new AppError(400, 'Validation failed', true, validationErrors);
    }

    // Handle Mongoose duplicate key errors
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        const field = Object.keys((err as any).keyPattern)[0];
        error = new AppError(409, `${field} already exists`, true);
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const validationErrors = Object.values((err as any).errors).map((e: any) => ({
            field: e.path,
            message: e.message,
        }));
        error = new AppError(400, 'Validation failed', true, validationErrors);
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError(401, 'Invalid token', true);
    }

    if (err.name === 'TokenExpiredError') {
        error = new AppError(401, 'Token expired', true);
    }

    // Default to 500 server error
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error.message || 'Internal server error';
    const isOperational = error instanceof AppError ? error.isOperational : false;

    // Prepare error response
    const errorResponse: ErrorResponse = {
        status: 'error',
        statusCode,
        message,
        correlationId: req.correlationId,
    };

    // Add validation errors if present
    if (error instanceof AppError && error.errors) {
        errorResponse.errors = error.errors;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
    }

    // Log error
    console.error('❌ Error occurred:', {
        correlationId: req.correlationId,
        statusCode,
        message,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        stack: error.stack,
    });

    // Send error response
    res.status(statusCode).json(errorResponse);
};

/**
 * Not Found Handler
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
