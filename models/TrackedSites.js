import mongoose from "mongoose";

const TrackedSitesSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    websiteStreamURL: { type: String },
    ga4MeasurementId: { type: String },
    ga4PropertyId: { type: String },
    ga4PropertyName: { type: String },
    propertyId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    trackedData: [{
        isGTMFound: { type: Boolean, default: false },
        lastTimeTracked: { type: String },
        isTracked: { type: Boolean, default: false },
        ga4PropertyData: [{
            activeUsers: { type: String },
            sessions: { type: String },
        }]
    }]
}, {
    timestamps: true,
    collection: "TrackedSites",
})

export default mongoose.models.TrackedSites || mongoose.model("TrackedSites", TrackedSitesSchema)