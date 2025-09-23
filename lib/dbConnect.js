import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedConnection = null;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Improve connection handling
export async function dbConnect(retryCount = 0) {
    try {
        if (mongoose.connection.readyState === 1) {
            return mongoose;
        }
        
        if (cachedConnection) {
            return cachedConnection;
        }
        
        // Only log in development
        if (process.env.NODE_ENV !== 'production') {
            console.log("Creating new MongoDB connection...");
        }
        
        cachedConnection = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000, // Increase from 10000
            retryWrites: true,
            bufferCommands: true, // Set to true for both environments
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000, // Increase from 30000
        });
        
        const connection = await cachedConnection;
        
        if (process.env.NODE_ENV !== 'production') {
            console.log("MongoDB connected successfully");
        }
        
        return connection;
    } catch (error) {
        console.error(`MongoDB connection error (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, error);
        
        cachedConnection = null;
        
        if (retryCount < MAX_RETRIES) {
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Retrying connection in ${RETRY_DELAY}ms...`);
            }
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return dbConnect(retryCount + 1);
        }
        
        throw error;
    }
}