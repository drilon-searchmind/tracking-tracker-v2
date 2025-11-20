import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        // *** OLD OPTIONS
        // const opts = {
        //     bufferCommands: true,
        //     serverSelectionTimeoutMS: 30000,
        //     maxPoolSize: 10,
        //     socketTimeoutMS: 60000,
        //     family: 4,
        // };

        // *** NEW OPTIONS FOR IMPROVED PERFORMANCE AND RELIABILITY
        const opts = {
            bufferCommands: false, // Disable buffering to avoid delays in commands
            serverSelectionTimeoutMS: 15000, // Reduce server selection timeout for faster failover
            maxPoolSize: 20, // Increase the connection pool size for higher concurrency
            minPoolSize: 5, // Maintain a minimum number of connections in the pool
            socketTimeoutMS: 45000, // Reduce socket timeout to detect issues faster
            connectTimeoutMS: 10000, // Add connection timeout for faster connection attempts
            family: 4, // Use IPv4 (unchanged)
            heartbeatFrequencyMS: 10000, // Increase heartbeat frequency for faster detection of server availability
            retryWrites: true, // Enable retryable writes for better reliability
            autoIndex: false, // Disable automatic index creation in production for faster startup
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log("MongoDB connected successfully");
                return mongoose;
            })
            .catch((error) => {
                console.error("MongoDB connection failed:", error);
                cached.promise = null;
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
}