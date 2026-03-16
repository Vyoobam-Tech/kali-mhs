import { Request, Response, NextFunction } from 'express';
import { AuthUseCases } from '@usecases/auth.usecases';
import { asyncHandler } from '@middlewares/errorHandler';
import { AppError } from '@middlewares/errorHandler';
import { RegisterInput, LoginInput, ChangePasswordInput } from '@validations/auth.validation';
import { config } from '@config/env';

// 30 days in milliseconds
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

/**
 * Sets the refresh token as an HttpOnly cookie.
 * The cookie is only sent on the /auth/refresh path, reducing attack surface.
 */
function setRefreshCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.server.isProduction,
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: '/api/v1/auth/refresh',
    });
}

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
export class AuthController {
    /**
     * Register a new user
     * POST /api/v1/auth/register
     */
    static register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userData: RegisterInput = req.body;
        const createdBy = req.user?.userId;

        const { user, tokens } = await AuthUseCases.register(userData, createdBy);

        setRefreshCookie(res, tokens.refreshToken);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user,
                tokens: {
                    accessToken: tokens.accessToken,
                    // refreshToken is set as HttpOnly cookie — not returned in body
                },
            },
        });
    });

    /**
     * Login user
     * POST /api/v1/auth/login
     */
    static login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const credentials: LoginInput = req.body;

        const { user, tokens } = await AuthUseCases.login(credentials);

        setRefreshCookie(res, tokens.refreshToken);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user,
                tokens: {
                    accessToken: tokens.accessToken,
                    // refreshToken is set as HttpOnly cookie — not returned in body
                },
            },
        });
    });

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh
     * Reads refresh token from HttpOnly cookie (not request body)
     */
    static refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new AppError(401, 'Refresh token not provided');
        }

        const tokens = await AuthUseCases.refreshToken(refreshToken);

        // Rotate the refresh token cookie
        setRefreshCookie(res, tokens.refreshToken);

        res.status(200).json({
            status: 'success',
            message: 'Token refreshed successfully',
            data: {
                tokens: {
                    accessToken: tokens.accessToken,
                },
            },
        });
    });

    /**
     * Get current user profile
     * GET /api/v1/auth/profile
     */
    static getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const user = await AuthUseCases.getProfile(req.user.userId);

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    });

    /**
     * Change password
     * POST /api/v1/auth/change-password
     */
    static changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
        }

        const { currentPassword, newPassword }: ChangePasswordInput = req.body;

        await AuthUseCases.changePassword(req.user.userId, currentPassword, newPassword);

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully',
        });
    });

    /**
     * Logout
     * POST /api/v1/auth/logout
     * Clears the HttpOnly refresh token cookie
     */
    static logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        if (req.user) {
            await AuthUseCases.logout(req.user.userId);
        }

        res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    });
}
