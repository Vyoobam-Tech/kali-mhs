import express, { Application, Request, Response } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from '@config/env';
import { database } from '@config/database';
import { correlationIdMiddleware } from '@middlewares/correlationId';
import { applySecurity, rateLimiter } from '@middlewares/security';
import { errorHandler, notFoundHandler } from '@middlewares/errorHandler';
import { router as healthRouter } from '@routes/health';
import { router as apiRouter } from '@routes/index';
import cors from 'cors';

class Server {
    private app: Application;

    constructor() {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddlewares(): void {
        // Trust proxy (for rate limiting behind reverse proxy)
        this.app.set('trust proxy', 1);

            // ✅ CORS (ADD THIS AT TOP)
    this.app.use(cors({
        origin: [
            "https://kalimhs.vercel.app",
            "http://localhost:3000"
        ],
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    }));

    // ✅ Handle preflight requests
    this.app.options("*", cors());

        // Request logging
        if (config.server.isDevelopment) {
            this.app.use(morgan('dev'));
        } else {
            this.app.use(morgan('combined'));
        }

        // Cookie parsing (required for HttpOnly refresh token)
        this.app.use(cookieParser());

        // Correlation ID for request tracking
        this.app.use(correlationIdMiddleware);

        // Security middlewares
        this.app.use(...applySecurity());

        // Rate limiting — skip for /auth/refresh which has its own lenient limiter
        this.app.use((req, res, next) => {
            if (req.path === '/api/v1/auth/refresh') return next();
            return rateLimiter(req, res, next);
        });

        // Body parsing — 100 kb limit reduces DoS surface
        this.app.use(express.json({ limit: '100kb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '100kb' }));

        // Response compression
        this.app.use(compression());
    }

    private setupRoutes(): void {
        // Health check endpoint (no auth required)
        this.app.use('/health', healthRouter);

        // API routes with prefix
        this.app.use(config.server.apiPrefix, apiRouter);

        // Root endpoint
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                status: 'success',
                message: 'Kali MHS Enterprise API',
                version: '1.0.0',
                environment: config.server.env,
                timestamp: new Date().toISOString(),
            });
        });
    }

    private setupErrorHandling(): void {
        // 404 handler (must be after all routes)
        this.app.use(notFoundHandler);

        // Global error handler (must be last)
        this.app.use(errorHandler);
    }

    public async start(): Promise<void> {
        try {
            // Connect to database
            await database.connect();

            // Start server
            this.app.listen(config.server.port, () => {
                console.log('');
                console.log('🚀 ========================================');
                console.log('🚀  Kali MHS Enterprise API Server');
                console.log('🚀 ========================================');
                console.log(`   Environment: ${config.server.env}`);
                console.log(`   Port: ${config.server.port}`);
                console.log(`   API Prefix: ${config.server.apiPrefix}`);
                console.log(`   URL: http://localhost:${config.server.port}`);
                console.log('🚀 ========================================');
                console.log('');
            });
        } catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    }

    public getApp(): Application {
        return this.app;
    }
}

// Create and export server instance
export const server = new Server();
