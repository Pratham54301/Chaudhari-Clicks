const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true, trim: true },
    imagePath: { type: String, trim: true, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
