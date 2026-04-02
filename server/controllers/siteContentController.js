const SiteContent = require("../models/SiteContent");

async function getSiteContent(req, res) {
  res.json(await SiteContent.findOne({ singletonKey: "main" }));
}

async function updateSiteContent(req, res) {
  const existingContent = await SiteContent.findOne({ singletonKey: "main" }).lean();
  const payload = {
    singletonKey: "main",
    hero: req.body.hero || existingContent?.hero || {},
    about: req.body.about || existingContent?.about || {},
    pricing: req.body.pricing || existingContent?.pricing || {},
    contact: req.body.contact || existingContent?.contact || {}
  };

  const content = await SiteContent.findOneAndUpdate({ singletonKey: "main" }, payload, {
    new: true,
    upsert: true,
    runValidators: true
  });

  return res.json(content);
}

module.exports = { getSiteContent, updateSiteContent };
