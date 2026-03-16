import { z } from 'zod';
import { UserRole } from '@domain/user.interface';

/**
 * Email validation schema
 */
const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim();

/**
 * Password validation schema
 */
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

/**
 * Name validation schema
 */
const nameSchema = z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters')
    .trim();

/**
 * Register User Schema
 */
export const registerSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema,
        firstName: nameSchema,
        lastName: nameSchema,
        role: z.nativeEnum(UserRole).optional().default(UserRole.EDITOR),
    }),
});

/**
 * Login Schema
 */
export const loginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string().min(1, 'Password is required'),
    }),
});

/**
 * Refresh Token Schema
 */
export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
});

/**
 * Update User Schema
 */
export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'User ID is required'),
    }),
    body: z.object({
        firstName: nameSchema.optional(),
        lastName: nameSchema.optional(),
        role: z.nativeEnum(UserRole).optional(),
        status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    }),
});

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
    }),
});

/**
 * Get User By ID Schema
 */
export const getUserByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'User ID is required'),
    }),
});

/**
 * Export type inference helpers
 */
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
