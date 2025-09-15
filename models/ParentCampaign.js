const mongoose = require("mongoose")

const ParentCampaignSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        index: true,
    },
    parentCampaignName: {
        type: String,
        required: true,
    },
    materialLinks: {
        type: String,
    },
    childCampaigns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign"
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.models.ParentCampaign || mongoose.model("ParentCampaign", ParentCampaignSchema)