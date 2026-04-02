function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || "Unexpected server error.";

  if (req.path.startsWith("/api/")) {
    return res.status(status).json({ message });
  }

  return res.status(status).send(message);
}

module.exports = errorHandler;
