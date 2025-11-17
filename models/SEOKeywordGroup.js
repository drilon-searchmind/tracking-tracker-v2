import mongoose from "mongoose";

const SEOKeywordGroupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    keywords: [{ 
        type: String, 
        required: true,
        trim: true
    }],
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer", 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }, 
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
});

// Compound index to ensure unique group names per customer
SEOKeywordGroupSchema.index({ customer: 1, name: 1 }, { unique: true });

// Update the updatedAt field on save
SEOKeywordGroupSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.SEOKeywordGroup || mongoose.model("SEOKeywordGroup", SEOKeywordGroupSchema);