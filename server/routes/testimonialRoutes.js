const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require("../controllers/testimonialController");

const router = express.Router();

router.get("/", asyncHandler(getTestimonials));
router.post("/", requireAuth, asyncHandler(createTestimonial));
router.put("/:id", requireAuth, asyncHandler(updateTestimonial));
router.delete("/:id", requireAuth, asyncHandler(deleteTestimonial));

module.exports = router;
