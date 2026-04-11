'use client';

import React, { useEffect, useRef, useState } from 'react';

const FIRE_COLORS = [
  '#000000', '#1f0707', '#2f0f07', '#470f07',
  '#571707', '#671f07', '#771f07', '#8f2707',
  '#9f2f07', '#af3f07', '#bf4707', '#c74707',
  '#DF4F07', '#DF5707', '#DF5707', '#D75F07',
  '#D7670F', '#cf6f0f', '#cf770f', '#cf7f0f',
  '#CF8717', '#C78717', '#C78F17', '#C7971F',
  '#BF9F1F', '#BF9F1F', '#BFA727', '#BFA727',
  '#BFAF2F', '#B7AF2F', '#B7B72F', '#B7B737',
  '#CFCF6F', '#DFDF9F', '#EFEFC7', '#FFFFFF'
];

const CHARS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface MatrixFireProps {
  width?: number;
  height?: number;
  fontSize?: number;
  fullContainer?: boolean;
}

export default function MatrixFire({ width = 450, height = 250, fontSize = 12, fullContainer = false }: MatrixFireProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  useEffect(() => {
    if (!fullContainer || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        // Optional: debounce or just set directly
        setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fullContainer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // For full container, we might want background transparency or just black
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const currentWidth = fullContainer ? dimensions.width || width : width;
    const currentHeight = fullContainer ? dimensions.height || height : height;

    const cols = Math.floor(currentWidth / fontSize);
    const rows = Math.floor(currentHeight / fontSize);
    const firePixels = new Array(cols * rows).fill(0);

    // Initial setup for the bottom row
    for (let i = 0; i < cols; i++) {
      firePixels[(rows - 1) * cols + i] = 35;
    }

    const calculateFire = () => {
      for (let x = 0; x < cols; x++) {
        for (let y = 1; y < rows; y++) {
          const src = y * cols + x;
          const pixel = firePixels[src];
          if (pixel === 0) {
            firePixels[src - cols] = 0;
          } else {
            // Decay randomizer
            const randIdx = Math.floor(Math.random() * 3);
            const dst = src - cols - randIdx + 1;
            
            if (dst >= 0) {
              const decay = Math.random() > 0.4 ? 1 : 0; 
              firePixels[dst] = Math.max(0, pixel - decay);
            }
          }
        }
      }
    };

    let animationFrameId: number;

    const draw = () => {
      calculateFire();

      // Clear the background
      ctx.fillStyle = fullContainer ? '#050000' : '#000000';
      ctx.fillRect(0, 0, currentWidth, currentHeight);

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';

      // Paint characters
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const intensity = firePixels[y * cols + x];
          if (intensity > 0) {
            ctx.fillStyle = FIRE_COLORS[intensity] || FIRE_COLORS[35];
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            ctx.fillText(char, x * fontSize + fontSize / 2, y * fontSize + fontSize);
          }
        }
      }

      // Restore intensity to bottom row
      for (let i = 0; i < cols; i++) {
          firePixels[(rows - 1) * cols + i] = Math.random() > 0.4 ? 35 : 10;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, fontSize, fullContainer, dimensions]);

  if (fullContainer) {
    return (
      <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
        <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="block w-full h-full" />
      </div>
    );
  }

  return (
    <div className="relative inline-block border border-red-900/40 rounded-lg overflow-hidden bg-black p-1 shadow-[0_0_15px_rgba(255,50,0,0.15)] mt-2">
      <div className="absolute inset-0 bg-linear-to-t from-transparent to-black pointer-events-none opacity-20" />
      <canvas ref={canvasRef} width={width} height={height} className="block rounded-md opacity-90" />
    </div>
  );
}
