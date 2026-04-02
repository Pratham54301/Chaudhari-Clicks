const Pricing = require("../models/Pricing");

function sanitizeFeatures(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function sanitizePayload(body = {}) {
  const featuredValue = body.featured;
  const payload = {
    title: String(body.title || body.name || "").trim(),
    price: String(body.price || "").trim(),
    features: sanitizeFeatures(body.features),
    buttonLabel: String(body.buttonLabel || "Choose Plan").trim() || "Choose Plan",
    featured: featuredValue === true || featuredValue === "true"
  };

  if (body.order !== undefined && body.order !== null && body.order !== "") {
    const nextOrder = Number(body.order);
    if (Number.isFinite(nextOrder)) {
      payload.order = nextOrder;
    }
  }

  return payload;
}

function validatePayload(payload) {
  if (!payload.title) return "Plan title is required.";
  if (!payload.price) return "Plan price is required.";
  if (!payload.features.length) return "Add at least one feature to the pricing plan.";
  return "";
}

async function getPricing(_req, res) {
  const plans = await Pricing.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(plans);
}

async function createPricing(req, res) {
  const payload = sanitizePayload(req.body);
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  if (payload.order === undefined) {
    const lastPlan = await Pricing.findOne().sort({ order: -1, createdAt: -1 }).lean();
    payload.order = (lastPlan?.order || 0) + 1;
  }

  if (payload.featured) {
    await Pricing.updateMany({}, { $set: { featured: false } });
  }

  const plan = await Pricing.create(payload);
  return res.status(201).json(plan);
}

async function updatePricing(req, res) {
  const existing = await Pricing.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Pricing plan not found." });

  const payload = sanitizePayload({
    ...existing.toObject(),
    ...req.body
  });
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  if (payload.featured) {
    await Pricing.updateMany({ _id: { $ne: existing._id } }, { $set: { featured: false } });
  }

  existing.title = payload.title;
  existing.price = payload.price;
  existing.features = payload.features;
  existing.buttonLabel = payload.buttonLabel;
  existing.featured = payload.featured;
  existing.order = payload.order === undefined ? existing.order : payload.order;

  await existing.save();
  return res.json(existing);
}

async function deletePricing(req, res) {
  const plan = await Pricing.findByIdAndDelete(req.params.id);
  if (!plan) return res.status(404).json({ message: "Pricing plan not found." });
  return res.json({ message: "Pricing plan deleted successfully." });
}

module.exports = { getPricing, createPricing, updatePricing, deletePricing };
