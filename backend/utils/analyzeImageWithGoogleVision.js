// backend/utils/analyzeImageWithGoogleVision.js
const fs = require("fs");
const axios = require("axios");

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

// Likelihood → numeric
const scoreOf = (likelihood) =>
  ({ VERY_UNLIKELY:0, UNLIKELY:1, POSSIBLE:2, LIKELY:3, VERY_LIKELY:4 }[likelihood] ?? 0);

// --- Internal: call Vision API with retry/timeout ---
async function callVisionWithBase64(base64Image, { requestId, attempts = 3, timeoutMs = 12000 } = {}) {
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`;
  const body = {
    requests: [
      {
        image: { content: base64Image },
        features: [
          { type: "FACE_DETECTION", maxResults: 3 },
          { type: "OBJECT_LOCALIZATION", maxResults: 20 },
          { type: "LABEL_DETECTION", maxResults: 20 },
          { type: "IMAGE_PROPERTIES" },
          { type: "WEB_DETECTION" },
          { type: "SAFE_SEARCH_DETECTION" },
        ],
      },
    ],
  };

  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const { data } = await axios.post(url, body, { timeout: timeoutMs });
      return data?.responses?.[0] || {};
    } catch (err) {
      lastErr = err;
      const wait = 300 * Math.pow(2, i - 1);
      console.error(JSON.stringify({
        requestId, stage: "vision_call", attempt: i, error: err?.response?.data || err?.message
      }));
      if (i < attempts) await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// --- Normalize Vision response ---
function parseVisionResponse(resp) {
  const face = resp.faceAnnotations?.[0];
  let emotion = "Neutral";
  if (face) {
    const c = [
      ["Joy", scoreOf(face.joyLikelihood)],
      ["Sorrow", scoreOf(face.sorrowLikelihood)],
      ["Anger", scoreOf(face.angerLikelihood)],
      ["Surprise", scoreOf(face.surpriseLikelihood)],
    ].sort((a,b)=>b[1]-a[1]);
    if (c[0][1] >= 3) emotion = c[0][0];
  }

  const labels = (resp.labelAnnotations || []).map(l => ({ description: l.description, score: l.score }));
  const objects = (resp.localizedObjectAnnotations || []).map(o => ({ name: o.name, score: o.score }));
  const webEntities = (resp.webDetection?.webEntities || [])
    .filter(e => !!e.description)
    .map(e => ({ description: e.description, score: e.score ?? 0 }));

  const dominantColors = (resp.imagePropertiesAnnotation?.dominantColors?.colors || []).map(ci => {
    const c = ci.color || {};
    return {
      r: Math.round(c.red || 0),
      g: Math.round(c.green || 0),
      b: Math.round(c.blue || 0),
      score: ci.score || 0,
      pixelFraction: ci.pixelFraction || 0,
    };
  });

  const ss = resp.safeSearchAnnotation || {};
  const safeSearch = { adult: ss.adult, racy: ss.racy, medical: ss.medical, violence: ss.violence, spoof: ss.spoof };

  return { hasFace: !!face, emotion, labels, objects, webEntities, dominantColors, safeSearch };
}

// --- Public: analyze from path (legacy) ---
async function analyzeImageWithGoogleVision(filePath, opts = {}) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");
    const resp = await callVisionWithBase64(base64Image, opts);
    return parseVisionResponse(resp);
  } catch (error) {
    console.error("Google Vision API Error (path):", error?.response?.data || error.message);
    return null;
  }
}

// --- Public: analyze from Buffer (preferred) ---
async function analyzeImageBufferWithGoogleVision(imageBuffer, opts = {}) {
  try {
    const base64Image = imageBuffer.toString("base64");
    const resp = await callVisionWithBase64(base64Image, opts);
    return parseVisionResponse(resp);
  } catch (error) {
    console.error("Google Vision API Error (buffer):", error?.response?.data || error.message);
    return null;
  }
}

module.exports = {
  analyzeImageWithGoogleVision,
  analyzeImageBufferWithGoogleVision,
};