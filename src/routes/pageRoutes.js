const path = require("path");
const express = require("express");

const { requireAdminPage, isAdminAuthenticated } = require("../middleware/requireAdmin");

const router = express.Router();
const rootDir = path.join(__dirname, "..", "..");

router.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

router.get("/admin", (req, res) => {
  if (isAdminAuthenticated(req)) {
    return res.redirect("/admin/dashboard");
  }

  return res.sendFile(path.join(rootDir, "views", "admin-login.html"));
});

router.get("/admin/dashboard", requireAdminPage, (req, res) => {
  res.sendFile(path.join(rootDir, "views", "admin-dashboard.html"));
});

module.exports = router;
