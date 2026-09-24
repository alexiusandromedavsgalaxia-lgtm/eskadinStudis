CREATE TABLE IF NOT EXISTS public_games (
  id TEXT PRIMARY KEY,
  game TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_public_games_updated_at ON public_games(updated_at DESC);
