'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchHighScores, submitHighScore, checkQualifiesLocal, type GameId, type ScoreEntry } from './useHighScores';

interface HighScoreModalProps {
  game: GameId;
  score: number;
  /** Label shown e.g. "Distance: 420m" or "Score: 8400" */
  scoreLabel?: string;
  /** True if the user has already answered or we want to force display-only */
  isReadOnly?: boolean;
  /** Called when the user dismisses the modal */
  onClose: () => void;
  /** Called to restart the game directly from the modal */
  onRestart: () => void;
  /** Called when the player successfully saves or skips their score */
  onSubmitted?: () => void;
}

const GAME_TITLE: Record<GameId, string> = {
  runner: 'ENDLESS RUNNER',
  tetris: 'TETRIS',
};

const MEDAL = ['🥇', '🥈', '🥉', '4.', '5.'];

export default function HighScoreModal({
  game,
  score,
  scoreLabel,
  isReadOnly = false,
  onClose,
  onRestart,
  onSubmitted,
}: HighScoreModalProps) {
  const [phase, setPhase] = useState<'loading' | 'input' | 'board'>('loading');
  const [name, setName] = useState('');
  const [board, setBoard] = useState<ScoreEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHighScores(game).then((b) => {
      setBoard(b);
      const qualifies = !isReadOnly && checkQualifiesLocal(b, score);
      setPhase(qualifies ? 'input' : 'board');
    });
  }, [game, score, isReadOnly]);

  useEffect(() => {
    if (phase === 'input') {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [phase]);

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 1. Optimistic UI update: compute what the board *should* look like locally instantly
    const localEntry: ScoreEntry = {
      name: name.trim().slice(0, 12) || 'ANON',
      score,
      date: new Date().toISOString().slice(0, 10),
    };
    
    const newBoard = [...board, localEntry].sort((a, b) => b.score - a.score).slice(0, 5);
    const newRank = newBoard.indexOf(localEntry);
    
    setBoard(newBoard);
    setPlayerRank(newRank === -1 ? null : newRank + 1);
    setPhase('board');
    if (onSubmitted) onSubmitted();

    // 2. Fire and forget the actual backend request so the user doesn't wait!
    submitHighScore(game, name, score)
      .then((res) => {
        // Optionally reconcile with true backend state if needed
        // setBoard(res.board); 
        // setPlayerRank(res.rank);
      })
      .catch((e) => console.error('Background save failed:', e));
  };

  const pad = (n: number) => n.toString().padStart(6, '0');
  const displayScore = scoreLabel ?? `SCORE: ${pad(score)}`;

  return (
    <AnimatePresence>
      <motion.div
        key="hs-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-300 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

        {/* Card */}
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-sm bg-[#080808] border border-neon/35 rounded-sm shadow-[0_0_40px_rgba(113,252,123,0.18)] font-mono overflow-hidden"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between bg-[#0d0d0d] border-b border-neon/20 px-4 py-2.5">
            <span className="text-[10px] tracking-[0.22em] text-neon/50 font-bold uppercase">
              {GAME_TITLE[game]} // HIGH SCORES
            </span>
            <button
              onClick={onClose}
              className="text-neon/30 hover:text-neon/70 text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="px-5 pb-5 pt-4 flex flex-col gap-4">
            {/* Score display */}
            <div className="text-center">
              {phase === 'loading' && (
                <div className="text-neon/60 text-[11px] tracking-widest mt-1 animate-pulse">CONNECTING TO DATABANK...</div>
              )}
              {phase === 'input' && (
                <div
                  className="text-xs font-bold tracking-[0.2em] text-neon border border-neon/30 px-3 py-1 inline-block mb-1"
                  style={{ animation: 'hs-blink 0.9s step-end infinite' }}
                >
                  NEW HIGH SCORE!
                </div>
              )}
              {phase !== 'loading' && (
                <div className="text-neon/60 text-[11px] tracking-widest mt-1">{displayScore}</div>
              )}
            </div>

            {/* Name input phase */}
            {phase === 'input' && (
              <div className="flex flex-col gap-3">
                <label className="text-[10px] tracking-widest text-neon/40 uppercase">
                  Enter your name (max 12 chars)
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    maxLength={12}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubmit();
                      if (e.key === 'Escape') onClose();
                    }}
                    disabled={isSubmitting}
                    placeholder="YOUR NAME"
                    className="flex-1 bg-black border border-neon/30 focus:border-neon/70 outline-none px-3 py-1.5 text-neon text-sm tracking-widest placeholder-neon/20 rounded-none transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 bg-neon/10 hover:bg-neon/20 border border-neon/40 text-neon text-[11px] tracking-widest font-bold uppercase transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isSubmitting ? '...' : 'SAVE'}
                  </button>
                </div>
                <button
                  onClick={() => { if (onSubmitted) onSubmitted(); setPhase('board'); }}
                  className="text-[10px] text-neon/30 hover:text-neon/60 tracking-widest transition-colors text-center"
                >
                  skip →
                </button>
              </div>
            )}

            {/* Board phase */}
            {phase === 'board' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[9px] tracking-widest text-neon/30 uppercase border-b border-neon/10 pb-1 mb-1">
                  <span>RANK &nbsp; NAME</span>
                  <span>SCORE</span>
                </div>
                {board.length === 0 && (
                  <div className="text-neon/25 text-[11px] tracking-widest text-center py-3">No scores yet</div>
                )}
                {board.map((entry, i) => {
                  const isPlayer = playerRank !== null && i === playerRank - 1;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={`flex items-center justify-between px-2 py-1 rounded-sm text-[12px] font-bold tracking-widest ${
                        isPlayer
                          ? 'bg-neon/10 border border-neon/30 text-neon'
                          : 'text-neon/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 text-center">{MEDAL[i] ?? `${i + 1}.`}</span>
                        <span className={isPlayer ? 'text-neon' : 'text-neon/70'}>
                          {entry.name.toUpperCase()}
                        </span>
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-neon/25 font-normal">{entry.date}</span>
                        <span>{entry.score.toString().padStart(6, '0')}</span>
                      </div>
                    </motion.div>
                  );
                })}
                {/* Fill empty slots */}
                {Array.from({ length: Math.max(0, 5 - board.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex items-center justify-between px-2 py-1 text-[12px] tracking-widest text-neon/15">
                    <span className="flex items-center gap-2">
                      <span className="w-6 text-center">{MEDAL[board.length + i]}</span>
                      <span>---</span>
                    </span>
                    <span>------</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { onRestart(); onClose(); }}
                className="flex-1 py-2 text-[10px] font-bold tracking-widest uppercase bg-neon/8 hover:bg-neon/18 border border-neon/30 text-neon rounded-none transition-all active:scale-95"
              >
                ↺ RESTART
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 text-[10px] font-bold tracking-widest uppercase bg-red-500/8 hover:bg-red-500/18 border border-red-500/30 text-red-400 rounded-none transition-all active:scale-95"
              >
                ✕ EXIT
              </button>
            </div>
          </div>
        </motion.div>

        <style>{`
          @keyframes hs-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
