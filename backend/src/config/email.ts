import { config } from './env';

export const emailConfig = {
    smtp: {
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: config.email.smtp.secure,
        auth: {
            user: config.email.smtp.auth.user,
            pass: config.email.smtp.auth.pass,
        },
    },
    from: {
        email: config.email.from.email,
        name: config.email.from.name,
    },
    adminEmails: config.email.adminEmails,
    templates: {
        path: './src/infrastructure/email/templates',
    },
    queue: {
        maxRetries: 3,
        retryDelay: 5000, // 5 seconds
        maxConcurrent: 5,
    },
};
