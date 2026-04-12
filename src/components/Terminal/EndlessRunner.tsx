'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const COLS = 42;
const ROWS = 10;
const PLAYER_COL = 5;
const TILE = 14;          // logical canvas px per cell
const GRAVITY = 36;
const JUMP_V = -15.5;
const BASE_SPEED = 18;

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#000000',
  ground: '#14532d',
  groundT: '#71FC7B',
  obs: '#dc2626',
  obsD: '#7f1d1d',
  obsH: '#fca5a5',
  player: '#71FC7B',
  playerE: '#000000',
  playerD: '#166534',
  dead: '#ef4444',
  star1: 'rgba(113,252,123,0.45)',
  star2: 'rgba(113,252,123,0.18)',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Obstacle { x: number }
interface Star { col: number; row: number; speed: number; size: number }

interface GameState {
  playerY: number;
  vy: number;
  onGround: boolean;
  obstacles: Obstacle[];
  gapTimer: number;
  speed: number;
  dist: number;
  score: number;
  streak: number;
  dead: boolean;
  stars: Star[];
}

interface EndlessRunnerProps {
  /** Called when the player exits with their final score */
  onExit?: (score: number) => void;
  /** Optional CSS class for the outermost wrapper */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EndlessRunner({ onExit, className = '' }: EndlessRunnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTRef = useRef<number>(0);
  const hiRef = useRef<number>(0);
  const comboTimRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hudScore, setHudScore] = useState('00000');
  const [hudSpd, setHudSpd] = useState('x1.0');
  const [hudStreak, setHudStreak] = useState('0');
  const [hudHi, setHudHi] = useState('00000');
  const [isDead, setIsDead] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalStreak, setFinalStreak] = useState(0);
  const [comboText, setComboText] = useState('');
  const [comboVisible, setComboVisible] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const pad = (n: number, len: number) => n.toString().padStart(len, '0');

  const showCombo = useCallback((n: number) => {
    setComboText(`${n} STREAK!`);
    setComboVisible(true);
    if (comboTimRef.current) clearTimeout(comboTimRef.current);
    comboTimRef.current = setTimeout(() => setComboVisible(false), 900);
  }, []);

  const makeStars = (): Star[] =>
    Array.from({ length: 28 }, () => ({
      col: Math.random() * COLS,
      row: Math.random() * (ROWS - 3),
      speed: 0.04 + Math.random() * 0.08,
      size: Math.random() < 0.4 ? 2 : 1,
    }));

  const initState = (): GameState => ({
    playerY: ROWS - 1, vy: 0, onGround: true,
    obstacles: [], gapTimer: 0,
    speed: BASE_SPEED, dist: 0, score: 0, streak: 0,
    dead: false, stars: makeStars(),
  });

  // ── Render (pixel art) ───────────────────────────────────────────────────
  const render = useCallback((gs: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const T = TILE;
    const gr = ROWS - 1;

    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scanlines
    for (let r = 0; r < ROWS; r += 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.012)';
      ctx.fillRect(0, r * T, canvas.width, T);
    }

    // Stars
    for (const s of gs.stars) {
      ctx.fillStyle = s.size === 2 ? C.star1 : C.star2;
      ctx.fillRect(Math.round(s.col * T), Math.round(s.row * T), s.size, s.size);
    }

    // Ground
    for (let c = 0; c < COLS; c++) {
      ctx.fillStyle = C.ground;
      ctx.fillRect(c * T, gr * T, T, T);
      ctx.fillStyle = C.groundT;
      ctx.fillRect(c * T, gr * T, T, 2);
    }

    // Obstacles
    for (const o of gs.obstacles) {
      const ox = Math.round(o.x * T);
      const oy = gr * T;
      ctx.fillStyle = C.obs;
      ctx.fillRect(ox, oy, T, T);
      ctx.fillStyle = C.obsD;
      ctx.fillRect(ox + T - 3, oy + 2, 3, T - 2);
      ctx.fillStyle = C.obsH;
      ctx.fillRect(ox, oy, T - 1, 2);
      ctx.fillRect(ox, oy, 2, T - 1);
    }

    // Player — continuous float Y = smooth arc
    const px = PLAYER_COL * T;
    const py = gs.playerY * T;   // ← no rounding before multiply

    if (gs.dead) {
      ctx.fillStyle = C.dead;
      ctx.fillRect(Math.round(px), Math.round(py), T, T);
      ctx.fillStyle = '#000';
      ctx.fillRect(Math.round(px) + 2, Math.round(py) + 2, 3, 3);
      ctx.fillRect(Math.round(px) + T - 5, Math.round(py) + 2, 3, 3);
      ctx.fillRect(Math.round(px) + 2, Math.round(py) + T - 5, 3, 3);
      ctx.fillRect(Math.round(px) + T - 5, Math.round(py) + T - 5, 3, 3);
    } else {
      ctx.fillStyle = C.player;
      ctx.fillRect(Math.round(px), Math.round(py), T, T);
      ctx.fillStyle = C.playerD;
      ctx.fillRect(Math.round(px), Math.round(py) + T - 3, T, 3);
      ctx.fillStyle = C.playerE;
      ctx.fillRect(Math.round(px) + T - 4, Math.round(py) + 3, 2, 2);
      // Leg animation
      if (gs.onGround) {
        const legPhase = Math.floor(gs.dist * 0.5) % 2;
        ctx.fillStyle = C.playerD;
        ctx.fillRect(Math.round(px) + (legPhase === 0 ? 2 : T - 5), Math.round(py) + T, 3, 3);
      }
    }
  }, []);

  // ── Update ───────────────────────────────────────────────────────────────
  const update = useCallback((gs: GameState, dt: number): boolean => {
    gs.vy += GRAVITY * dt;
    gs.playerY += gs.vy * dt;
    if (gs.playerY >= ROWS - 1) {
      gs.playerY = ROWS - 1; gs.vy = 0; gs.onGround = true;
    } else {
      gs.onGround = false;
    }

    for (const o of gs.obstacles) o.x -= gs.speed * dt;

    const before = gs.obstacles.length;
    gs.obstacles = gs.obstacles.filter(o => o.x > -1.5);
    const cleared = before - gs.obstacles.length;
    if (cleared > 0) {
      gs.streak += cleared;
      if (gs.streak % 5 === 0) showCombo(gs.streak);
    }

    gs.gapTimer += dt;
    if (gs.gapTimer * gs.speed > gs.speed * 1.05) {
      if (Math.random() < 1.5 * dt) {
        gs.obstacles.push({ x: COLS + 1 });
        gs.gapTimer = 0;
      }
    }

    // Collision
    const playerOnGround = gs.playerY >= ROWS - 1.5;
    const hit = playerOnGround && gs.obstacles.some(o => Math.abs(o.x - PLAYER_COL) < 0.72);
    if (hit) return false; // dead

    gs.dist += gs.speed * dt;
    gs.score = Math.floor(gs.dist);
    gs.speed += 0.22 * dt;

    for (const s of gs.stars) {
      s.col -= s.speed * gs.speed * dt;
      if (s.col < 0) { s.col = COLS; s.row = Math.random() * (ROWS - 3); }
    }

    return true; // alive
  }, [showCombo]);

  // ── Game loop ────────────────────────────────────────────────────────────
  const loop = useCallback((t: number) => {
    const gs = gsRef.current;
    if (!gs || gs.dead) return;

    if (!lastTRef.current) { lastTRef.current = t; rafRef.current = requestAnimationFrame(loop); return; }
    const dt = Math.min((t - lastTRef.current) / 1000, 0.09);
    lastTRef.current = t;

    const alive = update(gs, dt);

    if (!alive) {
      gs.dead = true;
      render(gs);
      if (gs.score > hiRef.current) {
        hiRef.current = gs.score;
        try { localStorage.setItem('runner_hi', String(gs.score)); } catch (_) { }
      }
      setFinalScore(gs.score);
      setFinalStreak(gs.streak);
      setIsDead(true);
      return;
    }

    render(gs);

    setHudScore(pad(gs.score, 5));
    setHudSpd(`x${(gs.speed / BASE_SPEED).toFixed(1)}`);
    setHudStreak(String(gs.streak));
    setHudHi(pad(Math.max(hiRef.current, gs.score), 5));

    rafRef.current = requestAnimationFrame(loop);
  }, [update, render]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    gsRef.current = initState();
    lastTRef.current = 0;
    setIsDead(false);
    setHudScore('00000'); setHudSpd('x1.0'); setHudStreak('0');
    setHudHi(pad(hiRef.current, 5));
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const jump = useCallback(() => {
    const gs = gsRef.current;
    if (!gs || gs.dead) return;
    if (gs.onGround) { gs.vy = JUMP_V; gs.onGround = false; }
  }, []);

  const handleJumpOrRestart = useCallback(() => {
    if (gsRef.current?.dead) resetGame(); else jump();
  }, [resetGame, jump]);

  // ── Mount: set up canvas size, hi-score, start loop ──────────────────────
  useEffect(() => {
    try {
      const s = localStorage.getItem('runner_hi');
      if (s) hiRef.current = parseInt(s) || 0;
    } catch (_) { }

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = COLS * TILE;
      canvas.height = ROWS * TILE;
    }

    resetGame();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        handleJumpOrRestart();
      }
      if ((e.key === 'r' || e.key === 'R') && gsRef.current?.dead) resetGame();
      if ((e.key === 'q' || e.key === 'Q' || e.key === 'Escape') && onExit) {
        onExit(gsRef.current?.score ?? 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleJumpOrRestart, resetGame, onExit]);

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#0a0a0a] text-neon font-mono select-none p-4 md:p-6 ${className}`}
    >
      {/* Terminal window */}
      <div className="w-full max-w-2xl border border-neon/30 bg-[#0d0d0d] rounded-sm p-5">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-neon/20 pb-2 mb-4 text-xs text-neon/60">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2">runner.exe — retro mode</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="opacity-60">root@sys:~</span>
            {onExit && (
              <button
                onClick={() => onExit(gsRef.current?.score ?? 0)}
                className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-red-500/10 hover:bg-red-500/25 border border-red-500/40 text-red-400 rounded-sm transition-colors active:scale-95"
                aria-label="Exit game"
              >
                ✕ EXIT
              </button>
            )}
          </div>
        </div>

        {/* HUD */}
        <div className="flex justify-between text-[11px] font-bold tracking-widest text-neon/80 mb-1.5 px-0.5">
          <span>SCORE: <span className="text-neon">{hudScore}</span></span>
          <span>SPD: <span className="text-neon">{hudSpd}</span></span>
          <span>STREAK: <span className="text-neon">{hudStreak}</span></span>
          <span>HI: <span className="text-neon">{hudHi}</span></span>
        </div>

        {/* Canvas wrapper */}
        <div
          className="relative border border-neon/40 bg-black overflow-hidden w-full cursor-pointer"
          onTouchStart={(e) => { e.preventDefault(); handleJumpOrRestart(); }}
          onClick={handleJumpOrRestart}
        >
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
            }}
          />

          {/* Combo flash */}
          <div
            className="absolute top-1.5 right-2 z-20 text-[10px] font-bold tracking-widest text-neon pointer-events-none transition-opacity duration-200"
            style={{ opacity: comboVisible ? 1 : 0 }}
          >
            {comboText}
          </div>

          {/* Pixel canvas — small logical size, CSS upscaled → pixelated */}
          <canvas
            ref={canvasRef}
            className="block w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Controls / Game over */}
        <div className="mt-3 flex flex-col items-center justify-center gap-3 min-h-[90px]">
          {isDead ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="text-[13px] font-bold tracking-[0.18em] text-neon border border-neon/45 px-5 py-1"
                style={{ animation: 'runner-blink 0.9s step-end infinite' }}
              >
                SYSTEM FAILURE // GAME OVER
              </div>
              <div className="text-[11px] tracking-widest text-neon/60">
                FINAL: {pad(finalScore, 5)} &nbsp;&bull;&nbsp; STREAK: {finalStreak}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetGame}
                  className="px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase bg-neon/10 hover:bg-neon/20 border border-neon/45 text-neon rounded-sm transition-colors active:scale-95"
                >
                  ↺ RESTART [SPACE]
                </button>
                {onExit && (
                  <button
                    onClick={() => onExit(finalScore)}
                    className="px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase bg-red-500/10 hover:bg-red-500/20 border border-red-500/45 text-red-400 rounded-sm transition-colors active:scale-95"
                  >
                    EXIT [Q]
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Jump button + hint */}
              <button
                onClick={handleJumpOrRestart}
                className="w-16 h-16 rounded-sm bg-neon/10 hover:bg-neon/20 border border-neon/45 text-neon text-2xl flex items-center justify-center transition-all active:scale-90"
                aria-label="Jump"
              >
                ↑
              </button>
              <span className="text-[10px] tracking-widest text-neon/38 uppercase">
                [SPACE] / [W] / TAP TO JUMP &nbsp;&bull;&nbsp; [R] RESTART
                {onExit && ' \u2022 [Q] EXIT'}
              </span>
            </>
          )}
        </div>

      </div>

      <style>{`
        @keyframes runner-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
