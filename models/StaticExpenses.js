import mongoose from "mongoose";

const StaticExpensesSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    cogs_percentage: {
        type: Number,
        required: true,
        default: 0.7,
    },
    shipping_cost_per_order: {
        type: Number,
        required: true,
        default: 15,
    },
    transaction_cost_percentage: {
        type: Number,
        required: true,
        default: 0.015,
    },
    marketing_bureau_cost: {
        type: Number,
        required: true,
        default: 250000,
    },
    marketing_tooling_cost: {
        type: Number,
        required: true,
        default: 80000,
    },
    fixed_expenses: {
        type: Number,
        required: true,
        default: 1000000,
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

export default mongoose.models.StaticExpenses || mongoose.model("StaticExpenses", StaticExpensesSchema);