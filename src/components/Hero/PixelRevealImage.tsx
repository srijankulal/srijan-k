"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface PixelRevealImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function PixelRevealImage({
  src,
  alt,
  width = 600,
  height = 600,
  className = "",
  priority = false,
}: PixelRevealImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [pixelKey, setPixelKey] = useState(0);

  // Grid dimensions for pixel matrix
  const ROWS = 12;
  const COLS = 12;
  const totalPixels = ROWS * COLS;

  // Generate randomized delays for each pixel block
  const pixelDelays = useRef<number[]>([]);
  useEffect(() => {
    pixelDelays.current = Array.from({ length: totalPixels }, () => Math.random() * 0.9);
  }, [totalPixels, pixelKey]);

  useEffect(() => {
    if (!imageLoaded) return;

    // Progress animation from 0 to 100%
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 8;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setRevealComplete(true), 600);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [imageLoaded, pixelKey]);

  const handleReplay = () => {
    setRevealComplete(false);
    setProgress(0);
    setGlitchActive(true);
    setPixelKey((prev) => prev + 1);
    setTimeout(() => setGlitchActive(false), 300);
  };

  return (
    <div
      className={`relative rounded-sm overflow-hidden p-1 bg-black shadow-[0_0_40px_rgba(113,252,123,0.12)] border border-neon/20 hover:shadow-[0_0_60px_rgba(113,252,123,0.25)] hover:border-neon/40 transition-all duration-500 group select-none ${className}`}
    >
      {/* Corner chip accents */}
      <span className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-neon/60 pointer-events-none z-30" />
      <span className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-neon/60 pointer-events-none z-30" />
      <span className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-neon/60 pointer-events-none z-30" />
      <span className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-neon/60 pointer-events-none z-30" />

      {/* Main image container */}
      <div className="relative overflow-hidden w-full h-full bg-black">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setImageLoaded(true)}
          priority={priority}
          className={`max-w-full h-auto w-auto object-contain transition-all duration-700 ${
            revealComplete
              ? "contrast-125 opacity-100 filter-none"
              : imageLoaded
              ? "contrast-150 opacity-90 filter blur-[1px]"
              : "opacity-0"
          } ${glitchActive ? "translate-x-0.5 skew-x-1" : ""}`}
        />

        {/* Pixel Block Dissolve Overlay */}
        <AnimatePresence>
          {!revealComplete && (
            <motion.div
              key={`pixel-grid-${pixelKey}`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none z-10"
            >
              {Array.from({ length: totalPixels }).map((_, index) => {
                const delay = pixelDelays.current[index] || (index % 12) * 0.05;
                const isBright = index % 5 === 0;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                      opacity: [1, 0.9, isBright ? 0.8 : 0.4, 0],
                      scale: [1, 1.05, 0.8, 0],
                      backgroundColor: [
                        "#000000",
                        isBright ? "#71fc7b" : "#0d1b0f",
                        isBright ? "#00ff66" : "#050d06",
                        "transparent",
                      ],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: delay * 0.9,
                      ease: "easeInOut",
                    }}
                    className="border-[0.5px] border-neon/10 bg-black flex items-center justify-center overflow-hidden"
                  >
                    {isBright && (
                      <span className="font-mono text-[7px] text-neon/40 select-none">
                        {index % 2 === 0 ? "1" : "0"}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cyber Hologram Scanline */}
        {!revealComplete && imageLoaded && (
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{
              duration: 1.2,
              repeat: 1,
              ease: "linear",
            }}
            className="absolute left-0 right-0 h-8 bg-linear-to-b from-transparent via-neon/25 to-transparent pointer-events-none z-20 shadow-[0_0_15px_rgba(113,252,123,0.4)] border-b border-neon/80"
          />
        )}

        {/* Digital Decoding Badge */}
        <div className="absolute bottom-2 right-2 z-30 font-mono text-[10px] px-2 py-0.5 bg-black/80 border border-neon/30 text-neon flex items-center gap-1.5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
          <span>{revealComplete ? "SYS: READY" : `DECODING: ${progress}%`}</span>
        </div>

        {/* Interactive Rescan Button on Hover */}
        {revealComplete && (
          <button
            onClick={handleReplay}
            title="Replay pixel decode effect"
            className="absolute top-2 right-2 z-30 font-mono text-[9px] px-1.5 py-0.5 bg-black/70 border border-neon/20 text-neon/70 opacity-0 group-hover:opacity-100 hover:text-neon hover:border-neon/60 transition-all duration-200 cursor-pointer"
          >
            ↺ RESCAN
          </button>
        )}
      </div>
    </div>
  );
}
