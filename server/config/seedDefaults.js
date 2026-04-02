const User = require("../models/User");
const Lead = require("../models/Lead");
const Booking = require("../models/Booking");
const Portfolio = require("../models/Portfolio");
const Pricing = require("../models/Pricing");
const Category = require("../models/Category");
const Testimonial = require("../models/Testimonial");
const Setting = require("../models/Setting");
const SiteContent = require("../models/SiteContent");
const { categories, content, settings, testimonials, pricingPlans, portfolio } = require("./defaultData");

const legacySeedValues = {
  phone: "+91 70968 63912",
  email: "chaudhariclicks@gmail.com",
  instagram: "https://instagram.com/Chaudhari_clicks",
  facebook: "https://www.facebook.com/share/16gX9sk6hT/?mibextid=wwXIfr",
  twitter: "https://twitter.com/Chaudhariclicks",
  whatsapp: "+917096863912",
  instagramHandle: "@ChaudhariClicks"
};

function shouldUpdateValue(currentValue, legacyValue) {
  return !currentValue || currentValue === legacyValue;
}

async function seedDefaults() {
  const adminUsername = process.env.ADMIN_USERNAME || "Admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin";

  if (!(await User.findOne({ username: adminUsername }))) {
    await User.create({ username: adminUsername, password: adminPassword });
  }

  if ((await Category.countDocuments()) === 0) {
    await Category.insertMany(categories);
  }

  if (!(await SiteContent.findOne({ singletonKey: "main" }))) {
    await SiteContent.create(content);
  }

  if (!(await Setting.findOne({ singletonKey: "global" }))) {
    await Setting.create(settings);
  } else {
    const existingSettings = await Setting.findOne({ singletonKey: "global" });

    if (existingSettings) {
      if (shouldUpdateValue(existingSettings.phone, legacySeedValues.phone)) {
        existingSettings.phone = settings.phone;
      }
      if (shouldUpdateValue(existingSettings.email, legacySeedValues.email)) {
        existingSettings.email = settings.email;
      }
      if (shouldUpdateValue(existingSettings.instagramHandle, legacySeedValues.instagramHandle)) {
        existingSettings.instagramHandle = settings.instagramHandle;
      }
      if (shouldUpdateValue(existingSettings.socialLinks?.instagram, legacySeedValues.instagram)) {
        existingSettings.socialLinks.instagram = settings.socialLinks.instagram;
      }
      if (shouldUpdateValue(existingSettings.socialLinks?.facebook, legacySeedValues.facebook)) {
        existingSettings.socialLinks.facebook = settings.socialLinks.facebook;
      }
      if (shouldUpdateValue(existingSettings.socialLinks?.twitter, legacySeedValues.twitter)) {
        existingSettings.socialLinks.twitter = settings.socialLinks.twitter;
      }
      if (shouldUpdateValue(existingSettings.socialLinks?.whatsapp, legacySeedValues.whatsapp)) {
        existingSettings.socialLinks.whatsapp = settings.socialLinks.whatsapp;
      }

      await existingSettings.save();
    }
  }

  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(testimonials);
  }

  if ((await Pricing.countDocuments()) === 0) {
    const existingContent = await SiteContent.findOne({ singletonKey: "main" }).lean();
    const migratedPlans =
      existingContent?.pricing?.packages?.length
        ? existingContent.pricing.packages.map((plan, index) => ({
            title: plan.name || plan.title || `Plan ${index + 1}`,
            price: plan.price || "",
            features: Array.isArray(plan.features) ? plan.features : [],
            buttonLabel: plan.buttonLabel || "Choose Plan",
            featured: Boolean(plan.featured),
            order: index + 1
          }))
        : pricingPlans;

    await Pricing.insertMany(migratedPlans);
  }

  if ((await Portfolio.countDocuments()) === 0) {
    const storedCategories = await Category.find().lean();
    const categoryMap = storedCategories.reduce((acc, item) => {
      acc[item.name] = item._id;
      return acc;
    }, {});

    await Portfolio.insertMany(
      portfolio.map((item) => ({
        title: item.title,
        imageUrl: item.imageUrl,
        category: categoryMap[item.categoryName]
      }))
    );
  }

  await Promise.all([Lead.syncIndexes(), Booking.syncIndexes()]);
}

module.exports = seedDefaults;
