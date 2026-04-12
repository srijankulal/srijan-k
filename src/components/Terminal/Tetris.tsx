'use client';

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';

// ─── Board ────────────────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 20;

// ─── Tetrominoes ──────────────────────────────────────────────────────────────
type Shape = [number, number][][];
const PIECES: Shape[] = [
  [[[0,0],[0,1],[0,2],[0,3]],[[0,2],[1,2],[2,2],[3,2]],[[2,0],[2,1],[2,2],[2,3]],[[0,1],[1,1],[2,1],[3,1]]],
  [[[0,0],[0,1],[1,0],[1,1]],[[0,0],[0,1],[1,0],[1,1]],[[0,0],[0,1],[1,0],[1,1]],[[0,0],[0,1],[1,0],[1,1]]],
  [[[0,1],[1,0],[1,1],[1,2]],[[0,1],[1,1],[1,2],[2,1]],[[1,0],[1,1],[1,2],[2,1]],[[0,1],[1,0],[1,1],[2,1]]],
  [[[0,1],[0,2],[1,0],[1,1]],[[0,1],[1,1],[1,2],[2,2]],[[1,1],[1,2],[2,0],[2,1]],[[0,0],[1,0],[1,1],[2,1]]],
  [[[0,0],[0,1],[1,1],[1,2]],[[0,2],[1,1],[1,2],[2,1]],[[1,0],[1,1],[2,1],[2,2]],[[0,1],[1,0],[1,1],[2,0]]],
  [[[0,0],[1,0],[1,1],[1,2]],[[0,1],[0,2],[1,1],[2,1]],[[1,0],[1,1],[1,2],[2,2]],[[0,1],[1,1],[2,0],[2,1]]],
  [[[0,2],[1,0],[1,1],[1,2]],[[0,1],[1,1],[2,1],[2,2]],[[1,0],[1,1],[1,2],[2,0]],[[0,0],[0,1],[1,1],[2,1]]],
];
const PIECE_COLORS = ['#71FC7B','#22d3ee','#a78bfa','#f43f5e','#fb923c','#facc15','#38bdf8'];
const PIECE_DARK   = ['#166534','#164e63','#4c1d95','#881337','#7c2d12','#713f12','#0c4a6e'];
const SCORE_TABLE  = [0, 100, 300, 500, 800];

// ─── Types ────────────────────────────────────────────────────────────────────
type Board  = (number | null)[][];
interface Piece { shape: Shape; rot: number; row: number; col: number; typeIdx: number; }
interface TetrisProps { onExit?: (score: number) => void; className?: string; }

// ─── Pure helpers ─────────────────────────────────────────────────────────────
const emptyBoard  = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
const cells       = (p: Piece) => p.shape[p.rot].map(([r,c]): [number,number] => [r+p.row, c+p.col]);
const isValid     = (b: Board, p: Piece) => cells(p).every(([r,c]) => r>=0 && r<ROWS && c>=0 && c<COLS && b[r][c]===null);
const randomPiece = (): Piece => { const t = Math.floor(Math.random()*PIECES.length); return { shape:PIECES[t], rot:0, row:0, col:3, typeIdx:t }; };

function place(board: Board, p: Piece): Board {
  const b = board.map(r=>[...r]);
  for (const [r,c] of cells(p)) b[r][c] = p.typeIdx;
  return b;
}
function clearLines(board: Board): { board: Board; cleared: number } {
  const kept    = board.filter(row => row.some(c => c===null));
  const cleared = ROWS - kept.length;
  return { board: [...Array.from({length: cleared}, ()=>Array(COLS).fill(null)), ...kept], cleared };
}
const KICKS: [number,number][] = [[0,0],[0,-1],[0,1],[0,-2],[0,2]];
function tryRotate(board: Board, p: Piece, dir: 1|-1): Piece | null {
  const rot = ((p.rot+dir)%4+4)%4;
  for (const [dr,dc] of KICKS) { const np={...p,rot,row:p.row+dr,col:p.col+dc}; if(isValid(board,np)) return np; }
  return null;
}

function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, T: number, idx: number) {
  ctx.fillStyle = PIECE_COLORS[idx];
  ctx.fillRect(x+1, y+1, T-2, T-2);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(x+1, y+1, T-2, 3); ctx.fillRect(x+1, y+1, 3, T-2);
  ctx.fillStyle = PIECE_DARK[idx];
  ctx.fillRect(x+1, y+T-4, T-2, 3); ctx.fillRect(x+T-4, y+1, 3, T-2);
}

/** Compute a tile size that fits the viewport nicely */
function computeTile(): number {
  if (typeof window === 'undefined') return 22;
  // Modal is max 95vh tall. Reserve ~180px for header + d-pad + padding.
  const availH = window.innerHeight * 0.95 - 180;
  const byH    = Math.floor(availH / ROWS);
  return Math.max(16, Math.min(byH, 30));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Tetris({ onExit, className = '' }: TetrisProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const nextRef      = useRef<HTMLCanvasElement>(null);
  const dropTimer    = useRef<ReturnType<typeof setTimeout>|null>(null);
  const hiRef        = useRef(0);
  const tileRef      = useRef(computeTile());

  const stateRef = useRef({
    board: emptyBoard(), current: randomPiece(), next: randomPiece(),
    score:0, lines:0, level:1, dead:false, paused:false,
  });

  const [tile,     setTile]     = useState(() => computeTile());
  const [score,    setScore]    = useState(0);
  const [lines,    setLines]    = useState(0);
  const [level,    setLevel]    = useState(1);
  const [isDead,   setIsDead]   = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hiScore,  setHiScore]  = useState(0);

  // ── Render helpers ──────────────────────────────────────────────────────
  const renderBoard = useCallback(() => {
    const cv = canvasRef.current; if(!cv) return;
    const ctx = cv.getContext('2d'); if(!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const T = tileRef.current;
    const s = stateRef.current;

    ctx.fillStyle='#000'; ctx.fillRect(0,0,cv.width,cv.height);

    // Grid
    ctx.strokeStyle='rgba(113,252,123,0.05)'; ctx.lineWidth=0.5;
    for(let r=0;r<=ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*T);ctx.lineTo(COLS*T,r*T);ctx.stroke();}
    for(let c=0;c<=COLS;c++){ctx.beginPath();ctx.moveTo(c*T,0);ctx.lineTo(c*T,ROWS*T);ctx.stroke();}

    // Ghost
    if(!s.dead){
      let g={...s.current};
      while(isValid(s.board,{...g,row:g.row+1})) g={...g,row:g.row+1};
      for(const [r,c] of cells(g)) if(r>=0){
        ctx.fillStyle='rgba(113,252,123,0.08)'; ctx.fillRect(c*T+1,r*T+1,T-2,T-2);
        ctx.strokeStyle='rgba(113,252,123,0.2)'; ctx.lineWidth=1;
        ctx.strokeRect(c*T+1,r*T+1,T-2,T-2);
      }
    }
    // Board
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){const v=s.board[r][c]; if(v!==null) drawBlock(ctx,c*T,r*T,T,v);}
    // Active
    if(!s.dead) for(const [r,c] of cells(s.current)) if(r>=0) drawBlock(ctx,c*T,r*T,T,s.current.typeIdx);
    // Scanlines
    for(let r=0;r<ROWS;r+=2){ctx.fillStyle='rgba(0,0,0,0.08)'; ctx.fillRect(0,r*T,cv.width,T);}
  }, []);

  const NT = 18;
  const renderNext = useCallback(() => {
    const cv = nextRef.current; if(!cv) return;
    const ctx = cv.getContext('2d'); if(!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle='#000'; ctx.fillRect(0,0,cv.width,cv.height);
    const np = stateRef.current.next;
    const cs = np.shape[0];
    const minR=Math.min(...cs.map(([r])=>r)), maxR=Math.max(...cs.map(([r])=>r));
    const minC=Math.min(...cs.map(([,c])=>c)), maxC=Math.max(...cs.map(([,c])=>c));
    const offR=Math.floor((4-(maxR-minR+1))/2)-minR;
    const offC=Math.floor((4-(maxC-minC+1))/2)-minC;
    for(const [r,c] of cs) drawBlock(ctx,(c+offC)*NT,(r+offR)*NT,NT,np.typeIdx);
  }, []);

  const applyTile = useCallback((t: number) => {
    tileRef.current = t;
    setTile(t);
    const cv = canvasRef.current;
    if(cv){ cv.width=COLS*t; cv.height=ROWS*t; }
    const nc = nextRef.current;
    if(nc){ nc.width=4*NT; nc.height=4*NT; }
  }, []);

  // ── Game logic ──────────────────────────────────────────────────────────
  const dropInterval = useCallback((lvl:number) => Math.max(80,800-(lvl-1)*70),[]);

  const lock = useCallback(() => {
    const s = stateRef.current;
    if(s.dead||s.paused) return;
    const {board,cleared} = clearLines(place(s.board,s.current));
    const ns=s.score+SCORE_TABLE[cleared]*s.level, nl=s.lines+cleared, nv=Math.floor(nl/10)+1;
    if(!isValid(board,s.next)){
      Object.assign(s,{board,current:s.next,score:ns,lines:nl,level:nv,dead:true});
      if(ns>hiRef.current){hiRef.current=ns;try{localStorage.setItem('tetris_hi',String(ns));}catch(_){}}
      setScore(ns); setLines(nl); setLevel(nv); setIsDead(true); setHiScore(hiRef.current);
      renderBoard(); return;
    }
    Object.assign(s,{board,current:s.next,next:randomPiece(),score:ns,lines:nl,level:nv});
    setScore(ns); setLines(nl); setLevel(nv);
    renderBoard(); renderNext();
    scheduleDrop(); // eslint-disable-line
  },[renderBoard,renderNext,dropInterval]); // eslint-disable-line

  const scheduleDrop = useCallback(() => {
    if(dropTimer.current) clearTimeout(dropTimer.current);
    const s=stateRef.current;
    if(s.dead||s.paused) return;
    dropTimer.current = setTimeout(()=>{
      const s=stateRef.current; if(s.dead||s.paused) return;
      const moved={...s.current,row:s.current.row+1};
      if(isValid(s.board,moved)){s.current=moved;renderBoard();scheduleDrop();}
      else lock();
    },dropInterval(stateRef.current.level));
  },[lock,renderBoard,dropInterval]);

  const resetGame = useCallback(()=>{
    if(dropTimer.current) clearTimeout(dropTimer.current);
    stateRef.current={board:emptyBoard(),current:randomPiece(),next:randomPiece(),score:0,lines:0,level:1,dead:false,paused:false};
    setScore(0);setLines(0);setLevel(1);setIsDead(false);setIsPaused(false);
    renderBoard();renderNext();scheduleDrop();
  },[renderBoard,renderNext,scheduleDrop]);

  // ── Mount ───────────────────────────────────────────────────────────────
  useLayoutEffect(()=>{
    try{const h=localStorage.getItem('tetris_hi');if(h){hiRef.current=parseInt(h)||0;setHiScore(hiRef.current);}}catch(_){}
    const t=computeTile();
    applyTile(t);
    resetGame();
    const onResize=()=>{ const t=computeTile(); applyTile(t); renderBoard(); renderNext(); };
    window.addEventListener('resize',onResize);
    return ()=>{window.removeEventListener('resize',onResize);if(dropTimer.current)clearTimeout(dropTimer.current);};
  },[]);// eslint-disable-line

  // ── Keyboard ────────────────────────────────────────────────────────────
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      const s=stateRef.current;
      if(e.key==='Escape'||e.key.toLowerCase()==='q'){onExit?.(s.score);return;}
      if(e.key.toLowerCase()==='r'){resetGame();return;}
      if(e.key.toLowerCase()==='p'||e.key==='Enter'){
        if(s.dead){resetGame();return;}
        s.paused=!s.paused;setIsPaused(s.paused);
        if(!s.paused)scheduleDrop();return;
      }
      if(s.dead||s.paused)return;
      let moved:Piece|null=null;
      if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a'){e.preventDefault();const t={...s.current,col:s.current.col-1};if(isValid(s.board,t))moved=t;}
      else if(e.key==='ArrowRight'||e.key.toLowerCase()==='d'){e.preventDefault();const t={...s.current,col:s.current.col+1};if(isValid(s.board,t))moved=t;}
      else if(e.key==='ArrowDown'||e.key.toLowerCase()==='s'){e.preventDefault();const t={...s.current,row:s.current.row+1};if(isValid(s.board,t)){moved=t;}else{lock();return;}}
      else if(e.key==='ArrowUp'||e.key.toLowerCase()==='w'){e.preventDefault();moved=tryRotate(s.board,s.current,1);}
      else if(e.key.toLowerCase()==='z'){e.preventDefault();moved=tryRotate(s.board,s.current,-1);}
      else if(e.key===' '){
        e.preventDefault();
        let p={...s.current};
        while(isValid(s.board,{...p,row:p.row+1}))p={...p,row:p.row+1};
        s.current=p;renderBoard();lock();return;
      }
      if(moved){s.current=moved;renderBoard();if(e.key==='ArrowDown'||e.key.toLowerCase()==='s')scheduleDrop();}
    };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[lock,scheduleDrop,resetGame,renderBoard,onExit]);

  // ── Mobile control actions ──────────────────────────────────────────────
  const mc = {
    rotL:()=>{const s=stateRef.current;if(!s.dead&&!s.paused){const m=tryRotate(s.board,s.current,-1);if(m){s.current=m;renderBoard();}}},
    rotR:()=>{const s=stateRef.current;if(!s.dead&&!s.paused){const m=tryRotate(s.board,s.current,1);if(m){s.current=m;renderBoard();}}},
    left:()=>{const s=stateRef.current;if(!s.dead&&!s.paused){const t={...s.current,col:s.current.col-1};if(isValid(s.board,t)){s.current=t;renderBoard();}}},
    right:()=>{const s=stateRef.current;if(!s.dead&&!s.paused){const t={...s.current,col:s.current.col+1};if(isValid(s.board,t)){s.current=t;renderBoard();}}},
    down:()=>{const s=stateRef.current;if(!s.dead&&!s.paused){const t={...s.current,row:s.current.row+1};if(isValid(s.board,t)){s.current=t;renderBoard();scheduleDrop();}else lock();}},
    hardDrop:()=>{const s=stateRef.current;if(!s.dead&&!s.paused){let p={...s.current};while(isValid(s.board,{...p,row:p.row+1}))p={...p,row:p.row+1};s.current=p;renderBoard();lock();}},
    pause:()=>{const s=stateRef.current;if(!s.dead){s.paused=!s.paused;setIsPaused(s.paused);if(!s.paused)scheduleDrop();}},
  };

  const pad = (n:number,l:number)=>n.toString().padStart(l,'0');
  const boardW = tile * COLS;
  const boardH = tile * ROWS;

  const DBtn = ({label,fn,cls=''}:{label:string;fn:()=>void;cls?:string})=>(
    <button
      onTouchStart={e=>{e.preventDefault();fn();}}
      onClick={fn}
      className={`bg-neon/10 border border-neon/35 text-neon font-bold active:scale-90 active:bg-neon/25 transition-all select-none flex items-center justify-center ${cls}`}
    >{label}</button>
  );

  return (
    <div className={`flex flex-col bg-[#0a0a0a] text-neon font-mono select-none w-full ${className}`}>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex justify-between items-center border-b border-neon/20 px-4 py-2.5 text-xs text-neon/50 bg-[#0d0d0d] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"/>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"/>
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"/>
          <span className="ml-2 tracking-widest font-bold">tetris.exe</span>
          <span className="opacity-50 hidden sm:inline">— block mode 🎮</span>
        </div>
        {onExit && (
          <button
            onClick={()=>onExit(score)}
            className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-red-500/10 hover:bg-red-500/25 border border-red-500/40 text-red-400 rounded-sm transition-colors active:scale-95"
          >✕ EXIT</button>
        )}
      </div>

      {/* ── Game area: board + side panel ────────────────────── */}
      <div className="flex justify-center gap-3 p-3 shrink-0">

        {/* Board */}
        <div className="relative border border-neon/30 bg-black overflow-hidden shrink-0" style={{width:boardW,height:boardH}}>
          <canvas ref={canvasRef} className="block" style={{imageRendering:'pixelated',width:boardW,height:boardH}}/>

          {isPaused&&!isDead&&(
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
              <div className="text-neon font-bold tracking-[0.2em]">PAUSED</div>
              <div className="text-neon/40 text-[10px] tracking-widest">[P] TO RESUME</div>
            </div>
          )}
          {isDead&&(
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4">
              <div className="text-neon text-xs font-bold tracking-[0.18em] border border-neon/40 px-4 py-1 text-center"
                   style={{animation:'tet-blink 0.9s step-end infinite'}}>
                STACK OVERFLOW
              </div>
              <div className="text-neon/50 text-[10px] tracking-widest">SCORE: {pad(score,6)}</div>
              <button onClick={resetGame}
                      className="px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase bg-neon/10 hover:bg-neon/20 border border-neon/40 text-neon rounded-sm transition-colors active:scale-95">
                ↺ RESTART
              </button>
              {onExit&&(
                <button onClick={()=>onExit(score)}
                        className="px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 rounded-sm transition-colors active:scale-95">
                  EXIT
                </button>
              )}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-2 w-24 shrink-0">
          {([['SCORE',pad(score,6)],['LINES',pad(lines,4)],['LEVEL',pad(level,2)],['BEST',pad(hiScore,6)]] as [string,string][]).map(([l,v])=>(
            <div key={l} className="border border-neon/20 bg-black/40 px-2 py-1.5">
              <div className="text-[8px] tracking-widest text-neon/40">{l}</div>
              <div className="text-neon text-sm font-bold tracking-widest leading-tight">{v}</div>
            </div>
          ))}
          <div className="border border-neon/20 bg-black/40 p-1.5">
            <div className="text-[8px] tracking-widest text-neon/40 mb-1.5">NEXT</div>
            <canvas ref={nextRef} className="block" style={{imageRendering:'pixelated',width:4*NT,height:4*NT}}/>
          </div>
          <button onClick={mc.pause}
                  className="w-full py-1.5 text-[9px] font-bold tracking-widest uppercase bg-neon/8 hover:bg-neon/15 border border-neon/25 text-neon/70 rounded-sm transition-colors">
            {isPaused?'▶ RESUME':'⏸ PAUSE'}
          </button>
          <button onClick={resetGame}
                  className="w-full py-1.5 text-[9px] font-bold tracking-widest uppercase bg-neon/8 hover:bg-neon/15 border border-neon/25 text-neon/70 rounded-sm transition-colors">
            ↺ RESTART
          </button>
          {/* Keyboard hint – only on big screens */}
          <div className="border border-neon/15 bg-black/30 p-1.5 text-[8px] text-neon/30 leading-[1.8] tracking-wide hidden lg:block mt-1">
            <div>← → &nbsp;MOVE</div>
            <div>↓ &nbsp;&nbsp;&nbsp;SOFT DROP</div>
            <div>↑/W &nbsp;ROTATE</div>
            <div>Z &nbsp;&nbsp;&nbsp;ROT ↺</div>
            <div>SPC &nbsp;HARD DROP</div>
            <div>P &nbsp;&nbsp;&nbsp;PAUSE</div>
            <div>R &nbsp;&nbsp;&nbsp;RESTART</div>
          </div>
        </div>
      </div>

      {/* ── D-Pad (always visible) ────────────────────────────── */}
      <div className="flex flex-col items-center gap-2 px-4 pb-4 shrink-0">
        {/* Rotate row */}
        <div className="flex gap-2">
          <DBtn label="↺" fn={mc.rotL} cls="w-12 h-12 rounded-sm text-xl"/>
          <DBtn label="↑" fn={mc.rotR} cls="w-12 h-12 rounded-sm text-xl"/>
        </div>
        {/* D-pad row */}
        <div className="flex gap-2">
          <DBtn label="←" fn={mc.left}  cls="w-12 h-12 rounded-sm text-xl"/>
          <DBtn label="↓" fn={mc.down}  cls="w-12 h-12 rounded-sm text-xl"/>
          <DBtn label="→" fn={mc.right} cls="w-12 h-12 rounded-sm text-xl"/>
        </div>
        {/* Action row */}
        <div className="flex gap-2 w-full max-w-[280px]">
          <DBtn label="⬇ HARD DROP" fn={mc.hardDrop} cls="flex-1 h-10 rounded-sm text-xs tracking-widest"/>
          <DBtn label={isPaused?'▶':'⏸'} fn={mc.pause} cls="w-10 h-10 rounded-sm text-lg"/>
        </div>
      </div>

      <style>{`@keyframes tet-blink{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
    </div>
  );
}
