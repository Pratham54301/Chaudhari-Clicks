const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { createLead, getLeads, updateLead, deleteLead } = require("../controllers/leadController");

const router = express.Router();

router.post("/", asyncHandler(createLead));
router.get("/", requireAuth, asyncHandler(getLeads));
router.put("/:id", requireAuth, asyncHandler(updateLead));
router.patch("/:id", requireAuth, asyncHandler(updateLead));
router.delete("/:id", requireAuth, asyncHandler(deleteLead));

module.exports = router;
