const path = require("path");
const fs = require("fs");
const Result = require("../models/result");
const axios = require("axios");

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

const analyzeImage = async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    console.log("Received file:", file);

    // ✅ Normalize file path
    const filePath = path.resolve(__dirname, "../", file.path);
    console.log("Normalized file path:", filePath);

    // ✅ Read image file as a binary buffer
    const imageBuffer = fs.readFileSync(filePath);

    console.log("Sending request to Hugging Face API...");

    // ✅ Send image as raw binary data
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      imageBuffer, // Send buffer instead of FormData
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": file.mimetype, // Ensure correct MIME type
        },
      }
    );

    console.log("Hugging Face API response:", response.data);

    const predictions = response.data;
    const objects = predictions.map((p) => p.label);

    const recommendations = [
      "Post vibrant, engaging visuals.",
      `Highlight ${objects[0]} in captions.`,
      "Use hashtags relevant to the detected objects.",
    ];

    const newResult = new Result({
      dominantColor: "#3498db",
      platform: "Instagram",
      hashtags: objects.map((obj) => `#${obj}`),
      bestPostTime: "6:00 PM",
      objects,
      recommendations,
    });

    await newResult.save();
    fs.unlinkSync(filePath);

    return res.json({
      message: "Image analyzed and saved successfully!",
      insights: newResult,
    });
  } catch (error) {
    console.error(
      "Error analyzing image:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to analyze image" });
  }
};

// Fetch Analysis History
const fetchAnalysisHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const results = await Result.find({})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Result.countDocuments();

    if (!results || results.length === 0) {
      console.warn("No analysis history found.");
      return res.status(200).json({ results: [], total: 0 });
    }

    res.json({ results, total });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

// Delete Analysis Result
const deleteAnalysisResult = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Attempting to delete result with ID:", id);

    const result = await Result.findById(id);

    if (!result) {
      console.error("Result not found in database:", id);
      return res.status(404).json({ error: "Result not found" });
    }

    await Result.findByIdAndDelete(id);
    console.log("Result deleted successfully:", id);

    res.json({ message: "Result deleted successfully", result });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ error: "Failed to delete result" });
  }
};

module.exports = {
  analyzeImage,
  fetchAnalysisHistory,
  deleteAnalysisResult,
};
