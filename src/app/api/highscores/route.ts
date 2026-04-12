import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/edge-config';

// ─── Types ────────────────────────────────────────────────────────────────────
export type GameId = 'runner' | 'tetris';

export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

type ScoreMap = Record<GameId, ScoreEntry[]>;

const MAX_ENTRIES = 5;
const EDGE_CONFIG_KEY = 'highscores';

function getEdgeConfigId(): string {
  const url = process.env.EDGE_CONFIG ?? '';
  const match = url.match(/edge-config\.vercel\.com\/([^?]+)/);
  if (match) return match[1];
  if (url && !url.includes('://')) return url; // User just provided the raw ID
  throw new Error('Cannot parse EDGE_CONFIG connection string');
}

async function readScores(): Promise<ScoreMap> {
  const fallback = { runner: [], tetris: [] };

  // Try Edge Config SDK first (requires full connection URL with token)
  if (process.env.EDGE_CONFIG?.includes('https://')) {
    try {
      const client = createClient(process.env.EDGE_CONFIG);
      const data = await client.get<ScoreMap>(EDGE_CONFIG_KEY);
      if (data) return data;
    } catch (e) {
      console.error('Edge SDK read failed:', e);
    }
  }

  // Fallback to Vercel API (useful locally if only ID is provided)
  try {
    const edgeConfigId = getEdgeConfigId();
    const token = process.env.VERCEL_ACCESS_TOKEN;
    if (edgeConfigId && token) {
      const res = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/item/${EDGE_CONFIG_KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const text = await res.text();
        if (!text) return fallback;
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse Vercel API JSON:', e);
          return fallback;
        }
      }
      if (res.status === 404) return fallback; // Item doesn't exist yet
      console.error('Vercel REST API read failed:', await res.text());
    }
  } catch (e) {
    console.error('Fallback read failed:', e);
  }

  return fallback;
}

// ─── GET /api/highscores?game=runner|tetris|all ───────────────────────────────
export async function GET(req: NextRequest) {
  const game = req.nextUrl.searchParams.get('game') as GameId | 'all' | null;
  const scores = await readScores();

  if (game && game !== 'all' && (game === 'runner' || game === 'tetris')) {
    return NextResponse.json(scores[game] ?? [], {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  return NextResponse.json(scores, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

// ─── POST /api/highscores ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: { game: GameId; name: string; score: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { game, name, score } = body;
  if (!game || !['runner', 'tetris'].includes(game)) {
    return NextResponse.json({ error: 'Invalid game' }, { status: 400 });
  }
  if (typeof score !== 'number' || score < 0 || score > 1_000_000) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
  }

  // Read current scores
  const scores = await readScores();
  const board = scores[game] ?? [];

  const entry: ScoreEntry = {
    name: (typeof name === 'string' ? name.trim().slice(0, 12) : '') || 'ANON',
    score,
    date: new Date().toISOString().slice(0, 10),
  };

  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  scores[game] = board.slice(0, MAX_ENTRIES);

  // Rank of the new entry (1-based), null if didn't make it
  const rank = scores[game].findIndex(
    e => e.name === entry.name && e.score === entry.score && e.date === entry.date
  );

  // Write back to Edge Config via Vercel REST API
  const token = process.env.VERCEL_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'VERCEL_ACCESS_TOKEN not set' }, { status: 500 });
  }

  let edgeConfigId: string;
  try {
    edgeConfigId = getEdgeConfigId();
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const patchRes = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ operation: 'upsert', key: EDGE_CONFIG_KEY, value: scores }],
      }),
    }
  );

  if (!patchRes.ok) {
    const err = await patchRes.text();
    return NextResponse.json({ error: `Edge Config write failed: ${err}` }, { status: 500 });
  }

  return NextResponse.json({
    board: scores[game],
    rank: rank === -1 ? null : rank + 1,
  });
}
