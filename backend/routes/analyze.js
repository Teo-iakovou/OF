const express = require("express");
const multer = require("multer");
const {
  analyzeImage,
  fetchAnalysisHistory,
  getAnalysisById,
  deleteAnalysisResult,
updateAnalysisResult
} = require("../controllers/analyzeController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload an image (supports ?captions=false)
router.post("/", upload.single("image"), analyzeImage);
router.patch("/:id", updateAnalysisResult); 


// Paginated history
router.get("/", fetchAnalysisHistory);

// NEW: fetch a single result (for polling or detail)
router.get("/:id", getAnalysisById);

// Delete an entry
router.delete("/:id", deleteAnalysisResult);

module.exports = router;