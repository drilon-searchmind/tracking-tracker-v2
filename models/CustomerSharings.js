import mongoose from "mongoose";

const customerSharingsSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  sharedWith: {
    type: String,
    required: true,
  },
  userCreated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CustomerSharings = mongoose.models.CustomerSharings || mongoose.model("CustomerSharings", customerSharingsSchema);

export default CustomerSharings;