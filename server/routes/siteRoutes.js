const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { getSiteBootstrap, getAdminBootstrap } = require("../controllers/siteController");

const router = express.Router();

router.get("/site", asyncHandler(getSiteBootstrap));
router.get("/admin/bootstrap", requireAuth, asyncHandler(getAdminBootstrap));

module.exports = router;
