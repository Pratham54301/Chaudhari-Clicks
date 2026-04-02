const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { createBooking, getBookings, updateBooking } = require("../controllers/bookingController");

const router = express.Router();

router.post("/", asyncHandler(createBooking));
router.get("/", requireAuth, asyncHandler(getBookings));
router.put("/:id", requireAuth, asyncHandler(updateBooking));

module.exports = router;
