const express = require("express");
const authRoutes = require("./authRoutes");
const leadRoutes = require("./leadRoutes");
const bookingRoutes = require("./bookingRoutes");
const categoryRoutes = require("./categoryRoutes");
const portfolioRoutes = require("./portfolioRoutes");
const pricingRoutes = require("./pricingRoutes");
const testimonialRoutes = require("./testimonialRoutes");
const settingsRoutes = require("./settingsRoutes");
const contentRoutes = require("./contentRoutes");
const siteRoutes = require("./siteRoutes");

const router = express.Router();

router.use(authRoutes);
router.use(siteRoutes);
router.use("/leads", leadRoutes);
router.use("/bookings", bookingRoutes);
router.use("/categories", categoryRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/pricing", pricingRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/settings", settingsRoutes);
router.use("/content", contentRoutes);
router.use("/admin/leads", leadRoutes);
router.use("/admin/categories", categoryRoutes);
router.use("/admin/portfolio", portfolioRoutes);
router.use("/admin/pricing", pricingRoutes);
router.use("/admin/testimonials", testimonialRoutes);
router.use("/admin/settings", settingsRoutes);
router.use("/admin/content", contentRoutes);

module.exports = router;
