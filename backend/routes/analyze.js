const express = require("express");
const multer = require("multer");
const {
  analyzeImage,
  fetchAnalysisHistory,
  deleteAnalysisResult,
} = require("../controllers/analyzeController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // ✅ Save uploaded files in the "uploads" directory

// Define routes
router.post("/", upload.single("image"), analyzeImage); // ✅ Upload an image
router.get("/", fetchAnalysisHistory); // ✅ Fetch analysis history
router.delete("/:id", deleteAnalysisResult); // ✅ Delete an entry

module.exports = router;
