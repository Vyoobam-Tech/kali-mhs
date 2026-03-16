import { Request, Response, NextFunction, RequestHandler } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
// @ts-ignore — xss-clean has no type declarations
import xss from 'xss-clean';
import { config } from '@config/env';

/**
 * Security Headers using Helmet
 */
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'"],  // API server serves JSON only — unsafe-inline not needed
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
});

/**
 * CORS Configuration
 */
export const corsMiddleware = cors({
    origin: (origin, callback) => {
        // Null-origin requests (no Origin header): allow in dev (Postman/mobile), block in prod
        if (!origin) {
            if (config.server.isDevelopment) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        }

        const allowedOrigins = config.cors.origin;

        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
    exposedHeaders: ['X-Correlation-ID'],
    maxAge: 86400, // 24 hours
});

/**
 * Rate Limiting
 * Prevents brute force attacks and API abuse
 */
export const rateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many requests, please try again later.',
            correlationId: req.correlationId,
        });
    },
});

/**
 * Strict Rate Limiter for Authentication Endpoints (login, register)
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many authentication attempts, please try again in 15 minutes.',
            correlationId: req.correlationId,
        });
    },
});

/**
 * Lenient Rate Limiter for Token Refresh
 * Called on every page load by SessionProvider — must not be grouped with login/register limits.
 * 60 attempts per 15 min = 4/min, well above any normal user pattern.
 */
export const refreshRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    skipSuccessfulRequests: true, // successful refreshes don't count toward the limit
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many refresh attempts, please try again later.',
            correlationId: req.correlationId,
        });
    },
});

/**
 * Security middleware stack
 * Apply all security middlewares in correct order
 */
export const applySecurity = (): RequestHandler[] => {
    return [
        securityHeaders,
        corsMiddleware,
        mongoSanitize(),  // Strip MongoDB operators ($where, $gt, etc.) from req.body/query/params
        xss(),            // Sanitize XSS from all string inputs
        hpp(),            // Prevent HTTP Parameter Pollution (duplicate query params)
    ];
};
