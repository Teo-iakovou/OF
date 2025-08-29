// utils/buildPromotionBlueprint.js
const { getPolicies } = require("../policies/loader");
const { bestTimesV1 } = require("./bestTimes");

// ---- Likelihood scoring (Vision) ----
const scoreOf = (likelihood) =>
  ({ VERY_UNLIKELY:0, UNLIKELY:1, POSSIBLE:2, LIKELY:3, VERY_LIKELY:4 }[likelihood] ?? 0);

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

// ---- Hashtags helpers ----
const clampHashtags = (platform, list) => {
  const limit = platform==="Instagram" ? 10 : platform==="TikTok" ? 5 : 8;
  const uniq = Array.from(new Set(list.filter(Boolean).map(s=>s.trim())));
  return uniq.slice(0, limit);
};

function buildPromotionBlueprint(visionData={}, ctx={}) {
  const { platforms, niches, version: policiesVersion } = getPolicies();

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
  const goal = ctx.goal || "subs";
  const linkBase = ctx.linkBase || "https://linktr.ee/model";
  const engineVersion = "promo-blueprint-v1";

  // Derived features
  const csl = cslFromSafeSearch(safeSearch);
  const niche = pickNiche(labels, webEntities);
  const cmood = colorMood(dominantColors);

  // Seeds from niches.json + small emotion/color tweaks
  function seedsFor(nicheName, emotionName, moodObj){
    const emoSeed = {
      Joy:["#happy","#goodvibes"], Sorrow:["#moody","#aesthetic"],
      Anger:["#bold","#power"], Surprise:["#unexpected","#reaction"],
      Neutral:["#daily","#creator"]
    }[emotionName] || ["#creator"];
    const nicheSeeds = niches[nicheName]?.seeds || niches.general.seeds;
    const colorSeeds = moodObj.warmth==="warm" ? ["#goldenhour","#warmtones"]
                     : moodObj.brightness==="dark" ? ["#nightvibes","#lowlight"]
                     : ["#cleanlook"];
    return [...nicheSeeds, ...emoSeed, ...colorSeeds];
  }

  const reasons = [];
  if (safeSearch?.adult) reasons.push(`adult:${safeSearch.adult}`);
  if (safeSearch?.racy)  reasons.push(`racy:${safeSearch.racy}`);
  if (hasFace) reasons.push("hasFace:true");
  reasons.push(`niche:${niche}`);

  const recs = [];
  const withUtm = (platform) =>
    `${linkBase}?utm_source=${encodeURIComponent(platform.toLowerCase())}&utm_medium=post&utm_campaign=${encodeURIComponent(niche || "general")}_${goal}`;

  function addPlatform(p, { preview, caption, hashtags, notes, extra={} }) {
    const final = {
      platform: p,
      preview,
      caption,
      hashtags,
      link: extra.link || { url: withUtm(p), placement: p==="Instagram" ? "bio" : "caption" },
      bestTimesLocal: bestTimesV1(p, timezone, new Date()).map(([s,e]) => `${s}-${e}`),
      notes: notes || []
    };
    if (p==="Reddit") {
      final.subreddits = extra.subreddits || [];
      final.link.placement = "body_or_comment";
    }
    if (p==="TikTok") {
      final.link.placement = "bio";
    }
    recs.push(final);
  }

  // Platform decision (kept from your v1 logic)
  if (csl >= 2) {
    addPlatform("Twitter", {
      preview: { type:"uncensored", crop:"4:5", watermark:true },
      caption: "",
      hashtags: clampHashtags("Twitter", seedsFor(niche, emotion, cmood)),
      notes: ["Thread 2–3 angles", "Pin promo tweet 24h"]
    });
    addPlatform("Reddit", {
      preview: { type:"uncensored_or_censored_by_sub_rules" },
      caption: "",
      hashtags: [],
      notes: ["Follow each sub’s rules"],
      extra: { subreddits: [] }
    });
    addPlatform("Instagram", {
      preview: { type:"SFW", crop:"1:1", censor:"emoji_or_crop", watermark:true },
      caption: "",
      hashtags: clampHashtags("Instagram", [...seedsFor(niche, emotion, cmood), "#linkinbio"]),
      notes: ["No OF in caption; push bio"]
    });
    addPlatform("TikTok", {
      preview: { type:"SFW", crop:"9:16", censor:"stickers_if_needed" },
      caption: "",
      hashtags: clampHashtags("TikTok", seedsFor(niche, emotion, cmood)),
      notes: ["Avoid direct OF mention; focus on hook"]
    });
  } else {
    if (["cosplay","glamour","bikini","fitness"].includes(niche)) {
      addPlatform("Instagram", {
        preview: { type:"SFW", crop:"4:5", watermark:true },
        caption: "",
        hashtags: clampHashtags("Instagram", [...seedsFor(niche, emotion, cmood), "#linkinbio"]),
        notes: ["Lead with a 1-line hook"]
      });
      addPlatform("TikTok", {
        preview: { type:"SFW", crop:"9:16" },
        caption: "",
        hashtags: clampHashtags("TikTok", seedsFor(niche, emotion, cmood)),
        notes: ["Add motion/transitions if possible"]
      });
      addPlatform("Twitter", {
        preview: { type:"uncensored_or_spicier_alt", crop:"4:5", watermark:true },
        caption: "",
        hashtags: clampHashtags("Twitter", seedsFor(niche, emotion, cmood)),
        notes: []
      });
    } else {
      addPlatform("Instagram", {
        preview: { type:"SFW", crop:"1:1" },
        caption: "",
        hashtags: clampHashtags("Instagram", seedsFor(niche, emotion, cmood)),
        notes: []
      });
      addPlatform("Twitter", {
        preview: { type:"SFW_or_spicy_alt", crop:"4:5", watermark:true },
        caption: "",
        hashtags: clampHashtags("Twitter", seedsFor(niche, emotion, cmood)),
        notes: []
      });
      addPlatform("Reddit", {
        preview: { type:"SFW", crop:"4:5" },
        caption: "",
        hashtags: [],
        notes: []
      });
    }
  }

  const ctaVariants =
    goal === "ppv"
      ? ["Tonight’s PPV is live 🎬 DM “PPV”", "Unlock the full drop—limited access", "Exclusive clip up now"]
      : goal === "customs"
      ? ["DM “CUSTOM” for a personalized video", "Taking custom requests today", "Your idea → my video 🎯"]
      : ["Full set just dropped 🔥 Link in bio", "New post live—don’t miss it", "First 20 get a discount—DM “START”"];

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
    vision: { safeSearch, labels, objects, webEntities, dominantColors, hasFace },
    colorMood: cmood,
    goal,
    timezone,
    policiesVersion,
    engineVersion
  };

  return { promotion, meta };
}

module.exports = { buildPromotionBlueprint };