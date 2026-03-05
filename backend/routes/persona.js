const express = require("express");
const multer = require("multer");
const { enrollFace } = require("../controllers/personaController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/enroll-face", upload.single("image"), enrollFace);

module.exports = router;
