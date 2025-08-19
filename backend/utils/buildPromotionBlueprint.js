// utils/buildPromotionBlueprint.js

// ---- Likelihood scoring (Vision) ----
const scoreOf = (likelihood) =>
  ({ VERY_UNLIKELY:0, UNLIKELY:1, POSSIBLE:2, LIKELY:3, VERY_LIKELY:4 }[likelihood] ?? 0);

// Compute Content Safety Level (0..3) from SafeSearch
function cslFromSafeSearch(safe = {}) {
  const a = scoreOf(safe.adult);
  const r = scoreOf(safe.racy);
  const max = Math.max(a, r);
  return max >= 4 ? 3 : max === 3 ? 2 : max === 2 ? 1 : 0;
}

// ---- Color mood helpers ----
function rgbToHsl(r,g,b){
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
}

function colorMood(dominantColors=[]) {
  if (!dominantColors.length) return { mood:"neutral", brightness:"mid", warmth:"neutral" };
  let wSum=0, H=0, S=0, L=0;
  for (const c of dominantColors) {
    const w = c.pixelFraction || c.score || 1;
    const {h,s,l}=rgbToHsl(c.r||0,c.g||0,c.b||0);
    H+=h*w; S+=s*w; L+=l*w; wSum+=w;
  }
  if (!wSum) return { mood:"neutral", brightness:"mid", warmth:"neutral" };
  H/=wSum; S/=wSum; L/=wSum;
  const brightness = L>0.7? "bright" : L<0.3? "dark" : "mid";
  const warmth = (H<60 || H>300) ? "warm" : (H>180 && H<300) ? "cool" : "neutral";
  const mood = S>0.5 ? "vivid" : "muted";
  return { mood, brightness, warmth };
}

// ---- Niche detection (simple rules for v1) ----
function pickNiche(labels=[], webEntities=[]) {
  const bag = new Set([
    ...labels.map(l => (l.description||"").toLowerCase()),
    ...webEntities.map(w => (w.description||"").toLowerCase()),
  ]);
  const has = (...k) => k.some(x => bag.has(x));

  if (has("cosplay","anime","costume","character")) return "cosplay";
  if (has("fitness","bodybuilding","gym","workout","athlete")) return "fitness";
  if (has("lingerie","glamour","fashion","model")) return "glamour";
  if (has("bikini","swimwear","beach")) return "bikini";
  if (has("tattoo","piercing","goth","punk","alternative")) return "alt";
  if (has("food","cuisine","dish")) return "food";
  if (has("city","urban area","skyline","night")) return "city";
  if (has("landscape","nature","outdoor","beach")) return "travel";
  return "general";
}

// ---- Policy matrix (v1 defaults; move to JSON later) ----
const PLATFORM_POLICIES = {
  Twitter: { allowsExplicit: true,  linkInCaption: true,  suggestedRatios:["4:5","16:9"] },
  Reddit:  { allowsExplicit: true,  linkInBodyOrComment: true, needsSubrules: true },
  Instagram:{allowsExplicit: false, linkInCaption: false, linkInBio: true, previewMustBeSFW: true, suggestedRatios:["1:1","4:5"]},
  TikTok:  { allowsExplicit: false, noOFLinks: true, videoPreferred: true },
  Telegram:{ allowsExplicit: true,  isFunnel: true }
};

// ---- Hashtags helpers ----
const clampHashtags = (platform, list) => {
  const limit = platform==="Instagram" ? 10 : platform==="TikTok" ? 5 : 8;
  const uniq = Array.from(new Set(list.filter(Boolean).map(s=>s.trim())));
  return uniq.slice(0, limit);
};

function seedsFor(niche, emotion, mood){
  const emoSeed = {
    Joy:["#happy","#goodvibes"], Sorrow:["#moody","#aesthetic"],
    Anger:["#bold","#power"], Surprise:["#unexpected","#reaction"],
    Neutral:["#daily","#creator"]
  }[emotion] || ["#creator"];

  const nicheSeeds = {
    cosplay:["#cosplay","#anime"], fitness:["#fitness","#gym"],
    glamour:["#glamour","#fashion"], bikini:["#bikini","#swimwear"],
    alt:["#tattoo","#alt"], city:["#city","#nightphotography"],
    travel:["#travel","#wanderlust"], food:["#foodie","#food"],
    general:["#creator","#content"]
  }[niche] || ["#creator"];

  const colorSeeds = mood.warmth==="warm" ? ["#goldenhour","#warmtones"]
                   : mood.brightness==="dark" ? ["#nightvibes","#lowlight"]
                   : ["#cleanlook"];

  return [...nicheSeeds, ...emoSeed, ...colorSeeds];
}

// ---- Core builder ----
function buildPromotionBlueprint(visionData={}, ctx={}) {
  const {
    hasFace=false,
    emotion="Neutral",
    labels=[],
    objects=[],
    webEntities=[],
    dominantColors=[],
    safeSearch={}
  } = visionData;

  const timezone = ctx.timezone || "Europe/Athens";
  const goal = ctx.goal || "subs"; // "subs" | "ppv" | "customs"
  const linkBase = ctx.linkBase || "https://linktr.ee/model"; // replace with your own
  const policiesVersion = "2025-08-12";
  const engineVersion = "promo-blueprint-v1";

  // Derived features
  const csl = cslFromSafeSearch(safeSearch);
  const niche = pickNiche(labels, webEntities);
  const cmood = colorMood(dominantColors);

  // Reasons (for transparency)
  const reasons = [];
  if (safeSearch?.adult) reasons.push(`adult:${safeSearch.adult}`);
  if (safeSearch?.racy)  reasons.push(`racy:${safeSearch.racy}`);
  if (hasFace) reasons.push("hasFace:true");
  reasons.push(`niche:${niche}`);

  // Platform selection (initial v1 rules)
  const recs = [];

  const withUtm = (platform) =>
    `${linkBase}?utm_source=${encodeURIComponent(platform.toLowerCase())}&utm_medium=post&utm_campaign=${encodeURIComponent(niche || "general")}_${goal}`;

  // Helper to push a platform rec
  function addPlatform(p, { preview, caption, hashtags, bestTimes, notes, extra={} }) {
    const final = {
      platform: p,
      preview,
      caption,
      hashtags,
      link: extra.link || { url: withUtm(p), placement: p==="Instagram" ? "bio" : "caption" },
      bestTimesLocal: bestTimes,
      notes: notes || []
    };
    if (p==="Reddit") {
      final.subreddits = extra.subreddits || []; // fill later with curated list
      final.link.placement = "body_or_comment";
    }
    if (p==="TikTok") {
      final.link.placement = "bio"; // no OF links in caption
    }
    recs.push(final);
  }

  // Decide platform mix by CSL + niche
  if (csl >= 2) {
    // Suggestive/Explicit: X + Reddit primary; IG/TikTok only with SFW previews
    addPlatform("Twitter", {
      preview: { type:"uncensored", crop:"4:5", watermark:true },
      caption: "", // fill later with generator
      hashtags: clampHashtags("Twitter", seedsFor(niche, emotion, cmood)),
      bestTimes: ["19:00","22:00"],
      notes: ["Thread 2–3 angles", "Pin promo tweet 24h"]
    });
    addPlatform("Reddit", {
      preview: { type:"uncensored_or_censored_by_sub_rules" },
      caption: "", // title handled separately in UI
      hashtags: [],
      bestTimes: ["18:00","23:00"],
      notes: ["Follow each sub’s rules"],
      extra: { subreddits: [] }
    });
    // SFW teasers for discovery platforms
    addPlatform("Instagram", {
      preview: { type:"SFW", crop:"1:1", censor:"emoji_or_crop", watermark:true },
      caption: "",
      hashtags: clampHashtags("Instagram", [...seedsFor(niche, emotion, cmood), "#linkinbio"]),
      bestTimes: ["17:00","20:00"],
      notes: ["No OF in caption; push bio"]
    });
    addPlatform("TikTok", {
      preview: { type:"SFW", crop:"9:16", censor:"stickers_if_needed" },
      caption: "",
      hashtags: clampHashtags("TikTok", seedsFor(niche, emotion, cmood)),
      bestTimes: ["19:00","21:00"],
      notes: ["Avoid direct OF mention; focus on hook"]
    });
  } else {
    // SFW or mild suggestive
    if (["cosplay","glamour","bikini","fitness"].includes(niche)) {
      addPlatform("Instagram", {
        preview: { type:"SFW", crop:"4:5", watermark:true },
        caption: "",
        hashtags: clampHashtags("Instagram", [...seedsFor(niche, emotion, cmood), "#linkinbio"]),
        bestTimes: ["17:00","20:00"],
        notes: ["Lead with a 1-line hook"]
      });
      addPlatform("TikTok", {
        preview: { type:"SFW", crop:"9:16" },
        caption: "",
        hashtags: clampHashtags("TikTok", seedsFor(niche, emotion, cmood)),
        bestTimes: ["19:00","21:00"],
        notes: ["Add motion/transitions if possible"]
      });
      addPlatform("Twitter", {
        preview: { type:"uncensored_or_spicier_alt", crop:"4:5", watermark:true },
        caption: "",
        hashtags: clampHashtags("Twitter", seedsFor(niche, emotion, cmood)),
        bestTimes: ["19:00","22:00"]
      });
    } else {
      // general/city/travel/food
      addPlatform("Instagram", {
        preview: { type:"SFW", crop:"1:1" },
        caption: "",
        hashtags: clampHashtags("Instagram", seedsFor(niche, emotion, cmood)),
        bestTimes: ["11:00","18:00"]
      });
      addPlatform("Twitter", {
        preview: { type:"SFW_or_spicy_alt", crop:"4:5", watermark:true },
        caption: "",
        hashtags: clampHashtags("Twitter", seedsFor(niche, emotion, cmood)),
        bestTimes: ["19:00","22:00"]
      });
      addPlatform("Reddit", {
        preview: { type:"SFW", crop:"4:5" },
        caption: "",
        hashtags: [],
        bestTimes: ["18:00","22:00"]
      });
    }
  }

  // CTA variants by goal
  const ctaVariants =
    goal === "ppv"
      ? ["Tonight’s PPV is live 🎬 DM “PPV”", "Unlock the full drop—limited access", "Exclusive clip up now"]
      : goal === "customs"
      ? ["DM “CUSTOM” for a personalized video", "Taking custom requests today", "Your idea → my video 🎯"]
      : ["Full set just dropped 🔥 Link in bio", "New post live—don’t miss it", "First 20 get a discount—DM “START”"];

  // Risk flags
  const riskFlags = [];
  if (csl >= 2) riskFlags.push("IG/TikTok: use SFW previews only");
  riskFlags.push("Avoid OF link in IG/TikTok captions");
  riskFlags.push("Watermark all previews");
  riskFlags.push("Strip EXIF before posting");

  const promotion = {
    contentSafety: { csl, reasons },
    niche,
    hasFace,
    recommendedPlatforms: recs,
    ctaVariants,
    riskFlags
  };

  const meta = {
    vision: {
      safeSearch,
      labels,
      objects,
      webEntities,
      dominantColors,
      hasFace
    },
    colorMood: cmood,
    goal,
    timezone,
    policiesVersion,
    engineVersion
  };

  return { promotion, meta };
}

module.exports = { buildPromotionBlueprint };