function isAdminAuthenticated(req) {
  return Boolean(req.session && req.session.adminUser);
}

function requireAdmin(req, res, next) {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  return next();
}

function requireAdminPage(req, res, next) {
  if (!isAdminAuthenticated(req)) {
    return res.redirect("/admin");
  }

  return next();
}

module.exports = {
  isAdminAuthenticated,
  requireAdmin,
  requireAdminPage
};
