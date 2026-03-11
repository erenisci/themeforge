import { createClient } from '@libsql/client';
import { env } from './environment';

export const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export async function initDb() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS shared_themes (
      id         TEXT    PRIMARY KEY,
      name       TEXT,
      theme_json TEXT    NOT NULL,
      author_name TEXT,
      is_public  INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_shared_themes_created
      ON shared_themes(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_shared_themes_public
      ON shared_themes(is_public, created_at DESC);
  `);

  console.log('Database ready');
}
