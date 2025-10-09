import mongoose from "mongoose"

const CustomerSettingsSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    metricPreference: { type: String, enum: ["ROAS/POAS", "Spendshare"], required: true, default: "ROAS/PAOS" },
    customerValuta: { type: String, required: true, default: "DKK" },
    customerClickupID: { type: String, default: "" },
}, { timestamps: true })

export default mongoose.models.CustomerSettings || mongoose.model("CustomerSettings", CustomerSettingsSchema);