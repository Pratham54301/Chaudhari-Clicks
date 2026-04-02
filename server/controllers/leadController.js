const Lead = require("../models/Lead");

async function createLead(req, res) {
  const payload = {
    name: String(req.body.name || "").trim(),
    phone: String(req.body.phone || "").trim(),
    eventType: String(req.body.eventType || "").trim(),
    date: String(req.body.date || req.body.eventDate || "").trim(),
    message: String(req.body.message || "").trim()
  };

  if (payload.name.length < 3) {
    return res.status(400).json({ message: "Please enter a valid name." });
  }

  if (payload.phone.replace(/\D/g, "").length < 10) {
    return res.status(400).json({ message: "Please enter a valid phone number." });
  }

  if (!payload.eventType || !payload.date) {
    return res.status(400).json({ message: "Event type and date are required." });
  }

  const lead = await Lead.create(payload);
  return res.status(201).json(lead);
}

async function getLeads(req, res) {
  res.json(await Lead.find().sort({ createdAt: -1 }));
}

async function updateLead(req, res) {
  const update = {};
  ["name", "phone", "eventType", "message"].forEach((key) => {
    if (req.body[key] !== undefined) update[key] = String(req.body[key] || "").trim();
  });
  if (req.body.date !== undefined || req.body.eventDate !== undefined) {
    update.date = String(req.body.date || req.body.eventDate || "").trim();
  }
  if (req.body.status !== undefined) {
    update.status = String(req.body.status || "").trim();
  }

  const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!lead) return res.status(404).json({ message: "Lead not found." });
  return res.json(lead);
}

async function deleteLead(req, res) {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found." });
  return res.json({ message: "Lead deleted successfully." });
}

module.exports = { createLead, getLeads, updateLead, deleteLead };
