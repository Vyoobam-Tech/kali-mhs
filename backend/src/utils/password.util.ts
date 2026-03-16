import bcrypt from 'bcryptjs';
import { config } from '@config/env';

/**
 * Password Utility Class
 * Handles password hashing and verification using bcrypt
 */
export class PasswordUtil {
    /**
     * Hash a plain text password
     * @param password - Plain text password to hash
     * @returns Hashed password
     */
    static async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(config.security.bcryptRounds);
        return bcrypt.hash(password, salt);
    }

    /**
     * Compare a plain text password with a hashed password
     * @param plainPassword - Plain text password
     * @param hashedPassword - Hashed password from database
     * @returns True if passwords match, false otherwise
     */
    static async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Validate password strength
     * Must be at least 8 characters, contain uppercase, lowercase, number
     * @param password - Password to validate
     * @returns True if password meets requirements
     */
    static validateStrength(password: string): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
