const Booking = require("../models/Booking");

async function createBooking(req, res) {
  const booking = await Booking.create({
    name: String(req.body.name || "").trim(),
    phone: String(req.body.phone || "").trim(),
    eventType: String(req.body.eventType || "").trim(),
    date: String(req.body.date || "").trim(),
    status: String(req.body.status || "Pending").trim()
  });

  return res.status(201).json(booking);
}

async function getBookings(req, res) {
  res.json(await Booking.find().sort({ createdAt: -1 }));
}

async function updateBooking(req, res) {
  const update = {};
  ["name", "phone", "eventType", "date", "status"].forEach((key) => {
    if (req.body[key] !== undefined) update[key] = String(req.body[key] || "").trim();
  });

  const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!booking) return res.status(404).json({ message: "Booking not found." });
  return res.json(booking);
}

module.exports = { createBooking, getBookings, updateBooking };
