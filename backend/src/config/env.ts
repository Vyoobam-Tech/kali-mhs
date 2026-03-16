import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    PORT: z.string().transform(Number).default('5000'),
    API_PREFIX: z.string().default('/api/v1'),

    // Database
    MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),

    // JWT
    JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    // CORS
    CORS_ORIGIN: z.string().default('http://localhost:3000'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

    // File Upload
    MAX_FILE_SIZE: z.string().transform(Number).default('10485760'),
    UPLOAD_DIR: z.string().default('./uploads'),
    ALLOWED_FILE_TYPES: z.string().default('.pdf,.doc,.docx,.jpg,.jpeg,.png,.glb,.gltf'),

    // Email
    SMTP_HOST: z.string().min(1, 'SMTP host is required'),
    SMTP_PORT: z.string().transform(Number).default('587'),
    SMTP_SECURE: z.string().transform((val) => val === 'true').default('false'),
    SMTP_USER: z.string().email('Valid SMTP user email is required'),
    SMTP_PASSWORD: z.string().min(1, 'SMTP password is required'),
    EMAIL_FROM: z.string().email('Valid from email is required'),
    EMAIL_FROM_NAME: z.string().default('Kali MHS'),
    ADMIN_EMAILS: z.string().min(1, 'Admin emails are required'),

    // Storage
    STORAGE_TYPE: z.enum(['local', 's3']).default('local'),

    // Frontend
    FRONTEND_URL: z.string().url('Valid frontend URL is required'),

    // URL Signer — separate secret from JWT to limit blast radius of any single key leak
    URL_SIGNER_SECRET: z.string().min(32, 'URL signer secret must be at least 32 characters').default('url-signer-dev-secret-change-in-production-minimum-32'),
    // Backend's own public base URL — used to build download links
    API_BASE_URL: z.string().url().default('http://localhost:5000/api/v1'),

    // Security
    BCRYPT_ROUNDS: z.string().transform(Number).default('12'),

    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Validate and parse environment variables
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};

export const env = parseEnv();

// Export typed config object
export const config = {
    server: {
        env: env.NODE_ENV,
        port: env.PORT,
        apiPrefix: env.API_PREFIX,
        isDevelopment: env.NODE_ENV === 'development',
        isProduction: env.NODE_ENV === 'production',
    },
    database: {
        uri: env.MONGODB_URI,
    },
    jwt: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
        refreshSecret: env.JWT_REFRESH_SECRET,
        refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
    cors: {
        origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    },
    rateLimit: {
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    },
    fileUpload: {
        maxSize: env.MAX_FILE_SIZE,
        uploadDir: env.UPLOAD_DIR,
        allowedTypes: env.ALLOWED_FILE_TYPES.split(',').map((t) => t.trim()),
    },
    email: {
        smtp: {
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_SECURE,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASSWORD,
            },
        },
        from: {
            email: env.EMAIL_FROM,
            name: env.EMAIL_FROM_NAME,
        },
        adminEmails: env.ADMIN_EMAILS.split(',').map((e) => e.trim()),
    },
    storage: {
        type: env.STORAGE_TYPE,
    },
    frontend: {
        url: env.FRONTEND_URL,
    },
    urlSigner: {
        secret: env.URL_SIGNER_SECRET,
        apiBaseUrl: env.API_BASE_URL,
    },
    security: {
        bcryptRounds: env.BCRYPT_ROUNDS,
    },
    logging: {
        level: env.LOG_LEVEL,
    },
} as const;

export type Config = typeof config;
