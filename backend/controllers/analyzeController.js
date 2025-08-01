const path = require("path");
const fs = require("fs");
const Result = require("../models/result");
const User = require("../models/user");

const {
  analyzeImageWithGoogleVision,
} = require("../utils/analyzeImageWithGoogleVision");
const { dynamicContextEngine } = require("../utils/dynamicContextEngine");
const {
  generateCaptionWithOpenAI,
} = require("../utils/generateCaptionWithOpenAI");

const analyzeImage = async (req, res) => {
  const { file } = req;
  const email = req.body?.email;

  if (!file || !email) {
    return res.status(400).json({ error: "Image and email are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({ error: "User not found." });
    }

    if (!user.isAdmin && user.uploadsUsed >= user.uploadLimit) {
      return res.status(403).json({ error: "Upload limit reached." });
    }

    const filePath = path.resolve(__dirname, "../", file.path);

    // 🧠 Step 1: Analyze image with Vision API
    const visionData = await analyzeImageWithGoogleVision(filePath);

    if (!visionData) {
      fs.unlinkSync(filePath);
      return res.status(500).json({ error: "Failed to analyze image" });
    }

    // ⚙️ Step 2: Generate dynamic platform/tip/hashtags
    const dynamicData = dynamicContextEngine(visionData);

    // ✍️ Step 3: Generate AI caption
    const aiCaption = await generateCaptionWithOpenAI(visionData, dynamicData);

    // 🗃️ Step 4: Save the result
    const newResult = new Result({
      platform: dynamicData.platform,
      bestPostTime: dynamicData.bestPostTime,
      hashtags: dynamicData.hashtags,
      tip: dynamicData.tip,
      aiCaption,
      objects: visionData.objects,
      emotion: visionData.emotion,
      ageRange: visionData.ageRange,
      dominantColors: visionData.dominantColors,
    });

    await newResult.save();
    fs.unlinkSync(filePath);

    if (!user.isAdmin) {
      user.uploadsUsed += 1;
      await user.save();
    }

    // ✅ Step 5: Return full result
    return res.json({
      message: "Image analyzed successfully!",
      insights: {
        ...newResult._doc,
      },
    });
  } catch (error) {
    console.error("❌ Error analyzing image:", error);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
};

// Other endpoints remain unchanged
const fetchAnalysisHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const results = await Result.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Result.countDocuments();

    res.json({ results, total });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

const deleteAnalysisResult = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Result.findByIdAndDelete(id);

    if (!result) return res.status(404).json({ error: "Result not found" });

    res.json({ message: "Result deleted successfully", result });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ error: "Failed to delete result" });
  }
};

module.exports = { analyzeImage, fetchAnalysisHistory, deleteAnalysisResult };
