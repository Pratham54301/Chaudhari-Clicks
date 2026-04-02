const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    value: { type: String, trim: true, default: "" },
    label: { type: String, trim: true, default: "" }
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    price: { type: String, trim: true, default: "" },
    features: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    buttonLabel: { type: String, trim: true, default: "Choose Plan" }
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, required: true, unique: true, default: "main" },
    hero: {
      eyebrow: { type: String, trim: true, default: "" },
      titleLineOne: { type: String, trim: true, default: "" },
      titleAccent: { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" },
      primaryCta: { type: String, trim: true, default: "" },
      secondaryCta: { type: String, trim: true, default: "" },
      backgroundImage: { type: String, trim: true, default: "" }
    },
    about: {
      eyebrow: { type: String, trim: true, default: "" },
      title: { type: String, trim: true, default: "" },
      descriptionOne: { type: String, trim: true, default: "" },
      descriptionTwo: { type: String, trim: true, default: "" },
      image: { type: String, trim: true, default: "" },
      ctaLabel: { type: String, trim: true, default: "" },
      stats: [statSchema]
    },
    pricing: {
      eyebrow: { type: String, trim: true, default: "" },
      title: { type: String, trim: true, default: "" },
      packages: [packageSchema]
    },
    contact: {
      eyebrow: { type: String, trim: true, default: "" },
      title: { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);
