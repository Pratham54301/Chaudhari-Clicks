const path = require("path");
const multer = require("multer");
const Portfolio = require("../models/Portfolio");
const Category = require("../models/Category");
const deleteLocalFile = require("../utils/deleteLocalFile");

const uploadDir = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) return callback(null, true);
    return callback(new Error("Only image uploads are allowed."));
  }
});

async function getPortfolio(req, res) {
  const items = await Portfolio.find().populate("category").sort({ createdAt: -1 });
  res.json(items);
}

async function createPortfolio(req, res) {
  const categoryId = String(req.body.category || req.body.categoryId || "").trim();
  const title = String(req.body.title || "").trim();
  if (!req.file || !categoryId) return res.status(400).json({ message: "Category and image are required." });

  const category = await Category.findById(categoryId);
  if (!category) {
    await deleteLocalFile(req.file.path);
    return res.status(404).json({ message: "Selected category was not found." });
  }

  const item = await Portfolio.create({
    title,
    category: category._id,
    imageUrl: `/uploads/${req.file.filename}`,
    imagePath: req.file.path
  });

  return res.status(201).json(await item.populate("category"));
}

async function updatePortfolio(req, res) {
  const item = await Portfolio.findById(req.params.id);
  if (!item) {
    if (req.file) await deleteLocalFile(req.file.path);
    return res.status(404).json({ message: "Portfolio item not found." });
  }

  const categoryId = String(req.body.category || req.body.categoryId || item.category).trim();
  const category = await Category.findById(categoryId);
  if (!category) {
    if (req.file) await deleteLocalFile(req.file.path);
    return res.status(404).json({ message: "Selected category was not found." });
  }

  item.title = String(req.body.title || item.title || "").trim();
  item.category = category._id;

  if (req.file) {
    await deleteLocalFile(item.imagePath);
    item.imageUrl = `/uploads/${req.file.filename}`;
    item.imagePath = req.file.path;
  }

  await item.save();
  return res.json(await item.populate("category"));
}

async function deletePortfolio(req, res) {
  const item = await Portfolio.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Portfolio item not found." });
  await deleteLocalFile(item.imagePath);
  return res.json({ message: "Portfolio item deleted successfully." });
}

module.exports = { upload, getPortfolio, createPortfolio, updatePortfolio, deletePortfolio };
