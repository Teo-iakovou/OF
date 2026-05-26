/**
 * Niche detection: substring/token matching with multi-signal scoring.
 *
 * Vision API labels and webEntities are tokenized (full phrase + individual words).
 * Each niche's keyword vocabulary is matched against the token bag.
 * Score = sum of matched keyword weights. Ties broken by priority.
 * Falls back to "general" when no niche scores above zero.
 */

const NICHE_KEYWORDS = {
  // ── Adult-adjacent core ──────────────────────────────────────────────────
  model: {
    priority: 100,
    keywords: {
      strong: ["model", "modelling", "modeling", "portrait", "headshot", "fashion model", "lookbook"],
      medium: ["pose", "studio", "photography", "elegant", "beauty shoot"],
    },
  },
  bikini: {
    priority: 95,
    keywords: {
      strong: ["bikini", "swimwear", "swimsuit", "swim", "poolside", "pool side"],
      medium: ["beach", "ocean", "tropical", "sand", "sunbathing", "sun bathing", "tan"],
    },
  },
  lingerie: {
    priority: 95,
    keywords: {
      strong: ["lingerie", "intimates", "underwear", "bra", "boudoir", "negligee", "garter"],
      medium: ["lace", "silk", "satin", "bedroom"],
    },
  },
  cosplay: {
    priority: 95,
    keywords: {
      strong: ["cosplay", "anime", "manga", "costume", "cosplayer", "wig", "convention"],
      medium: ["fantasy", "fictional character", "video game"],
    },
  },
  alt: {
    priority: 90,
    keywords: {
      strong: ["tattoo", "piercing", "goth", "gothic", "punk", "alternative", "emo", "ink"],
      medium: ["dark aesthetic", "black clothing", "leather jacket", "spike", "chain"],
    },
  },
  curvy: {
    priority: 85,
    keywords: {
      strong: ["plus size", "plus-size", "curvy", "body positive", "body positivity", "bbw"],
      medium: ["fuller figure", "voluptuous"],
    },
  },
  petite: {
    priority: 85,
    keywords: {
      strong: ["petite", "slender", "small frame"],
      medium: ["delicate", "slim"],
    },
  },
  mature: {
    priority: 85,
    keywords: {
      strong: ["mature woman", "older woman", "milf", "cougar"],
      medium: ["sophisticated", "elegant lady", "experienced"],
    },
  },

  // ── Mainstream creator ───────────────────────────────────────────────────
  fitness: {
    priority: 100,
    keywords: {
      strong: ["fitness", "gym", "workout", "bodybuilding", "athlete", "athletic", "lifting", "weights", "training", "physical fitness"],
      medium: ["muscle", "sportswear", "exercise", "strength", "abs", "biceps", "cardio"],
    },
  },
  wellness: {
    priority: 90,
    keywords: {
      strong: ["yoga", "meditation", "mindfulness", "wellness", "pilates", "zen"],
      medium: ["spirituality", "calm", "lotus pose", "breathing", "mat"],
    },
  },
  beauty: {
    priority: 90,
    keywords: {
      strong: ["makeup", "cosmetics", "skincare", "lipstick", "mascara", "eyeshadow", "foundation", "beauty routine"],
      medium: ["lip", "facial", "skin care", "glow", "blush", "brow", "contour"],
    },
  },
  fashion: {
    priority: 90,
    keywords: {
      strong: ["fashion", "outfit", "ootd", "streetwear", "designer", "couture", "haute couture", "fashion design"],
      medium: ["clothing", "apparel", "boutique", "denim", "blazer", "dress", "garment"],
    },
  },
  travel: {
    priority: 100,
    keywords: {
      strong: ["travel", "wanderlust", "vacation", "tourism", "explore", "adventure", "trip", "backpacking"],
      medium: ["landscape", "mountain", "forest", "river", "lake", "scenic", "outdoor", "nature"],
    },
  },
  food: {
    priority: 100,
    keywords: {
      strong: ["food", "cuisine", "dish", "meal", "recipe", "cooking", "chef", "restaurant", "foodie"],
      medium: ["plate", "ingredient", "dessert", "drink", "coffee", "fruit", "baking"],
    },
  },
  pets: {
    priority: 95,
    keywords: {
      strong: ["dog", "cat", "puppy", "kitten", "pet", "feline", "canine"],
      medium: ["animal", "fur", "paw", "tail", "snout", "whiskers"],
    },
  },
  art: {
    priority: 90,
    keywords: {
      strong: ["art", "painting", "illustration", "drawing", "sketch", "digital art", "artwork", "artist"],
      medium: ["canvas", "brush", "ink drawing", "pencil", "graphic design", "creative"],
    },
  },
  music: {
    priority: 90,
    keywords: {
      strong: ["music", "musician", "guitar", "piano", "dj", "producer", "concert", "stage"],
      medium: ["instrument", "microphone", "headphones", "vinyl", "studio recording"],
    },
  },

  // ── Lifestyle/general ────────────────────────────────────────────────────
  couples: {
    priority: 85,
    keywords: {
      strong: ["couple", "relationship", "wedding", "engagement", "kiss", "romance"],
      medium: ["love", "together", "partner", "ring", "marriage"],
    },
  },
  city: {
    priority: 75,
    keywords: {
      strong: ["city", "urban", "skyline", "downtown", "metropolis", "cityscape"],
      medium: ["building", "skyscraper", "street", "night photography", "neon", "architecture"],
    },
  },
};

const KEYWORD_WEIGHTS = { strong: 3, medium: 1 };

/**
 * Tokenize a Vision API description into searchable tokens.
 * "Fashion Model" → ["fashion model", "fashion", "model"]
 */
function tokenize(description) {
  if (!description || typeof description !== "string") return [];
  const lower = description.toLowerCase().trim();
  const tokens = new Set([lower]);
  for (const word of lower.split(/\s+/)) {
    if (word.length >= 3) tokens.add(word);
  }
  return Array.from(tokens);
}

/**
 * Check if a keyword matches any token via substring.
 * "model" matches token "fashion model"; "fashion model" matches token "fashion model".
 */
function matchKeyword(keyword, tokens) {
  const kw = keyword.toLowerCase();
  return tokens.some((t) => t === kw || t.includes(kw) || kw.includes(t));
}

function scoreNiche(nicheKeywords, tokens) {
  let score = 0;
  for (const [tier, words] of Object.entries(nicheKeywords)) {
    const weight = KEYWORD_WEIGHTS[tier] || 0;
    for (const word of words) {
      if (matchKeyword(word, tokens)) score += weight;
    }
  }
  return score;
}

/**
 * Main entry. Returns the winning niche id, or "general" if no signal.
 *
 * @param {Array<{description: string}>} labels     — Vision API label annotations
 * @param {Array<{description: string}>} webEntities — Vision API web entity annotations
 * @returns {string} niche id
 */
function pickNiche(labels = [], webEntities = []) {
  const tokens = [];
  for (const l of labels) tokens.push(...tokenize(l?.description || ""));
  for (const w of webEntities) tokens.push(...tokenize(w?.description || ""));
  const uniqueTokens = Array.from(new Set(tokens));

  if (uniqueTokens.length === 0) return "general";

  const scores = [];
  for (const [nicheId, def] of Object.entries(NICHE_KEYWORDS)) {
    const score = scoreNiche(def.keywords, uniqueTokens);
    if (score > 0) scores.push({ nicheId, score, priority: def.priority });
  }

  if (scores.length === 0) return "general";

  scores.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : b.priority - a.priority
  );

  return scores[0].nicheId;
}

module.exports = { pickNiche, NICHE_KEYWORDS };
