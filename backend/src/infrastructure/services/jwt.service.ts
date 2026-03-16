import jwt from 'jsonwebtoken';
import { config } from '@config/env';
import { IJwtPayload, IRefreshTokenPayload, IAuthTokens } from '@domain/user.interface';
import { AppError } from '@middlewares/errorHandler';

/**
 * JWT Service
 * Handles JWT token generation and verification
 */
export class JWTService {
    /**
     * Generate access token
     * @param payload - JWT payload containing user info
     * @returns Signed JWT access token
     */
    static generateAccessToken(payload: IJwtPayload): string {
        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
    }

    /**
     * Generate refresh token
     * @param payload - Refresh token payload
     * @returns Signed JWT refresh token
     */
    static generateRefreshToken(payload: IRefreshTokenPayload): string {
        return jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshExpiresIn,
        });
    }

    /**
     * Generate both access and refresh tokens
     * @param userId - User ID
     * @param email - User email
     * @param role - User role
     * @param tokenVersion - Token version for refresh token rotation
     * @returns Object containing both tokens
     */
    static generateTokenPair(
        userId: string,
        email: string,
        role: string,
        tokenVersion: number = 0
    ): IAuthTokens {
        const accessTokenPayload: IJwtPayload = {
            userId,
            email,
            role: role as any,
        };

        const refreshTokenPayload: IRefreshTokenPayload = {
            userId,
            tokenVersion,
        };

        const accessToken = this.generateAccessToken(accessTokenPayload);
        const refreshToken = this.generateRefreshToken(refreshTokenPayload);

        // Calculate expiration time in seconds
        const expiresIn = this.getTokenExpiration(config.jwt.expiresIn);

        return {
            accessToken,
            refreshToken,
            expiresIn,
        };
    }

    /**
     * Verify access token
     * @param token - JWT access token to verify
     * @returns Decoded JWT payload
     * @throws AppError if token is invalid or expired
     */
    static verifyAccessToken(token: string): IJwtPayload {
        try {
            const decoded = jwt.verify(token, config.jwt.secret) as IJwtPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError(401, 'Access token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AppError(401, 'Invalid access token');
            }
            throw new AppError(401, 'Token verification failed');
        }
    }

    /**
     * Verify refresh token
     * @param token - JWT refresh token to verify
     * @returns Decoded refresh token payload
     * @throws AppError if token is invalid or expired
     */
    static verifyRefreshToken(token: string): IRefreshTokenPayload {
        try {
            const decoded = jwt.verify(token, config.jwt.refreshSecret) as IRefreshTokenPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError(401, 'Refresh token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AppError(401, 'Invalid refresh token');
            }
            throw new AppError(401, 'Token verification failed');
        }
    }

    /**
     * Decode token without verification (for debugging)
     * @param token - JWT token to decode
     * @returns Decoded payload or null
     */
    static decode(token: string): IJwtPayload | null {
        try {
            return jwt.decode(token) as IJwtPayload;
        } catch {
            return null;
        }
    }

    /**
     * Extract token from Authorization header
     * @param authHeader - Authorization header value
     * @returns Token string or null
     */
    static extractTokenFromHeader(authHeader?: string): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    /**
     * Convert time string to seconds
     * @param timeString - Time string like '7d', '24h', '60m'
     * @returns Time in seconds
     */
    private static getTokenExpiration(timeString: string): number {
        const unit = timeString.slice(-1);
        const value = parseInt(timeString.slice(0, -1), 10);

        switch (unit) {
            case 's':
                return value;
            case 'm':
                return value * 60;
            case 'h':
                return value * 60 * 60;
            case 'd':
                return value * 24 * 60 * 60;
            default:
                return 3600; // Default 1 hour
        }
    }
}
