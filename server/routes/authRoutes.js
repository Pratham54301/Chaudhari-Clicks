const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { login, session, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/login", asyncHandler(login));
router.post("/auth/login", asyncHandler(login));
router.get("/auth/session", asyncHandler(session));
router.post("/auth/logout", logout);

module.exports = router;
