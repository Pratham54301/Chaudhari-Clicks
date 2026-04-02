const mongoose = require("mongoose");

const portfolioItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    imagePath: {
      type: String,
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

module.exports = mongoose.model("PortfolioItem", portfolioItemSchema);
