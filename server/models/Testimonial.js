const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true, default: "" },
    message: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
