/* eslint-disable @typescript-eslint/no-require-imports */
// routes/userRoutes.js
const express = require("express");
const {
  purchasePackage,
  checkUserPackage,
  updateUserProfile,
  getUserDashboard,
  listActivePackageInstances,
  listUserResults,
  getUserResultImageUrl,
  selectPackageInstance,
  grantAddons,
  consumeSadtalkerCredit,
} = require("../controllers/userController");
const { verifyPersonaFace } = require("../middleware/verifyPersonaFace");
const { guardActiveInstanceAndFace } = require("../middleware/guardActiveInstanceAndFace");
const multer = require("multer");

const router = express.Router();
const upload = multer();

router.post("/purchase", purchasePackage);
router.get("/check-package", checkUserPackage);
router.patch("/profile", updateUserProfile);
router.get("/dashboard", getUserDashboard);
router.get("/package-instances", listActivePackageInstances);
router.get("/results", guardActiveInstanceAndFace({ requireFaceEnrolled: false }), listUserResults);
router.get(
  "/results/:id/image-url",
  guardActiveInstanceAndFace({ requireFaceEnrolled: false }),
  getUserResultImageUrl
);
router.post("/addons", grantAddons);
router.post("/select-package-instance", selectPackageInstance);
router.post(
  "/sadtalker/consume",
  guardActiveInstanceAndFace({ requireFaceEnrolled: true }),
  upload.single("image"),
  verifyPersonaFace,
  consumeSadtalkerCredit
);
module.exports = router;
