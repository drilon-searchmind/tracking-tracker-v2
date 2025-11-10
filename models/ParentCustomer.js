import mongoose from "mongoose";

const ParentCustomerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true 
    },
    description: { 
        type: String 
    },
    industry: { 
        type: String 
    },
    headquarters: { 
        type: String 
    },
    website: { 
        type: String 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }, 
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    isArchived: { 
        type: Boolean, 
        default: false 
    },
});

export default mongoose.models.ParentCustomer || mongoose.model("ParentCustomer", ParentCustomerSchema);