type QuotaBlock = {
  baseLimit: number | null;
  addons: number;
  effectiveLimit: number | null;
  used: number;
  remaining: number | null;
  isUnlimited: boolean;
};

export type CanonicalQuotas = {
  uploads: QuotaBlock;
  aiTokens: QuotaBlock;
  videos: QuotaBlock;
};

const warnedScopes = new Set<string>();

function toNumberOrNull(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

function toSafeNumber(value: unknown, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return value;
}

function firstFinite(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

function computeRemaining(effectiveLimit: number | null, used: number): number | null {
  if (effectiveLimit === null) return null;
  if (effectiveLimit === 0) return null;
  return Math.max(0, effectiveLimit - used);
}

function warnLegacyFallback(scope: string) {
  if (process.env.NODE_ENV === "production") return;
  if (warnedScopes.has(scope)) return;
  warnedScopes.add(scope);
  console.warn(`[quota] Using legacy quota fallback in ${scope}`);
}

export function resolveQuotaContract(source: unknown, scope = "unknown"): CanonicalQuotas {
  const data = (source && typeof source === "object" ? source : {}) as Record<string, unknown>;
  const quotas = (data.quotas && typeof data.quotas === "object"
    ? data.quotas
    : null) as
    | {
        uploads?: Partial<QuotaBlock>;
        aiTokens?: Partial<QuotaBlock>;
        videos?: Partial<QuotaBlock>;
      }
    | null;

  const hasCanonical =
    !!quotas?.uploads && !!quotas?.aiTokens && !!quotas?.videos;

  if (!hasCanonical) {
    warnLegacyFallback(scope);
  }

  const uploadsBaseLegacy = toNumberOrNull(data.uploadLimit);
  const uploadsAddonsLegacy =
    toSafeNumber(data.addonsUploads) +
    toSafeNumber((data.addons as { uploads?: number } | undefined)?.uploads);
  const uploadsEffectiveLegacy =
    toNumberOrNull(data.effectiveUploadLimit) ??
    (uploadsBaseLegacy === null
      ? null
      : uploadsBaseLegacy === 0
        ? 0
        : uploadsBaseLegacy + uploadsAddonsLegacy);
  const uploadsUsedLegacy = Math.max(0, toSafeNumber(data.uploadsUsed));
  const uploadsRemainingLegacy =
    toNumberOrNull(data.uploadsRemaining) ?? computeRemaining(uploadsEffectiveLegacy, uploadsUsedLegacy);

  const chatBaseLegacy =
    toNumberOrNull(data.chatTokenLimit) ??
    toNumberOrNull(data.tokensLimit) ??
    toNumberOrNull(data.chatMonthlyLimit);
  const chatAddonsLegacy =
    toSafeNumber(data.addonsChatTokens) +
    toSafeNumber(data.addonsChat) +
    toSafeNumber((data.addons as { chatTokens?: number; chat?: number } | undefined)?.chatTokens) +
    toSafeNumber((data.addons as { chatTokens?: number; chat?: number } | undefined)?.chat);
  const chatEffectiveLegacy =
    toNumberOrNull(data.effectiveChatLimit) ??
    toNumberOrNull(data.chatLimitTokens) ??
    (chatBaseLegacy === null ? null : chatBaseLegacy === 0 ? 0 : chatBaseLegacy + chatAddonsLegacy);
  const chatUsedLegacy = Math.max(
    0,
    firstFinite(data.tokensUsed, data.chatUsedTokens, data.chatTokensUsed, data.chatUsedThisCycle) ?? 0
  );
  const chatRemainingLegacy =
    toNumberOrNull(data.chatRemaining) ??
    toNumberOrNull(data.chatRemainingTokens) ??
    computeRemaining(chatEffectiveLegacy, chatUsedLegacy);

  const videosBaseLegacy =
    toNumberOrNull(data.videosLimit) ??
    toNumberOrNull(data.sadtalkerVideosLimit) ??
    toNumberOrNull(data.sadtalkerVideoLimit);
  const videosAddonsLegacy =
    toSafeNumber(data.addonsVideos) +
    toSafeNumber((data.addons as { sadtalkerVideos?: number } | undefined)?.sadtalkerVideos);
  const videosEffectiveLegacy =
    toNumberOrNull(data.effectiveVideoLimit) ??
    (videosBaseLegacy === null
      ? null
      : videosBaseLegacy === 0
        ? 0
        : videosBaseLegacy + videosAddonsLegacy);
  const videosUsedLegacy = Math.max(0, firstFinite(data.videosUsed, data.sadtalkerVideosUsed) ?? 0);
  const videosRemainingLegacy =
    toNumberOrNull(data.videosRemaining) ??
    toNumberOrNull(data.sadtalkerVideosRemaining) ??
    computeRemaining(videosEffectiveLegacy, videosUsedLegacy);

  return {
    uploads: {
      baseLimit: toNumberOrNull(quotas?.uploads?.baseLimit) ?? uploadsBaseLegacy,
      addons: toSafeNumber(quotas?.uploads?.addons, uploadsAddonsLegacy),
      effectiveLimit: toNumberOrNull(quotas?.uploads?.effectiveLimit) ?? uploadsEffectiveLegacy,
      used: Math.max(0, toSafeNumber(quotas?.uploads?.used, uploadsUsedLegacy)),
      remaining: toNumberOrNull(quotas?.uploads?.remaining) ?? uploadsRemainingLegacy,
      isUnlimited:
        typeof quotas?.uploads?.isUnlimited === "boolean"
          ? quotas.uploads.isUnlimited
          : (toNumberOrNull(quotas?.uploads?.effectiveLimit) ?? uploadsEffectiveLegacy) === 0,
    },
    aiTokens: {
      baseLimit: toNumberOrNull(quotas?.aiTokens?.baseLimit) ?? chatBaseLegacy,
      addons: toSafeNumber(quotas?.aiTokens?.addons, chatAddonsLegacy),
      effectiveLimit: toNumberOrNull(quotas?.aiTokens?.effectiveLimit) ?? chatEffectiveLegacy,
      used: Math.max(0, toSafeNumber(quotas?.aiTokens?.used, chatUsedLegacy)),
      remaining: toNumberOrNull(quotas?.aiTokens?.remaining) ?? chatRemainingLegacy,
      isUnlimited:
        typeof quotas?.aiTokens?.isUnlimited === "boolean"
          ? quotas.aiTokens.isUnlimited
          : (toNumberOrNull(quotas?.aiTokens?.effectiveLimit) ?? chatEffectiveLegacy) === 0,
    },
    videos: {
      baseLimit: toNumberOrNull(quotas?.videos?.baseLimit) ?? videosBaseLegacy,
      addons: toSafeNumber(quotas?.videos?.addons, videosAddonsLegacy),
      effectiveLimit: toNumberOrNull(quotas?.videos?.effectiveLimit) ?? videosEffectiveLegacy,
      used: Math.max(0, toSafeNumber(quotas?.videos?.used, videosUsedLegacy)),
      remaining: toNumberOrNull(quotas?.videos?.remaining) ?? videosRemainingLegacy,
      isUnlimited:
        typeof quotas?.videos?.isUnlimited === "boolean"
          ? quotas.videos.isUnlimited
          : (toNumberOrNull(quotas?.videos?.effectiveLimit) ?? videosEffectiveLegacy) === 0,
    },
  };
}
