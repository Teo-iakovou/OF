// utils/generateCaptionWithOpenAI.js

const axios = require("axios");

const generateCaptionWithOpenAI = async (visionData, dynamicData) => {
  const prompt = `
You are a creative social media strategist.

User uploaded a photo with:
- Emotion: ${visionData.emotion}
- Detected objects: ${visionData.objects.join(", ") || "Unknown"}
- Dominant colors: ${visionData.dominantColors.join(", ") || "Unknown"}
- Web themes: ${visionData.webEntities.join(", ") || "Unknown"}
- Target platform: ${dynamicData.platform}

Suggest one short, catchy caption (max 20 words) reflecting the photo style and emotion.
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 100,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.trim();
};

module.exports = { generateCaptionWithOpenAI };
