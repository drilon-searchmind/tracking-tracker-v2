import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

export async function dbConnect() {
    if (mongoose.connection.readyState === 1) {
        console.log("🗄️  Using existing MongoDB connection (readyState=1)");
        return mongoose;
    }

    console.log("🗄️  Creating new MongoDB connection...");
    await mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
    });
    console.log("✅ MongoDB connected! (readyState=" + mongoose.connection.readyState + ")");
    return mongoose;
}
