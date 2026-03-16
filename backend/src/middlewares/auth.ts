import { Request, Response, NextFunction } from 'express';
import { JWTService } from '@infrastructure/services/jwt.service';
import { AppError } from './errorHandler';
import { UserRole } from '@domain/user.interface';

// Extend Express Request to include user info
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: UserRole;
            };
        }
    }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract token from Authorization header
        const token = JWTService.extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            throw new AppError(401, 'Authentication required. Please provide a valid token.');
        }

        // Verify token
        const decoded = JWTService.verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError(401, 'Invalid or expired token'));
        }
    }
};

/**
 * Authorization Middleware Factory
 * Creates middleware that checks if user has required role(s)
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError(401, 'Authentication required'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError(403, 'Access denied. You do not have permission to perform this action.'));
        }

        next();
    };
};

/**
 * Check if user is Super Admin
 */
export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError(401, 'Authentication required'));
    }

    if (req.user.role !== UserRole.SUPER_ADMIN) {
        return next(new AppError(403, 'Access denied. Super Admin role required.'));
    }

    next();
};

/**
 * Check if user is Admin or above
 */
export const isAdminOrAbove = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError(401, 'Authentication required'));
    }

    const adminRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

    if (!adminRoles.includes(req.user.role)) {
        return next(new AppError(403, 'Access denied. Admin role or above required.'));
    }

    next();
};

/**
 * Optional Authentication
 * Attaches user info if token is present, but doesn't fail if missing
 * Useful for routes that work for both authenticated and non-authenticated users
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = JWTService.extractTokenFromHeader(req.headers.authorization);

        if (token) {
            const decoded = JWTService.verifyAccessToken(token);
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            };
        }

        next();
    } catch {
        // Token invalid or expired, but don't fail - just continue without user
        next();
    }
};
