const express = require("express");
const router = express.Router();
const { signup, login, logout, me, googleSession } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
router.post("/google-session", googleSession);

module.exports = router;
