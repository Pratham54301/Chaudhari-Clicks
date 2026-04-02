const Category = require("../models/Category");
const Portfolio = require("../models/Portfolio");

async function getCategories(req, res) {
  res.json(await Category.find().sort({ name: 1 }));
}

async function createCategory(req, res) {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "Category name is required." });
  const category = await Category.create({ name });
  return res.status(201).json(category);
}

async function updateCategory(req, res) {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "Category name is required." });
  const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ message: "Category not found." });
  return res.json(category);
}

async function deleteCategory(req, res) {
  if (await Portfolio.exists({ category: req.params.id })) {
    return res.status(400).json({ message: "Delete or reassign portfolio items in this category before removing it." });
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found." });
  return res.json({ message: "Category deleted successfully." });
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
