import mongoose from "mongoose";

const CustomerSharingsSchema = new mongoose.Schema({
    customer: {
        type: String, // Changed from mongoose.Schema.Types.ObjectId to String
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    sharedWith: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

CustomerSharingsSchema.index({ customer: 1, email: 1 }, { unique: true });

export default mongoose.models.CustomerSharings || mongoose.model("CustomerSharings", CustomerSharingsSchema);