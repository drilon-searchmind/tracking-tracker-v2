import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Global variable to track connection attempts for current request
let isConnecting = false;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (cached.promise) {
        try {
            cached.conn = await cached.promise;
            return cached.conn;
        } catch (e) {
            cached.promise = null;
            console.error("MongoDB connection attempt failed, retrying:", e);
        }
    }

    if (isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return dbConnect();
    }

    try {
        isConnecting = true;
        const opts = {
            bufferCommands: true, // Changed from false to true
            serverSelectionTimeoutMS: 15000, // Increased from 10000
            maxPoolSize: 10,
            connectTimeoutMS: 15000, 
            socketTimeoutMS: 30000,
            retryWrites: true
        };

        console.log("Creating new MongoDB connection...");
        cached.promise = mongoose.connect(MONGODB_URI, opts);
        cached.conn = await cached.promise;
        console.log("MongoDB connected successfully");
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            if (err.name === 'MongoNetworkError') {
                cached.conn = null;
                cached.promise = null;
            }
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected, will attempt reconnect on next request');
            cached.conn = null;
            cached.promise = null;
        });

        return cached.conn;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        cached.promise = null;
        throw error;
    } finally {
        isConnecting = false;
    }
}