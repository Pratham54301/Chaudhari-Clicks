const Category = require("../models/Category");
const Lead = require("../models/Lead");
const Pricing = require("../models/Pricing");
const Portfolio = require("../models/Portfolio");
const Setting = require("../models/Setting");
const SiteContent = require("../models/SiteContent");
const Testimonial = require("../models/Testimonial");
const { settings: defaultSettings } = require("../config/defaultData");

function formatPortfolio(items) {
  return items.map((item) => ({
    id: item._id,
    title: item.title,
    imageUrl: item.imageUrl,
    category: item.category
      ? { id: item.category._id, name: item.category.name, slug: item.category.slug }
      : null
  }));
}

function normalizeSettings(settings) {
  return {
    contact: {
      phone: settings?.phone || defaultSettings.phone || "",
      email: settings?.email || defaultSettings.email || "",
      location: settings?.location || defaultSettings.location || "",
      whatsapp: settings?.socialLinks?.whatsapp || defaultSettings.socialLinks?.whatsapp || ""
    },
    social: {
      instagram: settings?.socialLinks?.instagram || defaultSettings.socialLinks?.instagram || "",
      facebook: settings?.socialLinks?.facebook || defaultSettings.socialLinks?.facebook || "",
      twitter: settings?.socialLinks?.twitter || defaultSettings.socialLinks?.twitter || ""
    },
    brand: {
      description: settings?.brandDescription || defaultSettings.brandDescription || "",
      instagramHandle: settings?.instagramHandle || defaultSettings.instagramHandle || ""
    }
  };
}

function normalizeTestimonials(items) {
  return items.map((item) => ({
    _id: item._id,
    name: item.name,
    author: item.name,
    role: item.role || "",
    message: item.message,
    quote: item.message,
    approved: item.approved
  }));
}

function normalizeLeads(items) {
  return items.map((item) => ({
    ...item,
    eventDate: item.date
  }));
}

function normalizePricing(items) {
  return items.map((item) => ({
    _id: item._id,
    title: item.title,
    price: item.price,
    features: Array.isArray(item.features) ? item.features : [],
    buttonLabel: item.buttonLabel || "Choose Plan",
    featured: Boolean(item.featured),
    order: Number.isFinite(item.order) ? item.order : 0
  }));
}

async function getSiteBootstrap(req, res) {
  const [content, settings, categories, portfolioItems, testimonials, pricingPlans] = await Promise.all([
    SiteContent.findOne({ singletonKey: "main" }).lean(),
    Setting.findOne({ singletonKey: "global" }).lean(),
    Category.find().sort({ name: 1 }).lean(),
    Portfolio.find().populate("category").sort({ createdAt: -1 }).lean(),
    Testimonial.find({ approved: true }).sort({ createdAt: -1 }).lean(),
    Pricing.find().sort({ order: 1, createdAt: 1 }).lean()
  ]);

  res.json({
    content,
    settings: normalizeSettings(settings),
    categories,
    portfolioItems: formatPortfolio(portfolioItems),
    testimonials: normalizeTestimonials(testimonials),
    pricingPlans: normalizePricing(pricingPlans)
  });
}

async function getAdminBootstrap(req, res) {
  const [content, settings, categories, portfolioItems, testimonials, leads, pricingPlans] =
    await Promise.all([
      SiteContent.findOne({ singletonKey: "main" }).lean(),
      Setting.findOne({ singletonKey: "global" }).lean(),
      Category.find().sort({ name: 1 }).lean(),
      Portfolio.find().populate("category").sort({ createdAt: -1 }).lean(),
      Testimonial.find().sort({ createdAt: -1 }).lean(),
      Lead.find().sort({ createdAt: -1 }).lean(),
      Pricing.find().sort({ order: 1, createdAt: 1 }).lean()
    ]);

  res.json({
    content,
    settings: normalizeSettings(settings),
    categories,
    portfolioItems: formatPortfolio(portfolioItems),
    testimonials: normalizeTestimonials(testimonials),
    leads: normalizeLeads(leads),
    pricingPlans: normalizePricing(pricingPlans)
  });
}

module.exports = { getSiteBootstrap, getAdminBootstrap };
