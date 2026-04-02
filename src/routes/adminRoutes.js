const path = require("path");
const express = require("express");
const multer = require("multer");

const { requireAdmin } = require("../middleware/requireAdmin");
const Category = require("../models/Category");
const Lead = require("../models/Lead");
const PortfolioItem = require("../models/PortfolioItem");
const Setting = require("../models/Setting");
const SiteContent = require("../models/SiteContent");
const Testimonial = require("../models/Testimonial");
const slugify = require("../utils/slugify");
const deleteLocalFile = require("../utils/deleteLocalFile");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      return callback(null, true);
    }

    return callback(new Error("Only image uploads are allowed."));
  }
});

router.use(requireAdmin);

function formatPortfolioItems(items) {
  return items.map((item) => ({
    id: item._id,
    title: item.title,
    imageUrl: item.imageUrl,
    category: item.category
      ? {
          id: item.category._id,
          name: item.category.name,
          slug: item.category.slug
        }
      : null,
    createdAt: item.createdAt
  }));
}

async function getUniqueCategorySlug(name, excludeId = null) {
  const baseSlug = slugify(name) || "category";
  let candidate = baseSlug;
  let counter = 1;

  while (
    await Category.exists(
      excludeId ? { slug: candidate, _id: { $ne: excludeId } } : { slug: candidate }
    )
  ) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function sanitizeStats(stats = []) {
  const normalized = Array.isArray(stats) ? stats.slice(0, 2) : [];

  while (normalized.length < 2) {
    normalized.push({ value: "", label: "" });
  }

  return normalized.map((stat) => ({
    value: String(stat.value || "").trim(),
    label: String(stat.label || "").trim()
  }));
}

function sanitizePackages(packages = []) {
  return (Array.isArray(packages) ? packages : []).map((item) => ({
    name: String(item.name || "").trim(),
    price: String(item.price || "").trim(),
    features: (Array.isArray(item.features) ? item.features : [])
      .map((feature) => String(feature || "").trim())
      .filter(Boolean),
    featured: Boolean(item.featured),
    buttonLabel: String(item.buttonLabel || "Choose Plan").trim()
  }));
}

function sanitizeContentPayload(body = {}) {
  return {
    singletonKey: "main",
    hero: {
      eyebrow: String(body.hero?.eyebrow || "").trim(),
      titleLineOne: String(body.hero?.titleLineOne || "").trim(),
      titleAccent: String(body.hero?.titleAccent || "").trim(),
      description: String(body.hero?.description || "").trim(),
      primaryCta: String(body.hero?.primaryCta || "").trim(),
      secondaryCta: String(body.hero?.secondaryCta || "").trim(),
      backgroundImage: String(body.hero?.backgroundImage || "").trim()
    },
    about: {
      eyebrow: String(body.about?.eyebrow || "").trim(),
      title: String(body.about?.title || "").trim(),
      descriptionOne: String(body.about?.descriptionOne || "").trim(),
      descriptionTwo: String(body.about?.descriptionTwo || "").trim(),
      image: String(body.about?.image || "").trim(),
      ctaLabel: String(body.about?.ctaLabel || "").trim(),
      stats: sanitizeStats(body.about?.stats)
    },
    pricing: {
      eyebrow: String(body.pricing?.eyebrow || "").trim(),
      title: String(body.pricing?.title || "").trim(),
      packages: sanitizePackages(body.pricing?.packages)
    },
    contact: {
      eyebrow: String(body.contact?.eyebrow || "").trim(),
      title: String(body.contact?.title || "").trim(),
      description: String(body.contact?.description || "").trim()
    }
  };
}

function sanitizeSettingsPayload(body = {}) {
  return {
    singletonKey: "global",
    contact: {
      phone: String(body.contact?.phone || "").trim(),
      email: String(body.contact?.email || "").trim(),
      location: String(body.contact?.location || "").trim(),
      whatsapp: String(body.contact?.whatsapp || "").trim()
    },
    social: {
      instagram: String(body.social?.instagram || "").trim(),
      facebook: String(body.social?.facebook || "").trim(),
      twitter: String(body.social?.twitter || "").trim()
    },
    brand: {
      description: String(body.brand?.description || "").trim(),
      instagramHandle: String(body.brand?.instagramHandle || "").trim()
    }
  };
}

async function getBootstrapPayload() {
  const [categories, portfolioItems, testimonials, leads, content, settings] = await Promise.all([
    Category.find().sort({ displayOrder: 1, createdAt: 1 }).lean(),
    PortfolioItem.find()
      .populate("category")
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean(),
    Testimonial.find().sort({ displayOrder: 1, createdAt: 1 }).lean(),
    Lead.find().sort({ createdAt: -1 }).lean(),
    SiteContent.findOne({ singletonKey: "main" }).lean(),
    Setting.findOne({ singletonKey: "global" }).lean()
  ]);

  return {
    categories,
    portfolioItems: formatPortfolioItems(portfolioItems),
    testimonials,
    leads,
    content,
    settings
  };
}

router.get("/bootstrap", async (req, res, next) => {
  try {
    res.json(await getBootstrapPayload());
  } catch (error) {
    next(error);
  }
});

router.post("/categories", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const slug = await getUniqueCategorySlug(name);
    const lastCategory = await Category.findOne().sort({ displayOrder: -1 }).lean();

    await Category.create({
      name,
      slug,
      displayOrder: lastCategory ? lastCategory.displayOrder + 1 : 1
    });

    return res.status(201).json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.put("/categories/:id", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    category.name = name;
    category.slug = await getUniqueCategorySlug(name, category._id);
    await category.save();

    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.delete("/categories/:id", async (req, res, next) => {
  try {
    const linkedItems = await PortfolioItem.countDocuments({ category: req.params.id });

    if (linkedItems > 0) {
      return res.status(400).json({
        message: "Delete or reassign portfolio items in this category before removing it."
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.post("/portfolio", upload.single("image"), async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    const categoryId = String(req.body.categoryId || "").trim();

    if (!title || !categoryId || !req.file) {
      return res.status(400).json({ message: "Title, category, and image are required." });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      await deleteLocalFile(req.file.path);
      return res.status(404).json({ message: "Selected category was not found." });
    }

    const lastItem = await PortfolioItem.findOne().sort({ displayOrder: -1 }).lean();

    await PortfolioItem.create({
      title,
      category: category._id,
      imageUrl: `/uploads/${req.file.filename}`,
      imagePath: req.file.path,
      displayOrder: lastItem ? lastItem.displayOrder + 1 : 1
    });

    return res.status(201).json(await getBootstrapPayload());
  } catch (error) {
    if (req.file) {
      await deleteLocalFile(req.file.path);
    }

    return next(error);
  }
});

router.put("/portfolio/:id", upload.single("image"), async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    const categoryId = String(req.body.categoryId || "").trim();

    if (!title || !categoryId) {
      if (req.file) {
        await deleteLocalFile(req.file.path);
      }

      return res.status(400).json({ message: "Title and category are required." });
    }

    const [category, item] = await Promise.all([
      Category.findById(categoryId),
      PortfolioItem.findById(req.params.id)
    ]);

    if (!item) {
      if (req.file) {
        await deleteLocalFile(req.file.path);
      }

      return res.status(404).json({ message: "Portfolio item not found." });
    }

    if (!category) {
      if (req.file) {
        await deleteLocalFile(req.file.path);
      }

      return res.status(404).json({ message: "Selected category was not found." });
    }

    if (req.file) {
      await deleteLocalFile(item.imagePath);
      item.imageUrl = `/uploads/${req.file.filename}`;
      item.imagePath = req.file.path;
    }

    item.title = title;
    item.category = category._id;
    await item.save();

    return res.json(await getBootstrapPayload());
  } catch (error) {
    if (req.file) {
      await deleteLocalFile(req.file.path);
    }

    return next(error);
  }
});

router.delete("/portfolio/:id", async (req, res, next) => {
  try {
    const item = await PortfolioItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found." });
    }

    await deleteLocalFile(item.imagePath);

    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.put("/content", async (req, res, next) => {
  try {
    const payload = sanitizeContentPayload(req.body);

    await SiteContent.findOneAndUpdate({ singletonKey: "main" }, payload, {
      new: true,
      upsert: true,
      runValidators: true
    });

    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.put("/settings", async (req, res, next) => {
  try {
    const payload = sanitizeSettingsPayload(req.body);

    await Setting.findOneAndUpdate({ singletonKey: "global" }, payload, {
      new: true,
      upsert: true,
      runValidators: true
    });

    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.patch("/leads/:id", async (req, res, next) => {
  try {
    const status = String(req.body.status || "").trim();

    if (!["new", "contacted"].includes(status)) {
      return res.status(400).json({ message: "Invalid lead status." });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.delete("/leads/:id", async (req, res, next) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.post("/testimonials", async (req, res, next) => {
  try {
    const quote = String(req.body.quote || "").trim();
    const author = String(req.body.author || "").trim();
    const role = String(req.body.role || "").trim();

    if (!quote || !author) {
      return res.status(400).json({ message: "Quote and author are required." });
    }

    const lastTestimonial = await Testimonial.findOne().sort({ displayOrder: -1 }).lean();

    await Testimonial.create({
      quote,
      author,
      role,
      displayOrder: lastTestimonial ? lastTestimonial.displayOrder + 1 : 1
    });

    return res.status(201).json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.put("/testimonials/:id", async (req, res, next) => {
  try {
    const quote = String(req.body.quote || "").trim();
    const author = String(req.body.author || "").trim();
    const role = String(req.body.role || "").trim();

    if (!quote || !author) {
      return res.status(400).json({ message: "Quote and author are required." });
    }

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    testimonial.quote = quote;
    testimonial.author = author;
    testimonial.role = role;
    await testimonial.save();

    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

router.delete("/testimonials/:id", async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    return res.json(await getBootstrapPayload());
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
