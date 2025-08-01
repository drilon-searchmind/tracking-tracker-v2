import mongoose from "mongoose";

const CustomerSharingsSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
})

export default mongoose.models.CustomerSharings || mongoose.model("CustomerSharings", CustomerSharingsSchema);