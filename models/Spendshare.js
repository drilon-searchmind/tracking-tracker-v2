import mongoose from "mongoose";

const spendshareSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    forecastData: {
        spendshare: { type: [Number], default: Array(12).fill(0.2) },
        spendMeta: { type: [Number], default: Array(12).fill(0) },
        spendGoogleAds: { type: [Number], default: Array(12).fill(0) },
        netSales: { type: [Number], default: Array(12).fill(0) },
    },
    share1: { type: Number, default: 0 },
    share2: { type: Number, default: 0 },
    share3: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Spendshare || mongoose.model("Spendshare", spendshareSchema);