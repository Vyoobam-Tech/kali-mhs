import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './errorHandler';

/**
 * Validation Middleware Factory
 * Creates middleware that validates request data against a Zod schema
 * @param schema - Zod schema to validate against
 */
export const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request data (body, params, query)
            await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod errors into a more readable format
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                next(new AppError(400, 'Validation failed', true, errors));
            } else {
                next(new AppError(400, 'Validation error'));
            }
        }
    };
};
