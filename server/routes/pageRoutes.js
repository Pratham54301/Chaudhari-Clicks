const path = require("path");
const express = require("express");
const { isAuthenticated, requireAuthPage } = require("../middleware/auth");

const router = express.Router();
const rootDir = path.join(__dirname, "..", "..");

router.get("/", (_req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

router.get("/admin", (req, res) => {
  if (isAuthenticated(req)) return res.redirect("/admin/dashboard");
  return res.sendFile(path.join(rootDir, "views", "admin-login.html"));
});

router.get("/admin/dashboard", requireAuthPage, (_req, res) => {
  res.sendFile(path.join(rootDir, "views", "admin-dashboard.html"));
});

module.exports = router;
