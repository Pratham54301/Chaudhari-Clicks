function notFound(req, res) {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "Route not found." });
  }

  return res.status(404).send("Page not found.");
}

module.exports = notFound;
