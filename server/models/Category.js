const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, trim: true, unique: true }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function setSlug(next) {
  if (this.name) this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model("Category", categorySchema);
