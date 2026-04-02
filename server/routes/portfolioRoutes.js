const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { upload, getPortfolio, createPortfolio, updatePortfolio, deletePortfolio } = require("../controllers/portfolioController");

const router = express.Router();

router.get("/", asyncHandler(getPortfolio));
router.post("/", requireAuth, upload.single("image"), asyncHandler(createPortfolio));
router.put("/:id", requireAuth, upload.single("image"), asyncHandler(updatePortfolio));
router.delete("/:id", requireAuth, asyncHandler(deletePortfolio));

module.exports = router;
