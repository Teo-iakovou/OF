const express = require("express");
const { debugWhoami, repairFaceId, rekognitionTest } = require("../controllers/debugController");

const router = express.Router();

router.get("/whoami", debugWhoami);
router.get("/rekognition-test", rekognitionTest);
router.post("/repair-faceid", repairFaceId);

module.exports = router;
