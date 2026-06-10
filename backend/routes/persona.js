const express = require("express");
const multer = require("multer");
const { enrollFace } = require("../controllers/personaController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB hard cap
});

router.post("/enroll-face", upload.single("image"), enrollFace);

// Surface multer size rejections as a structured error
router.use((err, req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "IMAGE_TOO_LARGE",
      requestId: req.requestId || null,
    });
  }
  next(err);
});

module.exports = router;
