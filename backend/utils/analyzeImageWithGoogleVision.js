// utils/analyzeImageWithGoogleVision.js

const fs = require("fs");
const axios = require("axios");

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
            features: [
              { type: "FACE_DETECTION" },
              { type: "LABEL_DETECTION" },
              { type: "IMAGE_PROPERTIES" },
              { type: "WEB_DETECTION" },
            ],
          },
        ],
      }
    );

    const data = response.data.responses[0];

    const faceData = data?.faceAnnotations?.[0];
    const labels = data?.labelAnnotations?.map((obj) => obj.description) || [];
    const dominantColors =
      data?.imagePropertiesAnnotation?.dominantColors?.colors
        ?.map((colorInfo) => colorInfo.color)
        .map(
          (c) =>
            `rgb(${Math.round(c.red || 0)}, ${Math.round(
              c.green || 0
            )}, ${Math.round(c.blue || 0)})`
        ) || [];
    const webEntities =
      data?.webDetection?.webEntities?.map((entity) => entity.description) ||
      [];

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
      dominantColors,
      webEntities,
    };
  } catch (error) {
    console.error("Google Vision API Error:", error.message);
    return null;
  }
};

module.exports = { analyzeImageWithGoogleVision };
