const AdminUser = require("../models/AdminUser");
const Category = require("../models/Category");
const PortfolioItem = require("../models/PortfolioItem");
const Setting = require("../models/Setting");
const SiteContent = require("../models/SiteContent");
const Testimonial = require("../models/Testimonial");
const {
  defaultAdminUser,
  defaultCategories,
  defaultPortfolioItems,
  defaultSiteContent,
  defaultSettings,
  defaultTestimonials
} = require("../config/defaultData");

async function seedDefaults() {
  const existingAdmin = await AdminUser.findOne({ username: defaultAdminUser.username });

  if (!existingAdmin) {
    await AdminUser.create(defaultAdminUser);
  }

  const categoryCount = await Category.countDocuments();

  if (categoryCount === 0) {
    await Category.insertMany(defaultCategories);
  }

  const content = await SiteContent.findOne({ singletonKey: "main" });

  if (!content) {
    await SiteContent.create(defaultSiteContent);
  }

  const settings = await Setting.findOne({ singletonKey: "global" });

  if (!settings) {
    await Setting.create(defaultSettings);
  }

  const testimonialCount = await Testimonial.countDocuments();

  if (testimonialCount === 0) {
    await Testimonial.insertMany(defaultTestimonials);
  }

  const portfolioCount = await PortfolioItem.countDocuments();

  if (portfolioCount === 0) {
    const categories = await Category.find().lean();
    const categoryMap = categories.reduce((accumulator, item) => {
      accumulator[item.slug] = item._id;
      return accumulator;
    }, {});

    const portfolioDocuments = defaultPortfolioItems.map((item) => ({
      title: item.title,
      category: categoryMap[item.categorySlug],
      imageUrl: item.imageUrl,
      imagePath: "",
      displayOrder: item.displayOrder
    }));

    await PortfolioItem.insertMany(portfolioDocuments);
  }
}

module.exports = seedDefaults;
