import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bigQueryCustomerId: { type: String, required: true },
    bigQueryProjectId: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);