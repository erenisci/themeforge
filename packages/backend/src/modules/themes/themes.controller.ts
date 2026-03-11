import { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../../config/environment';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { getTheme, saveTheme } from './themes.service';

const shareSchema = z.object({
  name: z.string().max(100).optional(),
  theme: z.object({
    name: z.string().min(1).max(100),
    type: z.enum(['dark', 'light']),
    colors: z.record(z.string()),
    tokenColors: z.array(z.any()),
  }),
});

export async function shareTheme(req: Request, res: Response) {
  const result = shareSchema.safeParse(req.body);
  if (!result.success) {
    throw new ValidationError('Invalid theme data', result.error.errors);
  }

  const { name, theme } = result.data;
  const id = saveTheme(theme as any, name);
  const url = `${env.FRONTEND_URL}/theme/${id}`;

  res.status(201).json({ id, url });
}

export async function getSharedTheme(req: Request, res: Response) {
  const { id } = req.params;
  const theme = getTheme(id);

  if (!theme) {
    throw new NotFoundError('Theme');
  }

  res.json(theme);
}
