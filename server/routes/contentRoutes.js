const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { getSiteContent, updateSiteContent } = require("../controllers/siteContentController");

const router = express.Router();

router.get("/", asyncHandler(getSiteContent));
router.put("/", requireAuth, asyncHandler(updateSiteContent));

module.exports = router;
