"use client";

import { useEffect, useState } from "react";

type Particle = { id: number; top: number; left: number; opacity: number };

export default function HeroParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, idx) => ({
      id: idx,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setParticles(generated);
  }, []);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 opacity-30">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-white/80"
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
}
