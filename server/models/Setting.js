const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, required: true, unique: true, default: "global" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    socialLinks: {
      instagram: { type: String, trim: true, default: "" },
      facebook: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      whatsapp: { type: String, trim: true, default: "" }
    },
    brandDescription: { type: String, trim: true, default: "" },
    instagramHandle: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
