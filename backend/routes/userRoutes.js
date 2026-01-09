/* eslint-disable @typescript-eslint/no-require-imports */
// routes/userRoutes.js
const express = require("express");
const {
  purchasePackage,
  checkUserPackage,
  getUserDashboard,
  listActivePackageInstances,
  selectPackageInstance,
  consumeSadtalkerCredit,
} = require("../controllers/userController");

const router = express.Router();

router.post("/purchase", purchasePackage);
router.get("/check-package", checkUserPackage);
router.get("/dashboard", getUserDashboard);
router.get("/package-instances", listActivePackageInstances);
router.post("/select-package-instance", selectPackageInstance);
router.post("/sadtalker/consume", consumeSadtalkerCredit);
module.exports = router;
