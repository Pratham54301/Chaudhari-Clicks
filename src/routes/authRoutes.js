const express = require("express");

const AdminUser = require("../models/AdminUser");

const router = express.Router();

router.get("/session", (req, res) => {
  const adminUser = req.session.adminUser || null;

  res.json({
    authenticated: Boolean(adminUser),
    username: adminUser ? adminUser.username : null
  });
});

router.post("/login", async (req, res, next) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "").trim();

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const adminUser = await AdminUser.findOne({ username });

    if (!adminUser || adminUser.password !== password) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    req.session.adminUser = {
      id: adminUser._id.toString(),
      username: adminUser.username
    };

    return res.json({ message: "Login successful." });
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("Chaudhari-clicks-admin");
    return res.json({ message: "Logout successful." });
  });
});

module.exports = router;
