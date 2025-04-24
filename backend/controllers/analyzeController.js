const path = require("path");
const fs = require("fs");
const axios = require("axios");
const Result = require("../models/result");
const Recommendation = require("../models/recommendation");
const User = require("../models/user");

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

const analyzeImageWithGoogleVision = async (filePath) => {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "FACE_DETECTION" }, { type: "LABEL_DETECTION" }],
          },
        ],
      }
    );

    const faceData = response.data.responses[0]?.faceAnnotations?.[0];
    const labels =
      response.data.responses[0]?.labelAnnotations?.map(
        (obj) => obj.description
      ) || [];

    return {
      emotion:
        Object.keys(faceData || {})
          .filter(
            (key) =>
              key.includes("Likelihood") && faceData[key] !== "VERY_UNLIKELY"
          )
          .map((e) => e.replace("Likelihood", ""))[0] || "Neutral",
      headwear: faceData?.headwearLikelihood !== "VERY_UNLIKELY",
      ageRange:
        faceData?.detectionConfidence > 0.7
          ? faceData?.landmarkingConfidence > 0.5
            ? "Adult (25-40)"
            : "Young Adult (18-24)"
          : "Mature (40+)",
      objects: labels,
      bodyType: labels.includes("Athlete")
        ? "athletic"
        : labels.includes("Model")
        ? "slim"
        : labels.includes("Plus-size")
        ? "curvy"
        : labels.includes("Muscle")
        ? "muscular"
        : "slim",
      gender: labels.includes("Man")
        ? "man"
        : labels.includes("Woman")
        ? "woman"
        : "non-binary",
      skinTone: labels.includes("Dark")
        ? "dark"
        : labels.includes("Fair")
        ? "light"
        : "medium",
    };
  } catch (error) {
    console.error("Google Vision API Error:", error.message);
    return null;
  }
};

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

    console.log("Processing file:", file.originalname);

    const filePath = path.resolve(__dirname, "../", file.path);
    const visionData = await analyzeImageWithGoogleVision(filePath);

    if (!visionData)
      return res.status(500).json({ error: "Failed to analyze image" });

    console.log("Analyzed Image Data:", visionData);

    const query = {
      emotion: visionData.emotion || "neutral",
      bodyType: { $in: [visionData.bodyType, "any"] },
      skinTone: { $in: [visionData.skinTone, "any"] },
      gender: { $in: [visionData.gender, "any"] },
    };

    console.log("🔍 Fetching recommendation with smart fallback query:", query);
    let recommendation = await Recommendation.findOne(query);

    if (!recommendation) {
      console.log("⚠️ No match found in DB. Using default.");
      recommendation = {
        bestPose: "Be yourself and shine!",
        lightingTips: "Natural light is always flattering.",
        captionIdeas: ["Your uniqueness is your superpower."],
        hashtagSuggestions: ["#selflove", "#beyou", "#authentic"],
        platforms: [{ name: "Instagram", bestPostTime: "6:00 PM" }],
      };
    }

    const finalRecommendations = [
      `Best Pose: ${recommendation.bestPose}`,
      `Lighting Tip: ${recommendation.lightingTips}`,
      ...(recommendation.captionIdeas || []),
    ];

    const platformRecommendations = recommendation.platforms || [
      { name: "Unknown", bestPostTime: "Unknown" },
    ];

    const rawHashtags = [
      `#${visionData.emotion || "neutral"}mood`,
      `#${visionData.objects?.[0] || "undefined"}`,
      ...(recommendation?.hashtagSuggestions || []),
    ];

    const hashtags = [...new Set(rawHashtags)];

    console.log("Generated Hashtags:", hashtags);

    const newResult = new Result({
      platform: platformRecommendations.map((p) => p.name).join(", "),
      bestPostTime: platformRecommendations
        .map((p) => p.bestPostTime)
        .join(", "),
      hashtags,
      objects: visionData.objects,
      recommendations: finalRecommendations,
      emotion: visionData.emotion || "Neutral",
      ageRange: visionData.ageRange || "Unknown",
    });

    await newResult.save();
    fs.unlinkSync(filePath);

    if (!user.isAdmin) {
      user.uploadsUsed += 1;
      await user.save();
    }

    return res.json({
      message: "Image analyzed successfully!",
      insights: {
        ...newResult._doc,
        platforms: platformRecommendations,
      },
    });
  } catch (error) {
    console.error("❌ Error analyzing image:", error);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
};

module.exports = { analyzeImage };
// Fetch analysis history
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

// Delete analysis result
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
