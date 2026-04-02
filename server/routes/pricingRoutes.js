const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing
} = require("../controllers/pricingController");

const router = express.Router();

router.get("/", asyncHandler(getPricing));
router.post("/", requireAuth, asyncHandler(createPricing));
router.put("/:id", requireAuth, asyncHandler(updatePricing));
router.delete("/:id", requireAuth, asyncHandler(deletePricing));

module.exports = router;
