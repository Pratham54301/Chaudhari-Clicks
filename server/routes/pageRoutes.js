const path = require("path");
const express = require("express");
const { isAuthenticated, requireAuthPage } = require("../middleware/auth");

const router = express.Router();
const clientDir = path.join(__dirname, "..", "..", "client");

router.get("/", (_req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});

router.get("/admin", (req, res) => {
  if (isAuthenticated(req)) return res.redirect("/admin/dashboard");
  return res.sendFile(path.join(clientDir, "views", "admin-login.html"));
});

router.get("/admin/dashboard", requireAuthPage, (_req, res) => {
  res.sendFile(path.join(clientDir, "views", "admin-dashboard.html"));
});

module.exports = router;
