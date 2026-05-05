const express = require("express");
const multer = require("multer");
const {
  analyzeImage,
  fetchAnalysisHistory,
  getAnalysisById,
  deleteAnalysisResult,
updateAnalysisResult
} = require("../controllers/analyzeController");
const { guardActiveInstanceAndFace } = require("../middleware/guardActiveInstanceAndFace");
const { uploadLimiter } = require("../middleware/rateLimiters");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.use(guardActiveInstanceAndFace({ requireFaceEnrolled: true }));

// Upload an image (supports ?captions=false)
router.post("/", uploadLimiter, upload.single("image"), analyzeImage);
router.patch("/:id", updateAnalysisResult); 


// Paginated history
router.get("/", fetchAnalysisHistory);

// NEW: fetch a single result (for polling or detail)
router.get("/:id", getAnalysisById);

// Delete an entry
router.delete("/:id", deleteAnalysisResult);

module.exports = router;
