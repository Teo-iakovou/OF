// src/app/types/analysis.ts

export type Likelihood =
  | "VERY_UNLIKELY"
  | "UNLIKELY"
  | "POSSIBLE"
  | "LIKELY"
  | "VERY_LIKELY"
  | undefined;

export type PipelineStatus = "processing" | "ready" | "error";

export interface DominantColor {
  r: number;
  g: number;
  b: number;
  score: number;
  pixelFraction: number;
}

export interface VisionMeta {
  safeSearch: {
    adult?: Likelihood;
    racy?: Likelihood;
    medical?: Likelihood;
    violence?: Likelihood;
    spoof?: Likelihood;
  };
  labels: Array<{ description: string; score: number }>;
  objects: Array<{ name: string; score: number }>;
  webEntities: Array<{ description: string; score: number }>;
  dominantColors: DominantColor[];
  hasFace: boolean;
}

export interface ColorMood {
  mood: "vivid" | "muted" | "neutral";
  brightness: "bright" | "mid" | "dark";
  warmth: "warm" | "neutral" | "cool";
}

export interface CaptionVariant {
  angle: "hook" | "aspirational" | "cta" | "default" | string;
  text: string;
  originalText?: string | null;
  reasoning?: string;
}

export interface HashtagPackMeta {
  id: string | null;
  tier: "reach" | "niche" | "balanced" | "trending" | string;
  reasoning: string;
}

export interface RecommendedPlatform {
  platform: "Instagram" | "TikTok" | "Twitter" | "Reddit" | "Telegram" | string;
  preview: Record<string, unknown>;
  caption?: string;                 // backward compat: equals captions[0].text (or empty when captions=false)
  captions?: CaptionVariant[];      // full 3-variant array from new pipeline; absent on legacy docs
  hashtags: string[];
  link: { url: string; placement: string };
  bestTimesLocal?: string[];        // ["18:00-21:00", ...]
  notes?: string[];
  subreddits?: string[];            // for Reddit
  policyHints?: string[];
  policyWhy?: string;
  selectedIds?: {
    timePackId?: string | null;
    hashtagPackId?: string | null;
    captionStyleId?: string | null;
    ctaId?: string | null;
  };
  hashtagPack?: HashtagPackMeta | null;
  fitScore?: { score: number; tier: "great" | "good" | "limited" };
  skipReason?: string | null;
}

export interface Promotion {
  contentSafety: { csl: number; reasons: string[] };
  niche: string;
  hasFace: boolean;
  recommendedPlatforms: RecommendedPlatform[];
  ctaVariants: string[];
  selectedIds?: {
    platformMixId?: string | null;
    ctaId?: string | null;
  };
  riskFlags?: string[];
  skippedPlatforms?: Array<{ platform: string; skipReason: string }>;
}

export interface PromotionMeta {
  vision: VisionMeta;
  colorMood: ColorMood;
  goal: "subs" | "ppv" | "customs" | string;
  timezone: string;
  policiesVersion: string;
  engineVersion: string;
}

export interface ResultDoc {
  _id: string;
  email: string;

  csl: number;
  niche: string;
  hasFace: boolean;

  // pipeline / storage info
  status?: PipelineStatus;
  stage?: string;
  imageHash?: string;
  captionsGenerated?: boolean;

  promotion: Promotion;
  meta: PromotionMeta;

  createdAt: string;
}
