/**
 * Vercel Serverless Entry Point
 *
 * Vercel runs this file as a serverless function.
 * It exports the Express app so Vercel can route all HTTP requests into it.
 *
 * DB connection is established once per cold start and reused across
 * warm invocations (the Database singleton caches the mongoose connection).
 */
import { database } from '../src/config/database';
import { server } from '../src/app';

// Connect to MongoDB — safe to call multiple times (singleton guards re-connection)
database.connect().catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

export default server.getApp();
