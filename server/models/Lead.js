const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted"],
      default: "New"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
