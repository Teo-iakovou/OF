"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  Image as ImageIcon,
  ImageOff,
  MessageCircle,
  MoreHorizontal,
  Music,
  Repeat2,
  Send,
  Share2,
} from "lucide-react";
import { BrandIcon } from "./BrandIcons";

type Props = {
  platform: string;
  caption?: string;
  hashtags?: string[];
  imageUrl?: string | null;
  imageAlt?: string;
  onRefreshUrl?: () => Promise<string | null>;
};

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

// ─── Image with retry + loading/error states ────────────────────────────────

function useRetryImage(
  imageUrl: string | null | undefined,
  onRefreshUrl?: () => Promise<string | null>
) {
  const [src, setSrc] = useState<string | null>(imageUrl ?? null);
  const [state, setState] = useState<"loading" | "loaded" | "error">(
    imageUrl ? "loading" : "error"
  );
  const retriedRef = useRef(false);
  // Skip the sync effect on initial mount: useState already initialised correctly.
  // Without this guard, the effect fires AFTER onLoad (which fires from memory cache
  // during AnimatePresence exit animation), resetting "loaded" back to "loading" with
  // no subsequent onLoad to recover from — the image becomes permanently invisible.
  const mountedRef = useRef(false);
  // Ref for the <img> DOM element — needed for the cached-image check below.
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setSrc(imageUrl ?? null);
    setState(imageUrl ? "loading" : "error");
    retriedRef.current = false;
  }, [imageUrl]);

  // Catch the cached-image race: when previewUrl is already in the browser's
  // memory cache, img.complete is true as soon as src is assigned — the load
  // event fires before React attaches the onLoad listener and is silently
  // dropped. useLayoutEffect runs synchronously after DOM commit but before
  // paint, so imgRef.current is live and complete is accurate. naturalWidth>0
  // distinguishes a successful cached load from a broken/404 image (both have
  // complete===true, but broken images have naturalWidth===0).
  useLayoutEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setState("loaded");
    }
  }, [src]);

  const handleLoad = () => setState("loaded");

  const handleError = async () => {
    if (!retriedRef.current && onRefreshUrl) {
      retriedRef.current = true;
      const fresh = await onRefreshUrl().catch(() => null);
      if (fresh) {
        setSrc(fresh);
        setState("loading");
      } else {
        setState("error");
      }
    } else {
      setState("error");
    }
  };

  return { src, state, handleLoad, handleError, imgRef };
}

type ImageAreaProps = {
  imageUrl?: string | null;
  imageAlt?: string;
  onRefreshUrl?: () => Promise<string | null>;
  className?: string;
};

function ImageArea({ imageUrl, imageAlt, onRefreshUrl, className = "" }: ImageAreaProps) {
  const { src, state, handleLoad, handleError, imgRef } = useRetryImage(imageUrl, onRefreshUrl);

  if (!src || state === "error") {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[var(--hg-surface-2)] ${className}`}
      >
        <ImageOff className="h-8 w-8 text-[var(--hg-muted-2)]" strokeWidth={1.5} />
        <p className="mt-1.5 text-[10px] text-[var(--hg-muted-2)]">Preview unavailable</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {state === "loading" && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-[var(--hg-surface-2)]">
          <ImageIcon className="h-8 w-8 text-[var(--hg-muted-2)]" strokeWidth={1.5} />
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={imageAlt || "Post preview"}
        className={`h-full w-full object-cover transition-opacity duration-200 ${
          state === "loading" ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={() => void handleError()}
      />
    </div>
  );
}

// ─── Per-platform preview cards ─────────────────────────────────────────────

function InstagramPreview({ caption, hashtags, imageUrl, imageAlt, onRefreshUrl }: Omit<Props, "platform">) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
      <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
          <BrandIcon platform="instagram" size={16} className="text-white" variant="mono" />
        </div>
        <div>
          <p className="text-[11px] font-semibold leading-none text-white">your_handle</p>
          <p className="mt-0.5 text-[10px] text-white/40">Limassol, Cyprus</p>
        </div>
        <div className="ml-auto text-white/30">
          <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
        </div>
      </div>

      <ImageArea
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        onRefreshUrl={onRefreshUrl}
        className="aspect-square w-full"
      />

      <div className="px-3 py-2.5">
        <div className="flex items-center gap-4 pb-2.5">
          <Heart className="h-[18px] w-[18px] text-white/70" strokeWidth={1.5} />
          <MessageCircle className="h-[18px] w-[18px] text-white/70" strokeWidth={1.5} />
          <Send className="h-[18px] w-[18px] text-white/70" strokeWidth={1.5} />
          <Bookmark className="ml-auto h-[18px] w-[18px] text-white/70" strokeWidth={1.5} />
        </div>
        {caption ? (
          <p className="text-[11px] leading-relaxed text-white/80">
            <span className="font-semibold text-white">your_handle</span>{" "}
            {truncate(caption, 90)}
          </p>
        ) : null}
        {hashtags?.length ? (
          <p className="mt-1 text-[11px] text-[#4db0e8] opacity-80">
            {hashtags.slice(0, 3).map((t) => `#${t.replace(/^#/, "")}`).join(" ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function TikTokPreview({ caption, hashtags, imageUrl, imageAlt, onRefreshUrl }: Omit<Props, "platform">) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="relative aspect-[9/16] max-h-[400px] w-full overflow-hidden bg-[#050505]">
        {imageUrl ? (
          <ImageArea
            imageUrl={imageUrl}
            imageAlt={imageAlt}
            onRefreshUrl={onRefreshUrl}
            className="absolute inset-0"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#050505]" />
        )}
        {/* Action sidebar */}
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-4">
          {[
            { Icon: Heart, label: "0" },
            { Icon: MessageCircle, label: "0" },
            { Icon: Send, label: "" },
            { Icon: Music, label: "" },
          ].map(({ Icon, label }, i) => (
            <div key={i} className="flex flex-col items-center">
              <Icon className="h-5 w-5 text-white drop-shadow" strokeWidth={1.5} />
              {label ? <span className="mt-0.5 text-[9px] text-white/60">{label}</span> : null}
            </div>
          ))}
        </div>
        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-10 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-black">
              <BrandIcon platform="tiktok" size={14} variant="color" />
            </div>
            <p className="text-[11px] font-semibold text-white">@yourhandle</p>
          </div>
          {caption ? (
            <p className="text-[11px] leading-snug text-white/90 drop-shadow">
              {truncate(caption, 80)}
            </p>
          ) : null}
          {hashtags?.length ? (
            <p className="mt-1 text-[11px] text-[#69c9d0]">
              {hashtags.slice(0, 2).map((t) => `#${t.replace(/^#/, "")}`).join(" ")}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/8 px-3 py-1.5">
        <p className="text-[10px] text-white/40">TikTok</p>
        <div className="flex gap-3 text-xs text-white/40">
          <span>Following</span>
          <span className="text-white">For You</span>
        </div>
      </div>
    </div>
  );
}

function TwitterPreview({ caption, hashtags, imageUrl, imageAlt, onRefreshUrl }: Omit<Props, "platform">) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15202b]">
      <div className="p-3">
        <div className="flex gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black">
            <BrandIcon platform="twitter" size={20} variant="color" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-[12px] font-bold text-white">Your Name</p>
              <p className="text-[11px] text-white/40">@yourhandle · now</p>
            </div>
            {caption ? (
              <p className="mt-1 text-[12px] leading-relaxed text-white/90">
                {truncate(caption, 160)}
              </p>
            ) : null}
            {hashtags?.length ? (
              <p className="mt-1 text-[12px] text-[#1d9bf0]">
                {hashtags.slice(0, 3).map((t) => `#${t.replace(/^#/, "")}`).join(" ")}
              </p>
            ) : null}
            {/* Card image */}
            {imageUrl ? (
              <div className="mt-2 overflow-hidden rounded-xl">
                <ImageArea
                  imageUrl={imageUrl}
                  imageAlt={imageAlt}
                  onRefreshUrl={onRefreshUrl}
                  className="aspect-video w-full"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-5 pl-11">
          <MessageCircle className="h-4 w-4 text-white/30" strokeWidth={1.5} />
          <Repeat2 className="h-4 w-4 text-white/30" strokeWidth={1.5} />
          <Heart className="h-4 w-4 text-white/30" strokeWidth={1.5} />
          <Share2 className="h-4 w-4 text-white/30" strokeWidth={1.5} />
        </div>
      </div>
      <div className="border-t border-white/8 px-3 py-1">
        <p className="text-[10px] text-white/30">X (Twitter)</p>
      </div>
    </div>
  );
}

// Reddit: shows the uploaded image as a Reddit image post (landscape crop above the title),
// matching the visual weight of other platform previews in the left column.
function RedditPreview({ caption, hashtags, imageUrl, imageAlt, onRefreshUrl }: Omit<Props, "platform">) {
  const subreddits = hashtags?.slice(0, 2) || [];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1b]">
      {imageUrl ? (
        <ImageArea
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          onRefreshUrl={onRefreshUrl}
          className="aspect-video w-full"
        />
      ) : null}
      <div className="p-3">
        <div className="flex gap-2">
          <div className="flex shrink-0 flex-col items-center gap-0.5">
            <button type="button" className="text-[var(--hg-muted-2)] hover:text-orange-500">
              <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="text-xs font-bold text-white">1</span>
            <button type="button" className="text-[var(--hg-muted-2)] hover:text-blue-500">
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[10px] text-white/40">
              <BrandIcon platform="reddit" size={12} variant="color" />
              {subreddits.length ? (
                <span className="font-medium text-white/60">
                  r/{subreddits[0].replace(/^#/, "")}
                </span>
              ) : (
                <span>r/yourcommunity</span>
              )}
              <span>•</span>
              <span>Posted by u/yourhandle</span>
            </div>
            {caption ? (
              <p className="mt-1 text-[12px] font-medium leading-snug text-white">
                {truncate(caption, 120)}
              </p>
            ) : null}
            <div className="mt-2 flex items-center gap-3 text-[10px] text-white/40">
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="h-3 w-3" strokeWidth={1.5} />
                0 Comments
              </span>
              <span className="inline-flex items-center gap-1">
                <Share2 className="h-3 w-3" strokeWidth={1.5} />
                Share
              </span>
              <span className="inline-flex items-center gap-1">
                <Bookmark className="h-3 w-3" strokeWidth={1.5} />
                Save
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 px-3 py-1">
        <p className="text-[10px] text-white/30">Reddit</p>
      </div>
    </div>
  );
}

function TelegramPreview({ caption, imageUrl, imageAlt, onRefreshUrl }: Omit<Props, "platform">) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#17212b]">
      <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2">
        <BrandIcon platform="telegram" size={28} variant="color" className="rounded-full" />
        <div>
          <p className="text-[11px] font-semibold leading-none text-white">Your Channel</p>
          <p className="mt-0.5 text-[10px] text-white/40">Telegram</p>
        </div>
      </div>
      <div className="flex justify-end p-3">
        <div className="w-full max-w-[85%] overflow-hidden rounded-2xl rounded-tr-sm bg-[#2b5278]">
          {imageUrl ? (
            <ImageArea
              imageUrl={imageUrl}
              imageAlt={imageAlt}
              onRefreshUrl={onRefreshUrl}
              className="aspect-[4/5] w-full"
            />
          ) : null}
          <div className="px-3 py-2">
            {caption ? (
              <p className="text-[12px] leading-relaxed text-white">
                {truncate(caption, 140)}
              </p>
            ) : (
              <p className="text-[12px] italic text-white/50">Your message here…</p>
            )}
            <p className="mt-1 text-right text-[10px] text-white/40">9:41 AM ✓✓</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-white/8 px-3 py-1.5 text-[10px] text-white/30">
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3 w-3" strokeWidth={1.5} />
          0
        </span>
        <span className="inline-flex items-center gap-1">
          <Share2 className="h-3 w-3" strokeWidth={1.5} />
          Share
        </span>
      </div>
    </div>
  );
}

function OnlyFansPreview({ caption, imageUrl, imageAlt, onRefreshUrl }: Omit<Props, "platform">) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#00aff0]/20 bg-[#0d1117]">
      <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2">
        <BrandIcon platform="onlyfans" size={28} variant="color" className="rounded-full" />
        <div>
          <p className="text-[11px] font-semibold leading-none text-white">yourhandle</p>
          <p className="mt-0.5 text-[10px] text-[#00aff0]/70">OnlyFans</p>
        </div>
      </div>
      {imageUrl ? (
        <ImageArea
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          onRefreshUrl={onRefreshUrl}
          className="aspect-square w-full"
        />
      ) : null}
      <div className="p-3">
        {caption ? (
          <p className="text-[12px] leading-relaxed text-white/90">{truncate(caption, 120)}</p>
        ) : (
          <p className="text-[12px] italic text-white/40">Your post caption…</p>
        )}
      </div>
      <div className="flex items-center gap-4 border-t border-white/8 px-3 py-1.5 text-[10px] text-white/30">
        <span className="inline-flex items-center gap-1">
          <Heart className="h-3 w-3" strokeWidth={1.5} />
          0
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-3 w-3" strokeWidth={1.5} />
          0
        </span>
        <span className="inline-flex items-center gap-1">
          <Send className="h-3 w-3" strokeWidth={1.5} />
          Share
        </span>
      </div>
    </div>
  );
}

function GenericPreview({ platform, caption, hashtags }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]">
      <div className="border-b border-[var(--hg-border)] px-3 py-2">
        <p className="text-[11px] font-semibold text-[var(--hg-muted)]">{platform}</p>
      </div>
      <div className="p-3">
        {caption ? (
          <p className="text-[12px] leading-relaxed text-white/80">{truncate(caption, 120)}</p>
        ) : null}
        {hashtags?.length ? (
          <p className="mt-1 text-[11px] text-[var(--hg-accent)]/70">
            {hashtags.slice(0, 3).map((t) => `#${t.replace(/^#/, "")}`).join(" ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// ─── Public export ───────────────────────────────────────────────────────────

export function PlatformPreview({ platform, caption, hashtags, imageUrl, imageAlt, onRefreshUrl }: Props) {
  const p = platform.toLowerCase();
  if (p === "instagram") {
    return (
      <InstagramPreview
        caption={caption}
        hashtags={hashtags}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        onRefreshUrl={onRefreshUrl}
      />
    );
  }
  if (p === "tiktok" || p === "tik tok") {
    return (
      <TikTokPreview
        caption={caption}
        hashtags={hashtags}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        onRefreshUrl={onRefreshUrl}
      />
    );
  }
  if (p === "twitter" || p === "x") {
    return (
      <TwitterPreview
        caption={caption}
        hashtags={hashtags}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        onRefreshUrl={onRefreshUrl}
      />
    );
  }
  if (p === "reddit") {
    return (
      <RedditPreview
        caption={caption}
        hashtags={hashtags}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        onRefreshUrl={onRefreshUrl}
      />
    );
  }
  if (p === "telegram") {
    return (
      <TelegramPreview
        caption={caption}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        onRefreshUrl={onRefreshUrl}
      />
    );
  }
  if (p === "onlyfans") {
    return (
      <OnlyFansPreview
        caption={caption}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        onRefreshUrl={onRefreshUrl}
      />
    );
  }
  return <GenericPreview platform={platform} caption={caption} hashtags={hashtags} />;
}
