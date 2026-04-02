const User = require("../models/User");

async function login(req, res) {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "").trim();

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  req.session.user = { id: user._id.toString(), username: user.username };
  return res.json({ message: "Login successful.", user: req.session.user });
}

function session(req, res) {
  res.json({
    authenticated: Boolean(req.session.user),
    user: req.session.user || null
  });
}

function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("chaudhri-clicks-admin");
    return res.json({ message: "Logout successful." });
  });
}

module.exports = { login, session, logout };
