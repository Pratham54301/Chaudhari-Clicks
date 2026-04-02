const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      trim: true,
      default: ""
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
