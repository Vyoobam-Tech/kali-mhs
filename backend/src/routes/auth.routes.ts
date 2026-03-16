import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { validate } from '@middlewares/validate';
import { authenticate } from '@middlewares/auth';
import { authRateLimiter, refreshRateLimiter } from '@middlewares/security';
import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
} from '@validations/auth.validation';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public (or Admin only for production)
 */
router.post('/register', authRateLimiter, validate(registerSchema), AuthController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authRateLimiter, validate(loginSchema), AuthController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', refreshRateLimiter, AuthController.refreshToken); // reads from HttpOnly cookie, no body validation needed

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticate, AuthController.logout);

export { router };
