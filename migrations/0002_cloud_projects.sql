CREATE TABLE IF NOT EXISTS user_projects (
  user_key TEXT PRIMARY KEY,
  projects TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
