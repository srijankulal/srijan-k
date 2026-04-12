'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { X, Maximize2, Minimize2, Terminal as TerminalIcon } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { projectsQuery } from '@/sanity/lib/queries';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import MatrixFire from './MatrixFire';
import SnakeGame from './SnakeGame';
import EndlessRunner from './EndlessRunner';
import Tetris from './Tetris';
import { fetchHighScores, type ScoreEntry } from './useHighScores';

// Define types for terminal lines
type LineType = 'input' | 'output' | 'error';

interface TerminalLine {
  id: string;
  type: LineType;
  content: React.ReactNode;
}

const COMMANDS = [
  { cmd: 'help', desc: 'List available commands' },
  { cmd: 'about', desc: 'Display user information' },
  { cmd: 'projects', desc: 'List my projects' },
  { cmd: 'skills', desc: 'List my technical skills' },
  { cmd: 'contact', desc: 'Show contact details' },
  { cmd: 'fire', desc: 'Toggle terminal fire mode' },
  { cmd: 'runner', desc: 'Play endless runner game' },
  { cmd: 'highscores', desc: 'Show top-5 leaderboards for all games' },
  { cmd: 'clear', desc: 'Clear the terminal screen' },
  { cmd: 'exit', desc: 'Close terminal mode' },
];

export default function TerminalMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: 'welcome', type: 'output', content: 'Welcome to Portfolio Terminal v0.6.7. Type "help" to get started.' }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFireMode, setIsFireMode] = useState(false);
  const [isRunnerActive, setIsRunnerActive] = useState(false);
  const [isTetrisActive, setIsTetrisActive] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);
  const { theme, setTheme } = useTheme();

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input when clicked or opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    // Add command to history (visual)
    const newHistory = [...history, { id: Date.now().toString(), type: 'input' as const, content: cmd }];
    setHistory(newHistory);

    // Add to command recall history
    if (trimmedCmd) {
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    setIsProcessing(true);

    let output: React.ReactNode = '';
    let type: LineType = 'output';

    switch (trimmedCmd) {
      case 'help':
        output = (
          <div className="grid grid-cols-[100px_1fr] gap-2">
            {COMMANDS.map(c => (
              <React.Fragment key={c.cmd}>
                <span className="text-yellow-400">{c.cmd}</span>
                <span className="text-gray-300 text-sm">- {c.desc}</span>
              </React.Fragment>
            ))}
          </div>
        );
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setIsFireMode(false);
        setIsProcessing(false);
        return;

      case 'exit':
        setIsOpen(false);
        setIsFireMode(false);
        setIsProcessing(false);
        return;
      case 'mode':
      case 'theme':
        setTheme(theme === 'dark' ? 'light' : 'dark');
        output = `Toggled theme!`;
        break;
      case 'light':
      case 'lightmode':
        setTheme('light');
        output = 'Switched to Light mode';
        break;
      case 'dark':
      case 'darkmode':
        setTheme('dark');
        output = 'Switched to Dark mode';
        break;
      case 'fire':
        setIsFireMode(prev => !prev);
        output = 'Toggled terminal fire mode.';
        break;
      case 'snake':
        output = 'Snake is disabled. Try "runner" for the new game!';
        break;
      case 'runner':
      case 'game':
        setIsRunnerActive(true);
        output = 'Starting Runner Game...';
        break;

      case 'highscores':
      case 'leaderboard': {
        const loadingContent = <span className="animate-pulse text-gray-400">Connecting to global databank...</span>;
        setHistory([...newHistory, { id: 'fetching-scores', type: 'output', content: loadingContent }]);

        try {
          const [runnerBoard, tetrisBoard] = await Promise.all([
            fetchHighScores('runner'),
            fetchHighScores('tetris')
          ]);

          const medal = ['🥇', '🥈', '🥉', '4.', '5.'];
          const renderBoard = (board: ScoreEntry[]) =>
            board.length === 0
              ? <span className="text-gray-500 text-xs">No scores yet</span>
              : board.map((e, i) => (
                <div key={i} className="flex gap-4 font-mono text-xs">
                  <span>{medal[i]}</span>
                  <span className="text-yellow-300 w-28">{e.name.toUpperCase()}</span>
                  <span className="text-green-400">{e.score.toString().padStart(6, '0')}</span>
                  <span className="text-gray-500">{e.date}</span>
                </div>
              ));
          output = (
            <div className="flex flex-col gap-3 mt-1">
              <div>
                <div className="text-neon font-bold tracking-widest text-xs mb-1">🏃 ENDLESS RUNNER</div>
                {renderBoard(runnerBoard)}
              </div>
              <div>
                <div className="text-neon font-bold tracking-widest text-xs mb-1">🧱 TETRIS</div>
                {renderBoard(tetrisBoard)}
              </div>
            </div>
          );
        } catch (error) {
          type = 'error';
          output = 'Failed to fetch global high scores from edge config.';
        }

        // Remove loading state and show result
        setHistory(prev => prev.filter(p => p.id !== 'fetching-scores').concat({ id: Date.now().toString() + 'res', type, content: output }));
        setIsProcessing(false);
        return;
      }
      case 'about':
        output = (
          <div>
            <p className="mb-2">Hello! I'm Srijan K, a passionate software developer.</p>
            <p>I specialize in Python, Flutter, and Next.js, building scalable and interactive applications.</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="flex flex-wrap gap-2">
            {['Python', 'Flutter', 'Next.js', 'React', 'TypeScript', 'Node.js', 'TailwindCSS', 'Git'].map(skill => (
              <span key={skill} className="bg-gray-700 text-cyan-300 px-2 py-0.5 rounded text-xs">{skill}</span>
            ))}
          </div>
        );
        break;
      case 'gaysex 67':
        setIsTetrisActive(true);
        break;
      case 'gaysex': {
        const newCount = easterEggCount + 1;
        setEasterEggCount(newCount);
        if (newCount >= 10) {
          setEasterEggCount(0);
          output = (
            <div className="text-neon font-bold animate-pulse">
              😏 Take here u go...
            </div>
          );
          setTimeout(() => {
            setIsTetrisActive(true);
          }, 800);
        } else {
          output = (
            <div>
              <p className="mb-1 text-yellow-400">Shut up jon. </p>
              {newCount >= 7 && <p className="text-neon/60 text-xs">...you&apos;re getting close to something 👀</p>}
            </div>
          );
        }
        break;
      }
      case 'projects':
        try {
          output = <div className='animate-pulse text-gray-400'>Fetching projects from Sanity CMS...</div>;
          // Optimistic update
          setHistory([...newHistory, { id: 'fetching', type: 'output', content: output }]);

          const projects = await client.fetch(projectsQuery);

          output = (
            <div className="flex flex-col gap-4 mt-2">
              {projects.map((p: any) => (
                <div key={p._id} className="border-l-2 border-green-500 pl-3">
                  <div className="text-green-400 font-bold">{p.title}</div>
                  <div className="text-gray-300 text-sm mb-1">{p.description}</div>
                  <div className="flex gap-2 text-xs">
                    {p.link && <a href={p.link} target="_blank" className="text-blue-400 hover:universe">[Code]</a>}
                    {p.live && <a href={p.live} target="_blank" className="text-blue-400 hover:universe">[Live]</a>}
                  </div>
                </div>
              ))}
            </div>
          );

          // Remove the loading message and add result
          setHistory(prev => prev.filter(p => p.id !== 'fetching').concat({ id: Date.now().toString() + 'res', type: 'output', content: output }));
          setIsProcessing(false);
          return;

        } catch (error) {
          type = 'error';
          output = 'Failed to fetch projects. Please try again.';
        }
        break;

      case 'contact':
        output = (
          <div>
            <div>Email: <a href="mailto:srijankulal1010@gmail.com" className="text-blue-400 underline">srijankulal1010@gmail.com</a></div>
            <div>GitHub: <a href="https://github.com/srijankulal" target="_blank" className="text-blue-400 underline">github.com/srijankulal</a></div>
          </div>
        );
        break;

      case '':
        output = '';
        break;

      default:
        type = 'error';
        output = `Command not found: ${trimmedCmd}. Type "help" for a list of commands.`;
    }

    if (output) {
      setHistory(prev => [...prev, { id: Date.now().toString() + 'res', type, content: output }]);
    }

    setIsProcessing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 z-50 p-3 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 rounded-lg shadow-lg text-neutral-400 hover:text-white transition-all duration-300 group"
            >
              <TerminalIcon size={20} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={10} className="bg-neutral-800 border-neutral-700 text-neutral-200">
            <p>Terminal Mode</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isMaximized ? '100vw' : '800px',
              height: isMaximized ? '100vh' : '600px',
              borderRadius: isMaximized ? 0 : '12px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed z-[100] bg-black/90 backdrop-blur-md text-green-500 font-mono shadow-2xl border border-gray-700 overflow-hidden flex flex-col ${isMaximized ? 'top-0 left-0 bottom-0 right-0' : 'bottom-10 right-10 max-w-[calc(100vw-40px)] max-h-[calc(100vh-40px)]'
              }`}
          >
            {isFireMode && <MatrixFire fullContainer fontSize={14} />}
            {/* Header / Title Bar */}
            <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400" onClick={() => setIsOpen(false)}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer hover:bg-yellow-400" onClick={() => setIsMaximized(!isMaximized)}></div>
                <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:bg-green-400" onClick={() => setIsMaximized(!isMaximized)}></div>
                <span className="ml-3 text-xs text-gray-400 flex items-center gap-1">
                  <TerminalIcon size={12} /> srijan@portfolio:~
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <button onClick={() => setIsMaximized(!isMaximized)} className="hover:text-white transition-colors">
                  {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent bg-transparent" onClick={() => !isRunnerActive && inputRef.current?.focus()}>
              {isRunnerActive ? (
                <EndlessRunner
                  onExit={(score) => {
                    setIsRunnerActive(false);
                    setHistory(prev => [...prev, { id: Date.now().toString(), type: 'output', content: `Run Ended. Distance covered: ${score}m` }]);
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                />
              ) : (
                <>
                  {history.map((line) => (
                    <div key={line.id} className="mb-2 break-all">
                      {line.type === 'input' ? (
                        <div className="flex">
                          <span className="text-blue-500 mr-2 font-bold">➜</span>
                          <span className="text-pink-500 mr-2">~</span>
                          <span className="text-gray-100">{line.content}</span>
                        </div>
                      ) : line.type === 'error' ? (
                        <div className="text-red-500">{line.content}</div>
                      ) : (
                        <div className="text-gray-300 ml-6">{line.content}</div>
                      )}
                    </div>
                  ))}

                  {/* Input Area */}
                  <div className="flex items-center mt-2 group">
                    <span className="text-blue-500 mr-2 font-bold">➜</span>
                    <span className="text-pink-500 mr-2">~</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      className="bg-transparent border-none outline-none flex-1 text-gray-100 font-mono caret-green-500"
                      autoFocus
                      disabled={isProcessing}
                    />
                  </div>
                </>
              )}
              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tetris modal — fullscreen popup above everything */}
      <AnimatePresence>
        {isTetrisActive && (
          <motion.div
            key="tetris-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setIsTetrisActive(false);
                setHistory(prev => [...prev, { id: Date.now().toString(), type: 'output', content: `🎮 Tetris ended.` }]);
              }}
            />
            {/* Modal card */}
            <div className="relative z-10 w-fit max-w-[95vw] max-h-[95vh] overflow-y-auto rounded-lg bg-[#0a0a0a] border border-neon/30 shadow-[0_0_60px_rgba(113,252,123,0.15)] flex flex-col">
              <Tetris
                onExit={(score) => {
                  setIsTetrisActive(false);
                  setHistory(prev => [...prev, { id: Date.now().toString(), type: 'output', content: `🎮 Tetris ended. Final score: ${score}` }]);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
