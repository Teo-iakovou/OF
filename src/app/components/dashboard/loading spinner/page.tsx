"use client";
import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-48">
      <div className="relative w-16 h-16">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-full h-full"
            style={{
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            <div
              className="w-1 h-4 bg-cyan-400 rounded-full opacity-20 animate-pulse"
              style={{
                margin: "0 auto",
                animationDelay: `${i * 0.05}s`,
                animation: "fade 1.2s linear infinite",
              }}
            ></div>
          </div>
        ))}
        <style jsx>{`
          @keyframes fade {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0.2;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Spinner;
