const express = require("express");
const multer = require("multer");
const {
  analyzeImage,
  fetchAnalysisHistory,
  deleteAnalysisResult,
} = require("../controllers/analyzeController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), analyzeImage); // Ensure analyzeImage is imported correctly
router.get("/", fetchAnalysisHistory);
router.delete("/:id", deleteAnalysisResult);

module.exports = router;
