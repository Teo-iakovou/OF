const express = require("express");
const router = express.Router();
const { verifyAddonSession } = require("../controllers/checkoutController");

router.get("/addons/verify", verifyAddonSession);

module.exports = router;
