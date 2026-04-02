const Setting = require("../models/Setting");

async function getSettings(req, res) {
  res.json(await Setting.findOne({ singletonKey: "global" }));
}

async function updateSettings(req, res) {
  const existingSettings = await Setting.findOne({ singletonKey: "global" }).lean();
  const payload = {
    singletonKey: "global",
    phone: String(req.body.phone || req.body.contact?.phone || "").trim(),
    email: String(req.body.email || req.body.contact?.email || "").trim(),
    location: String(req.body.location || req.body.contact?.location || "").trim(),
    socialLinks: {
      instagram: String(req.body.socialLinks?.instagram || req.body.social?.instagram || "").trim(),
      facebook: String(req.body.socialLinks?.facebook || req.body.social?.facebook || "").trim(),
      twitter: String(
        req.body.socialLinks?.twitter ||
          req.body.social?.twitter ||
          existingSettings?.socialLinks?.twitter ||
          ""
      ).trim(),
      whatsapp: String(req.body.socialLinks?.whatsapp || req.body.contact?.whatsapp || "").trim()
    },
    brandDescription: String(req.body.brandDescription || req.body.brand?.description || "").trim(),
    instagramHandle: String(req.body.instagramHandle || req.body.brand?.instagramHandle || "").trim()
  };

  const settings = await Setting.findOneAndUpdate({ singletonKey: "global" }, payload, {
    new: true,
    upsert: true,
    runValidators: true
  });

  return res.json(settings);
}

module.exports = { getSettings, updateSettings };
