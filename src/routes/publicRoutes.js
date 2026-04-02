const express = require("express");

const Category = require("../models/Category");
const PortfolioItem = require("../models/PortfolioItem");
const SiteContent = require("../models/SiteContent");
const Setting = require("../models/Setting");
const Testimonial = require("../models/Testimonial");
const Lead = require("../models/Lead");

const router = express.Router();

function formatPortfolioItems(items) {
  return items.map((item) => ({
    id: item._id,
    title: item.title,
    imageUrl: item.imageUrl,
    category: item.category
      ? {
          id: item.category._id,
          name: item.category.name,
          slug: item.category.slug
        }
      : null
  }));
}

router.get("/site", async (req, res, next) => {
  try {
    const [content, settings, categories, portfolioItems, testimonials] = await Promise.all([
      SiteContent.findOne({ singletonKey: "main" }).lean(),
      Setting.findOne({ singletonKey: "global" }).lean(),
      Category.find().sort({ displayOrder: 1, createdAt: 1 }).lean(),
      PortfolioItem.find()
        .populate("category")
        .sort({ displayOrder: 1, createdAt: 1 })
        .lean(),
      Testimonial.find().sort({ displayOrder: 1, createdAt: 1 }).lean()
    ]);

    res.json({
      content,
      settings,
      categories,
      portfolioItems: formatPortfolioItems(portfolioItems),
      testimonials
    });
  } catch (error) {
    next(error);
  }
});

router.post("/leads", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const eventType = String(req.body.eventType || "").trim();
    const eventDate = String(req.body.eventDate || "").trim();
    const message = String(req.body.message || "").trim();
    const normalizedPhone = phone.replace(/\D/g, "");

    if (name.length < 3) {
      return res.status(400).json({ message: "Please enter a valid name." });
    }

    if (normalizedPhone.length < 10) {
      return res.status(400).json({ message: "Please enter a valid phone number." });
    }

    if (!eventType || !eventDate) {
      return res.status(400).json({ message: "Event type and date are required." });
    }

    await Lead.create({
      name,
      phone,
      eventType,
      eventDate,
      message
    });

    return res.status(201).json({ message: "Inquiry sent successfully." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
