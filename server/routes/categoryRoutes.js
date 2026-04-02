const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", asyncHandler(getCategories));
router.post("/", requireAuth, asyncHandler(createCategory));
router.put("/:id", requireAuth, asyncHandler(updateCategory));
router.delete("/:id", requireAuth, asyncHandler(deleteCategory));

module.exports = router;
