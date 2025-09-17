import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

export async function dbConnect() {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Using existing MongoDB connection");
            return mongoose;
        }

        console.log("Creating new MongoDB connection...");
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
            retryWrites: true
        });
        console.log("MongoDB connected successfully");
        return mongoose;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Don't throw the error - return null instead
        return null;
    }
}
