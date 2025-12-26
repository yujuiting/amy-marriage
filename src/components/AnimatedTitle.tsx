"use client";

import { useState, useEffect } from "react";
import { ROTATING_WORDS } from "@/lib/config";

export function AnimatedTitle() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-8">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
        <span className="gold-text">Amy Marriage Yields...</span>
      </h1>
      <div className="h-16 md:h-20 flex items-center justify-center overflow-hidden">
        <span
          className={`text-3xl md:text-5xl lg:text-6xl font-bold text-rose-dark transition-all duration-500 ${
            isAnimating
              ? "opacity-0 translate-y-8"
              : "opacity-100 translate-y-0"
          }`}
          style={{ color: "var(--rose-dark)" }}
        >
          {ROTATING_WORDS[currentIndex]}
        </span>
      </div>
    </div>
  );
}
