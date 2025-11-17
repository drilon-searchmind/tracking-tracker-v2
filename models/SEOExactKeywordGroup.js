const mongoose = require('mongoose');
const { Schema } = mongoose;

const SEOExactKeywordGroupSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying by customer
SEOExactKeywordGroupSchema.index({ customer: 1 });

// Index for efficient querying by customer and name
SEOExactKeywordGroupSchema.index({ customer: 1, name: 1 });

module.exports = mongoose.models.SEOExactKeywordGroup || mongoose.model('SEOExactKeywordGroup', SEOExactKeywordGroupSchema);