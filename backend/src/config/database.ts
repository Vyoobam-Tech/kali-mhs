import mongoose from 'mongoose';
import { config } from './env';

export class Database {
    private static instance: Database;
    private isConnected = false;

    private constructor() { }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('📦 Database already connected');
            return;
        }

        try {
            const options: mongoose.ConnectOptions = {
                maxPoolSize: 10,
                minPoolSize: 5,
                socketTimeoutMS: 45000,
                serverSelectionTimeoutMS: 5000,
                family: 4, // Use IPv4, skip trying IPv6
            };

            await mongoose.connect(config.database.uri, options);
            this.isConnected = true;

            console.log('✅ MongoDB connected successfully');
            console.log(`   Environment: ${config.server.env}`);
            console.log(`   Database: ${mongoose.connection.name}`);

            // Handle connection events
            mongoose.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️  MongoDB disconnected');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                console.log('✅ MongoDB reconnected');
                this.isConnected = true;
            });

            // Graceful shutdown
            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.connection.close();
            this.isConnected = false;
            console.log('👋 MongoDB disconnected gracefully');
        } catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    public getConnection(): mongoose.Connection {
        return mongoose.connection;
    }

    public isConnectedToDatabase(): boolean {
        return this.isConnected && mongoose.connection.readyState === 1;
    }
}

export const database = Database.getInstance();
