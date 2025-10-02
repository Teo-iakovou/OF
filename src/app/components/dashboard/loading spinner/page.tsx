"use client";
import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-32">
      <div className="relative">
        {/* subtle glow */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 blur-md animate-pulse" />
        {/* small spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
      </div>
    </div>
  );
};

export default Spinner;
