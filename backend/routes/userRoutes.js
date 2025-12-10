/* eslint-disable @typescript-eslint/no-require-imports */
// routes/userRoutes.js
const express = require("express");
const {
  purchasePackage,
  checkUserPackage,
  getUserDashboard,
  consumeSadtalkerCredit,
} = require("../controllers/userController");

const router = express.Router();

router.post("/purchase", purchasePackage);
router.get("/check-package", checkUserPackage);
router.get("/dashboard", getUserDashboard);
router.post("/sadtalker/consume", consumeSadtalkerCredit);
module.exports = router;
