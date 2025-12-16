import mongoose from "mongoose"

const CustomerSettingsSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    metricPreference: { type: String, enum: ["ROAS/POAS", "Spendshare"], required: true, default: "ROAS/PAOS" },
    customerValuta: { type: String, required: true, default: "DKK" },
    customerValutaCode: { type: String, required: false, default: "DKK" },
    customerClickupID: { type: String, default: "" },
    customerMetaID: { type: String, default: "" },
    customerMetaIDExclude: { type: String, default: "" },
    changeCurrency: { type: Boolean, default: true },
    
    shopifyUrl: { type: String, default: "" },
    shopifyApiPassword: { type: String, default: "" },
    facebookAdAccountId: { type: String, default: "" },
    googleAdsCustomerId: { type: String, default: "" },
}, { timestamps: true })

export default mongoose.models.CustomerSettings || mongoose.model("CustomerSettings", CustomerSettingsSchema);