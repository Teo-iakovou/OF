// utils/dynamicContextEngine.js

// --- helpers ---
const scoreOf = (likelihood) =>
  ({ VERY_UNLIKELY:0, UNLIKELY:1, POSSIBLE:2, LIKELY:3, VERY_LIKELY:4 }[likelihood] ?? 0);

const cslFromSafeSearch = (safeSearch = {}) => {
  const a = scoreOf(safeSearch.adult);
  const r = scoreOf(safeSearch.racy);
  const max = Math.max(a, r);
  return max >= 4 ? 3 : max === 3 ? 2 : max === 2 ? 1 : 0; // 0..3
};

const rgbToHsl = (r,g,b) => {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if(max!==min){
    const d=max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d + (g<b?6:0); break;
      case g: h=(b-r)/d + 2; break;
      case b: h=(r-g)/d + 4; break;
    }
    h*=60;
  }
  return {h,s,l};
};

const colorMood = (dominantColors=[]) => {
  if (!dominantColors.length) return { mood:"neutral", brightness:"mid", warmth:"neutral" };
  let wSum=0, H=0, S=0, L=0;
  for (const c of dominantColors) {
    const w = c.pixelFraction || c.score || 1;
    const {h,s,l} = rgbToHsl(c.r||0,c.g||0,c.b||0);
    H += h*w; S += s*w; L += l*w; wSum += w;
  }
  if (wSum === 0) return { mood:"neutral", brightness:"mid", warmth:"neutral" };
  H/=wSum; S/=wSum; L/=wSum;
  const brightness = L>0.7? "bright" : L<0.3? "dark" : "mid";
  const warmth = (H<60 || H>300) ? "warm" : (H>180 && H<300) ? "cool" : "neutral";
  const mood = S>0.5 ? "vivid" : "muted";
  return { mood, brightness, warmth };
};

const pickNiche = (labels=[], webEntities=[]) => {
  const bag = new Set([
    ...labels.map(l => (l.description||"").toLowerCase()),
    ...webEntities.map(w => (w.description||"").toLowerCase()),
  ]);
  const contains = (...keys) => keys.some(k => bag.has(k));

  if (contains("cosplay","anime","costume","character")) return "cosplay";
  if (contains("fitness","bodybuilding","gym","workout","athlete")) return "fitness";
  if (contains("lingerie","glamour","fashion","model")) return "glamour";
  if (contains("bikini","swimwear","beach")) return "bikini";
  if (contains("tattoo","piercing","goth","punk","alternative")) return "alt";
  if (contains("food","cuisine","dish")) return "food";
  if (contains("city","urban area","skyline","night")) return "city";
  if (contains("landscape","nature","outdoor")) return "travel";
  return "general";
};

const clampHashtags = (platform, list) => {
  const limit = platform==="Instagram" ? 10 : platform==="TikTok" ? 5 : 8;
  const uniq = Array.from(new Set(list.filter(Boolean).map(s => s.trim()))); 
  return uniq.slice(0, limit);
};

// --- main engine (backward-compatible shape) ---
const dynamicContextEngine = (visionData = {}, ctx = {}) => {
  const {
    hasFace = false,
    emotion = "Neutral",
    dominantColors = [],
    objects = [],          // [{name, score}]
    labels = [],           // [{description, score}]
    webEntities = [],      // [{description, score}]
    safeSearch = {},       // {adult, racy, ...}
  } = visionData;

  const timezone = ctx.timezone || "UTC";
  const goal = ctx.goal || "subs";

  // Core features
  const csl = cslFromSafeSearch(safeSearch);             // 0..3
  const niche = pickNiche(labels, webEntities);
  const mood = colorMood(dominantColors);

  // Platform/time decision (simple, safe and niche-aware)
  let platform = "Instagram";
  let bestPostTime = "18:00";
  let tip = "Keep it authentic and add a clear CTA.";

  // Safety gating
  if (csl >= 2) { // suggestive/explicit → avoid IG/TikTok for uncensored
    platform = "Twitter"; // X
    bestPostTime = "19:00";
    tip = "Use watermark. Include trackable link in caption. Consider a thread with 2–3 angles.";
  } else {
    // SFW or mild suggestive
    if (niche === "cosplay" || niche === "fashion" || niche === "glamour") {
      platform = hasFace ? "Instagram" : "Pinterest";
      bestPostTime = hasFace ? "17:00" : "10:00";
      tip = hasFace
        ? "Lead with a one-line hook and keep the face well-lit."
        : "Use a vertical crop (2:3) and keyword-rich alt text.";
    } else if (niche === "fitness") {
      platform = hasFace ? "TikTok" : "Instagram";
      bestPostTime = "20:00";
      tip = "Add motion or before/after to increase retention.";
    } else if (niche === "bikini" || niche === "alt") {
      platform = csl === 1 ? "Instagram" : "Twitter";
      bestPostTime = csl === 1 ? "18:00" : "21:00";
      tip = csl === 1
        ? "Tease, don’t reveal. Keep it SFW and push link in bio."
        : "Go bold, but watermark and pin your promo tweet.";
    } else {
      platform = hasFace ? "Instagram" : "Twitter";
      bestPostTime = hasFace ? "18:00" : "19:00";
      tip = hasFace ? "Use natural light and a strong first line." : "Use a clear headline and short CTA.";
    }
  }

  // Hashtag seeds
  const seeds = [];
  // Emotion tweak (soft)
  const emoSeed = {
    Joy:["#happy","#goodvibes"],
    Sorrow:["#moody","#aesthetic"],
    Anger:["#bold","#power"],
    Surprise:["#unexpected","#reaction"],
    Neutral:["#daily","#creator"]
  }[emotion] || ["#creator"];

  // Niche seeds
  const nicheSeeds = {
    cosplay:["#cosplay","#anime"],
    fitness:["#fitness","#gym"],
    glamour:["#glamour","#fashion"],
    bikini:["#bikini","#swimwear"],
    alt:["#tattoo","#alt"],
    city:["#city","#nightphotography"],
    travel:["#travel","#wanderlust"],
    food:["#foodie","#food"],
    general:["#creator","#content"]
  }[niche] || ["#creator"];

  // Object/entity tweaks
  const objectNames = objects.filter(o => o.score > 0.6).map(o => o.name.toLowerCase());
  if (objectNames.includes("beach")) seeds.push("#beachlife","#oceanvibes");
  if (objectNames.includes("tattoo")) seeds.push("#tattoo","#inked");

  // Color mood tweaks
  const colorSeeds = mood.warmth==="warm" ? ["#goldenhour","#warmtones"]
                   : mood.brightness==="dark" ? ["#nightvibes","#lowlight"]
                   : ["#cleanlook"];

  let hashtags = clampHashtags(platform, [...nicheSeeds, ...emoSeed, ...colorSeeds, ...seeds]);

  // Return the old shape (for backward compatibility) + some optional debug
  return {
    platform,
    bestPostTime,   // HH:mm local (advisory; you can later localize by ctx.timezone)
    tip,
    hashtags,
    debug: {
      csl,
      niche,
      hasFace,
      mood,
      timezone,
      goal
    }
  };
};

module.exports = { dynamicContextEngine };