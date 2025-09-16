const mongoose = require("mongoose")

const AssignedCampaignUsersSchema = new mongoose.Schema({
    assignedUserId: {
        type: String,
        required: true,
        index: true,
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Campaign",
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

AssignedCampaignUsersSchema.index({ assignedUserId: 1, campaignId: 1 }, { unique: true });

module.exports = mongoose.models.AssignedCampaignUsers || mongoose.model("AssignedCampaignUsers", AssignedCampaignUsersSchema)