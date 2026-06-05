"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyVideoProps = {
  src: string;
  className?: string;
  /** Background shown before the video mounts. Solid color or Tailwind class. */
  placeholderClassName?: string;
  /** Content overlay shown until first frame (e.g. small spinner / loader). */
  placeholderChildren?: ReactNode;
  /** How far ahead of viewport to start mounting. Default 300px. */
  rootMargin?: string;
  /** Pause when scrolled out of view to save bandwidth. Default true. */
  pauseWhenOffscreen?: boolean;
};

export default function LazyVideo({
  src,
  className,
  placeholderClassName = "bg-black/40",
  placeholderChildren,
  rootMargin = "300px",
  pauseWhenOffscreen = true,
}: LazyVideoProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // SSR fallback or unsupported browser — mount immediately
      setMounted(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (!pauseWhenOffscreen || !mounted) return;
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, mounted, pauseWhenOffscreen]);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      {mounted ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className={`absolute inset-0 ${placeholderClassName}`}>{placeholderChildren}</div>
      )}
    </div>
  );
}
