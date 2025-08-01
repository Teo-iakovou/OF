// utils/dynamicContextEngine.js

const dynamicContextEngine = (visionData) => {
  const {
    emotion,
    dominantColors = [],
    objects = [],
    webEntities = [],
  } = visionData;

  let platform = "Instagram";
  let bestPostTime = "6:00 PM";
  let tip = "Be yourself!";
  let hashtags = [];

  // Emotion based
  switch (emotion.toLowerCase()) {
    case "joy":
      platform = "Instagram";
      bestPostTime = "5:00 PM";
      tip = "Smile and natural light boosts engagement!";
      hashtags.push("#happyvibes", "#positiveenergy");
      break;
    case "sorrow":
      platform = "Tumblr";
      bestPostTime = "9:00 PM";
      tip = "Use soft lighting for emotional impact.";
      hashtags.push("#moodyaesthetic", "#deepthoughts");
      break;
    case "anger":
      platform = "TikTok";
      bestPostTime = "8:00 PM";
      tip = "Bold looks create powerful impressions!";
      hashtags.push("#boldlook", "#strongenergy");
      break;
    case "surprise":
      platform = "TikTok";
      bestPostTime = "7:00 PM";
      tip = "Candid shots and surprises perform better!";
      hashtags.push("#unexpected", "#funreaction");
      break;
    default:
      platform = "Pinterest";
      bestPostTime = "10:00 AM";
      tip = "Stay authentic and relatable.";
      hashtags.push("#naturalvibes", "#effortlesslook");
  }

  // Dominant colors
  if (dominantColors.some((c) => c.includes("255, 223, 0"))) {
    tip = "Golden hour vibes! Capture the light.";
    hashtags.push("#goldenhour", "#sunsetvibes");
  }
  if (dominantColors.some((c) => c.includes("0, 0, 0"))) {
    tip = "Night city shots love sparkle filters!";
    hashtags.push("#citylights", "#nightvibes");
  }

  // Object detection
  if (objects.includes("Tattoo")) {
    hashtags.push("#tattoolife", "#inkedup");
  }
  if (objects.includes("Beach")) {
    hashtags.push("#beachlife", "#oceanvibes");
  }

  // Web entities
  if (webEntities.some((e) => e?.toLowerCase()?.includes("fashion"))) {
    hashtags.push("#fashioninspo", "#stylegoals");
  }

  hashtags = [...new Set(hashtags)];

  return { platform, bestPostTime, tip, hashtags };
};

module.exports = { dynamicContextEngine };
