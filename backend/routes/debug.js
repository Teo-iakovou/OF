const express = require("express");
const { debugWhoami, repairFaceId, rekognitionTest } = require("../controllers/debugController");
const { requireAuth } = require("../middleware/requireAuth");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

// All debug routes require an authenticated admin session.
// The entire router is only mounted in non-production (see index.js).
router.use(requireAuth, requireAdmin);

router.get("/whoami", debugWhoami);
router.get("/rekognition-test", rekognitionTest);
router.post("/repair-faceid", repairFaceId);

module.exports = router;
