import mongoose from "mongoose";

const ConfigRevenueBudgetSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    configs: [
        {
            month: { type: String, required: true }, 
            year: { type: String, required: true },
            revenue: { type: String, required: true },
            budget: { type: String, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.ConfigRevenueBudget || mongoose.model("ConfigRevenueBudget", ConfigRevenueBudgetSchema);