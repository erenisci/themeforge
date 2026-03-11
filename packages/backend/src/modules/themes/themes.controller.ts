import { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../../config/environment';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { getPublicThemes, getTheme, saveTheme } from './themes.service';

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color (#rrggbb)');

const shareSchema = z.object({
  name: z.string().max(100).optional(),
  authorName: z.string().max(50).optional(),
  isPublic: z.boolean().optional().default(false),
  theme: z.object({
    name: z.string().min(1).max(100),
    type: z.enum(['dark', 'light']),
    colors: z.record(hexColor),
    tokenColors: z.array(
      z.object({
        name: z.string().optional(),
        scope: z.union([z.string(), z.array(z.string())]),
        settings: z.object({
          foreground: hexColor.optional(),
          background: hexColor.optional(),
          fontStyle: z.string().optional(),
        }),
      }),
    ),
    semanticTokenColors: z.record(z.string()).optional(),
  }),
});

export async function shareTheme(req: Request, res: Response) {
  const result = shareSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('Invalid theme data', result.error.errors);
  }

  const { name, authorName, isPublic, theme } = result.data;
  const id = await saveTheme(theme as any, name, authorName, isPublic);
  const url = `${env.FRONTEND_URL}/theme/${id}`;

  res.status(201).json({ id, url });
}

export async function getSharedTheme(req: Request, res: Response) {
  const { id } = req.params;
  if (!/^[A-Za-z0-9_-]{10}$/.test(id)) {
    throw new ValidationError('Invalid theme ID');
  }

  const theme = await getTheme(id);
  if (!theme) {
    throw new NotFoundError('Theme');
  }

  res.json(theme);
}

export async function listPublicThemes(req: Request, res: Response) {
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const offset = Number(req.query.offset) || 0;
  const themes = await getPublicThemes(limit, offset);
  res.json({ themes, limit, offset });
}
