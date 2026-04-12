'use client';

export type GameId = 'runner' | 'tetris';

export interface ScoreEntry {
  name: string;
  score: number;
  date: string; // ISO date string
}

const MAX_ENTRIES = 5;

/** Fetch the top-5 leaderboard for a game from Edge Config via API. */
export async function fetchHighScores(game: GameId): Promise<ScoreEntry[]> {
  try {
    const res = await fetch(`/api/highscores?game=${game}`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch high scores', error);
  }
  return [];
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
  try {
    const res = await fetch('/api/highscores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game, name, score }),
    });
    
    if (res.ok) {
      return await res.json();
    } else {
      console.error('High score submission failed:', await res.text());
    }
  } catch (error) {
    console.error('Failed to submit high score', error);
  }
  
  // Return empty/null on error so it safely handles failure
  return { board: [], rank: null };
}

/** Utility to check if a score qualifies locally given an existing board. */
export function checkQualifiesLocal(board: ScoreEntry[], score: number): boolean {
  if (score < 0) return false;
  if (board.length < MAX_ENTRIES) return true;
  return score > board[board.length - 1].score;
}
