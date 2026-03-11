import type BetterSqlite3 from 'better-sqlite3';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db: BetterSqlite3.Database = new Database(path.join(dataDir, 'themes.db'));

// Initialize schema on startup (idempotent)
db.exec(`
  CREATE TABLE IF NOT EXISTS shared_themes (
    id TEXT PRIMARY KEY,
    name TEXT,
    theme_json TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_shared_themes_created
    ON shared_themes(created_at DESC);
`);

console.log('SQLite database ready');
