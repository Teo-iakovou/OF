"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type VideoIntroProps = {
  onComplete: () => void;
};

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const [showSkip, setShowSkip] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Show skip button after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const startVideo = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = true;
      if (v.ended) v.currentTime = 0;
      await v.play();
    } catch {}
  }, []);

  useEffect(() => {
    let attempts = 0;
    const retry = setInterval(() => {
      attempts += 1;
      const v = videoRef.current;
      if (!v) return;
      if (!v.paused && v.currentTime > 0.05) {
        clearInterval(retry);
        return;
      }
      startVideo();
      if (attempts >= 8) clearInterval(retry);
    }, 250);
    return () => clearInterval(retry);
  }, [startVideo]);

  const handleSkip = () => {
    setHasSkipped(true);
    setTimeout(onComplete, 800); // Wait for fade animation
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(onComplete, 800); // Wait for fade animation
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: hasSkipped || videoEnded ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Video Element */}
        <video
          id="landing-intro-video"
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain md:object-cover"
          autoPlay
          playsInline
          muted
          onEnded={handleVideoEnd}
          preload="auto"
          onLoadedData={startVideo}
          onPlay={() => {
            setHasStarted(true);
          }}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0.1) {
              setHasStarted(true);
            }
          }}
        >
          <source media="(max-width: 767px)" src="/mobile animation echofy.mp4" type="video/mp4" />
          <source src="/intro.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_50%,transparent_58%,rgba(0,0,0,0.35)_100%)] md:bg-transparent" />

        {/* Skip Button */}
        <AnimatePresence>
          {showSkip && !hasSkipped && !videoEnded && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              onClick={handleSkip}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[210] rounded-full border-2 border-white/30 bg-black/50 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-black/70 hover:scale-105"
              aria-label="Skip intro video"
            >
              Skip Intro
            </motion.button>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: hasSkipped || videoEnded ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
