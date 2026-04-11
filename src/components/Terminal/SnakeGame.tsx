'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, X as CloseIcon } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onExit: (score: number) => void;
  isMaximized: boolean;
}

const GRID_WIDTH = 25;
const GRID_HEIGHT = 15;
const INITIAL_SPEED = 150;

export default function SnakeGame({ onExit, isMaximized }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 7 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(50, s - 2)); 
      } else {
        newSnake.pop(); 
      }

      lastDirectionRef.current = direction;
      return newSnake;
    });
  }, [direction, food, generateFood]);

  useEffect(() => {
    if (isGameOver) return;
    
    gameLoopRef.current = setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed, isGameOver]);

  const changeDirection = useCallback((newDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const currentDir = lastDirectionRef.current;
    if (newDir === 'UP' && currentDir !== 'DOWN') setDirection('UP');
    if (newDir === 'DOWN' && currentDir !== 'UP') setDirection('DOWN');
    if (newDir === 'LEFT' && currentDir !== 'RIGHT') setDirection('LEFT');
    if (newDir === 'RIGHT' && currentDir !== 'LEFT') setDirection('RIGHT');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver && e.key.toLowerCase() === 'r') {
        resetGame();
        return;
      }
      if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
        onExit(score);
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') changeDirection('UP');
      if (key === 'arrowdown' || key === 's') changeDirection('DOWN');
      if (key === 'arrowleft' || key === 'a') changeDirection('LEFT');
      if (key === 'arrowright' || key === 'd') changeDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, onExit, score, changeDirection]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }]);
    setFood({ x: 15, y: 7 });
    setDirection('RIGHT');
    lastDirectionRef.current = 'RIGHT';
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let row = '';
      for (let x = 0; x < GRID_WIDTH; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;

        if (isSnakeHead) row += '▣';
        else if (isSnakeBody) row += '■';
        else if (isFood) row += '★';
        else row += '·';
      }
      grid.push(<div key={y} className="leading-tight">{row}</div>);
    }
    return grid;
  };

  return (
    <div className="flex flex-col items-center justify-between h-full text-green-500 font-mono select-none py-2">
      <div className="mb-2 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-0 shadow-green-500/20 drop-shadow-lg">TERMINAL_SNAKE</h2>
        <div className="text-xs sm:text-sm text-gray-400 font-bold">
          Score: <span className="text-yellow-400">{score}</span>
        </div>
      </div>

      <div className="relative border border-gray-700 p-1 sm:p-2 bg-black/50 shadow-inner rounded overflow-hidden">
        <div className="text-[0.8rem] sm:text-[1.2rem] md:text-[1.5rem] tracking-[0.2em] sm:tracking-[0.3em] font-bold">
          {renderGrid()}
        </div>
      </div>

      <div className="w-full max-w-[200px] mt-4 flex flex-col items-center gap-1">
        {isGameOver ? (
          <div className="flex gap-4">
             <button 
              onClick={resetGame}
              className="flex flex-col items-center gap-1 p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all active:scale-95"
            >
              <RotateCcw size={24} className="text-yellow-400" />
              <span className="text-[10px] text-gray-400 uppercase">Restart</span>
            </button>
            <button 
              onClick={() => onExit(score)}
              className="flex flex-col items-center gap-1 p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all active:scale-95"
            >
              <CloseIcon size={24} className="text-red-400" />
              <span className="text-[10px] text-gray-400 uppercase">Exit</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button 
              onClick={() => changeDirection('UP')}
              className="p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg border border-gray-600 active:scale-95 transition-all flex justify-center"
            >
              <ChevronUp size={24} />
            </button>
            <div />
            
            <button 
              onClick={() => changeDirection('LEFT')}
              className="p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg border border-gray-600 active:scale-95 transition-all flex justify-center"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => changeDirection('DOWN')}
              className="p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg border border-gray-600 active:scale-95 transition-all flex justify-center"
            >
              <ChevronDown size={24} />
            </button>
            <button 
              onClick={() => changeDirection('RIGHT')}
              className="p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg border border-gray-600 active:scale-95 transition-all flex justify-center"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {!isGameOver && (
        <div className="mt-2 text-[10px] text-gray-500 uppercase flex gap-4 hidden sm:flex">
          <span>WASD to move</span>
          <span>ESC to exit</span>
        </div>
      )}
    </div>
  );
}
