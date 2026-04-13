'use client';

export type GameId = 'runner' | 'tetris';

export interface ScoreEntry {
  name: string;
  score: number;
  date: string; // ISO date string
}

const MAX_ENTRIES = 5;
const boardCache: Partial<Record<GameId, ScoreEntry[]>> = {};

/** Fetch the top-5 leaderboard for a game from Edge Config via API. */
export async function fetchHighScores(game: GameId): Promise<ScoreEntry[]> {
  const cached = boardCache[game];
  try {
    const res = await fetch(`/api/highscores?game=${game}&_=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const scores = await res.json();
      if (Array.isArray(scores)) {
        boardCache[game] = scores;
        return scores;
      }
    }
  } catch (error) {
    console.error('Failed to fetch high scores', error);
  }

  return cached ?? [];
}

/**
 * Submit a new score to the API. 
 * Returns the updated leaderboard and the rank (1-based), or null if not in top-5.
 */
export async function submitHighScore(
  game: GameId,
  name: string,
  score: number
): Promise<{ board: ScoreEntry[]; rank: number | null }> {
  const cached = boardCache[game] ?? [];
  try {
    const res = await fetch('/api/highscores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game, name, score }),
    });
    
    if (res.ok) {
      const result = await res.json();
      if (Array.isArray(result?.board)) {
        boardCache[game] = result.board;
      }
      return result;
    } else {
      console.error('High score submission failed:', await res.text());
    }
  } catch (error) {
    console.error('Failed to submit high score', error);
  }
  
  // Return cached board on error so UI still shows the latest known entries.
  return { board: cached, rank: null };
}

/** Utility to check if a score qualifies locally given an existing board. */
export function checkQualifiesLocal(board: ScoreEntry[], score: number): boolean {
  if (score < 0) return false;
  if (board.length < MAX_ENTRIES) return true;
  return score > board[board.length - 1].score;
}
