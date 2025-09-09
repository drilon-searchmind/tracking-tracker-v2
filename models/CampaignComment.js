const mongoose = require("mongoose");

const CampaignCommentSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Campaign",
        index: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        default: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    isEdited: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.models.CampaignComment || mongoose.model("CampaignComment", CampaignCommentSchema);