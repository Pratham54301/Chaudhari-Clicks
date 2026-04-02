function isAuthenticated(req) {
  return Boolean(req.session && req.session.user);
}

function requireAuth(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  return next();
}

function requireAuthPage(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.redirect("/admin");
  }

  return next();
}

module.exports = { isAuthenticated, requireAuth, requireAuthPage };
