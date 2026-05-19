/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { redeemPromoCode } = require("../controllers/promoController");
const { promoRedeemLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/redeem", promoRedeemLimiter, redeemPromoCode);

module.exports = router;
