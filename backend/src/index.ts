import { server } from './app';

// Start the server
server.start().catch((error) => {
    console.error('Fatal error during startup:', error);
    process.exit(1);
});

// Handle unhandled promise rejections — exit so the process manager can restart cleanly
process.on('unhandledRejection', (reason: unknown) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    setTimeout(() => process.exit(1), 10000).unref();
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    // Gracefully shutdown
    process.exit(1);
});
