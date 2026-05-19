/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { createPromoCode, listPromoCodes } = require("../controllers/adminPromoController");

const router = express.Router();

router.post("/", createPromoCode);
router.get("/", listPromoCodes);

module.exports = router;
