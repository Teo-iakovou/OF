// routes/userRoutes.js
const express = require("express");
const {
  purchasePackage,
  checkUserPackage,
  getUserDashboard,
} = require("../controllers/userController");

const router = express.Router();

router.post("/purchase", purchasePackage);
router.get("/check-package", checkUserPackage);
router.get("/dashboard", getUserDashboard);
module.exports = router;
