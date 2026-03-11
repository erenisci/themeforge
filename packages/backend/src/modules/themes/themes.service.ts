import type { SharedTheme } from '@themeforge/shared';
import { nanoid } from 'nanoid';
import { db } from '../../config/database';

export async function saveTheme(
  theme: SharedTheme,
  name?: string,
  authorName?: string,
  isPublic = false,
): Promise<string> {
  const id = nanoid(10);
  await db.execute({
    sql: 'INSERT INTO shared_themes (id, name, theme_json, author_name, is_public, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    args: [id, name ?? null, JSON.stringify(theme), authorName ?? null, isPublic ? 1 : 0, Date.now()],
  });
  return id;
}

export async function getTheme(id: string): Promise<SharedTheme | null> {
  const result = await db.execute({
    sql: 'SELECT theme_json FROM shared_themes WHERE id = ?',
    args: [id],
  });
  const row = result.rows[0];
  if (!row) return null;
  return JSON.parse(row.theme_json as string) as SharedTheme;
}

export async function getPublicThemes(limit = 50, offset = 0): Promise<
  { id: string; name: string | null; author_name: string | null; type: string; created_at: number }[]
> {
  const result = await db.execute({
    sql: `SELECT id, name, author_name, created_at,
            json_extract(theme_json, '$.type') as type
          FROM shared_themes
          WHERE is_public = 1
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?`,
    args: [limit, offset],
  });
  return result.rows as any[];
}
