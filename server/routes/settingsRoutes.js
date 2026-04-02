const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { getSettings, updateSettings } = require("../controllers/settingsController");

const router = express.Router();

router.get("/", asyncHandler(getSettings));
router.put("/", requireAuth, asyncHandler(updateSettings));

module.exports = router;
