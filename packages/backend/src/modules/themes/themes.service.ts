import type { SharedTheme } from '@themeforge/shared';
import { nanoid } from 'nanoid';
import { db } from '../../config/database';

interface StoredTheme {
  id: string;
  name: string | null;
  theme_json: string;
  created_at: number;
}

export function saveTheme(theme: SharedTheme, name?: string): string {
  const id = nanoid(10);
  db.prepare(
    'INSERT INTO shared_themes (id, name, theme_json, created_at) VALUES (?, ?, ?, ?)',
  ).run(id, name ?? null, JSON.stringify(theme), Date.now());
  return id;
}

export function getTheme(id: string): SharedTheme | null {
  const row = db.prepare('SELECT theme_json FROM shared_themes WHERE id = ?').get(id) as
    | StoredTheme
    | undefined;
  if (!row) return null;
  return JSON.parse(row.theme_json) as SharedTheme;
}
