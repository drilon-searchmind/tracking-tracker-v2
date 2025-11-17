import mongoose from "mongoose";

const SEOBrandKeywordSchema = new mongoose.Schema({
    keywords: [{ 
        type: String, 
        required: true,
        trim: true
    }],
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer", 
        required: true,
        unique: true // Each customer can only have one brand keyword document
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

// Update the updatedAt field on save
SEOBrandKeywordSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.SEOBrandKeyword || mongoose.model("SEOBrandKeyword", SEOBrandKeywordSchema);