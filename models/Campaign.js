const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        index: true,
    },
    service: {
        type: String,
        enum: ["Paid Social", "Paid Search", "Email Marketing", "SEO"],
        required: true,
    },
    media: {
        type: String,
        enum: ["META", "LinkedIn", "Pinterest", "TikTok", "YouTube", "Google", "Email", "Website", "Other"],
        required: true,
    },
    campaignFormat: {
        type: String,
        enum: ["Video", "Picture", "Carousel", "Display Ad", "Search Ad", "Newsletter", "Email Flow", "Landingpage"],
        required: true,
    },
    countryCode: {
        type: String,
        enum: ["DK", "DE", "NL", "NO", "FR", "Other"],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    campaignName: {
        type: String,
        required: true,
    },
    messageBrief: {
        type: String,
    },
    b2bOrB2c: {
        type: String,
        enum: ["B2B", "B2C"],
        required: true,
    },
    budget: {
        type: Number,
        required: true,
        min: 0,
    },
    landingpage: {
        type: String,
    },
    materialFromCustomer: {
        type: String,
    },
    readyForApproval: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["Pending Approval", "Approved", "Live"],
        default: "Pending Approval",
    },
    commentToCustomer: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parentCampaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ParentCampaign",
        default: null
    },
});

module.exports = mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);