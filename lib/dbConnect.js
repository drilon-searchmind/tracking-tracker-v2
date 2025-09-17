import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedConnection = null;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function dbConnect(retryCount = 0) {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Using existing MongoDB connection");
            return mongoose;
        }
        
        if (cachedConnection) {
            console.log("Using cached MongoDB connection promise");
            return cachedConnection;
        }
        
        console.log("Creating new MongoDB connection...");
        
        cachedConnection = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10s timeout
            retryWrites: true
        });
        
        const connection = await cachedConnection;
        console.log("MongoDB connected successfully");
        return connection;
    } catch (error) {
        console.error(`MongoDB connection error (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, error);
        
        cachedConnection = null;
        
        if (retryCount < MAX_RETRIES) {
            console.log(`Retrying connection in ${RETRY_DELAY}ms...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return dbConnect(retryCount + 1);
        }
        
        throw error;
    }
}