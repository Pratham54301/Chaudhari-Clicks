const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    features: [{ type: String, trim: true }],
    buttonLabel: { type: String, trim: true, default: "Choose Plan" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pricing", pricingSchema);
