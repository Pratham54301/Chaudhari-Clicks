const Testimonial = require("../models/Testimonial");

async function getTestimonials(req, res) {
  const filter = req.query.approved === "true" ? { approved: true } : {};
  res.json(await Testimonial.find(filter).sort({ createdAt: -1 }));
}

async function createTestimonial(req, res) {
  const testimonial = await Testimonial.create({
    name: String(req.body.name || req.body.author || "").trim(),
    role: String(req.body.role || "").trim(),
    message: String(req.body.message || req.body.quote || "").trim(),
    approved: req.body.approved === undefined ? true : Boolean(req.body.approved)
  });
  return res.status(201).json(testimonial);
}

async function updateTestimonial(req, res) {
  const update = {};
  if (req.body.name !== undefined || req.body.author !== undefined) {
    update.name = String(req.body.name || req.body.author || "").trim();
  }
  if (req.body.role !== undefined) {
    update.role = String(req.body.role || "").trim();
  }
  if (req.body.message !== undefined || req.body.quote !== undefined) {
    update.message = String(req.body.message || req.body.quote || "").trim();
  }
  if (req.body.approved !== undefined) update.approved = Boolean(req.body.approved);

  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!testimonial) return res.status(404).json({ message: "Testimonial not found." });
  return res.json(testimonial);
}

async function deleteTestimonial(req, res) {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return res.status(404).json({ message: "Testimonial not found." });
  return res.json({ message: "Testimonial deleted successfully." });
}

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
