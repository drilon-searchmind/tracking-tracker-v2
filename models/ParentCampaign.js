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
    service: [{
        type: String,
        enum: ["Paid Social", "Paid Search", "Email Marketing", "SEO"],
    }],
    countryCode: {
        type: String,
    },
    campaignText: {
        type: String,
    },
    campaignMessage: {
        type: String,
    },
    campaignBrief: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    b2bOrB2c: {
        type: String,
        enum: ["B2B", "B2C"],
    },
    budget: {
        type: Number,
        min: 0,
    },
    materialFromCustomer: {
        type: String,
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