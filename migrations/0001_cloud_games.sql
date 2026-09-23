CREATE TABLE IF NOT EXISTS user_games (
  user_key TEXT PRIMARY KEY,
  games TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
