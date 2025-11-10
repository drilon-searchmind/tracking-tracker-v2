import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bigQueryCustomerId: { type: String, required: true },
    bigQueryProjectId: { type: String, required: true },
    parentCustomer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ParentCustomer", 
        default: null 
    },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: false },
});

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);