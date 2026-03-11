import { Router } from 'express';
import { asyncHandler } from '../../middleware/error-handler';
import { shareLimiter } from '../../middleware/rate-limit';
import { getSharedTheme, shareTheme } from './themes.controller';

export const themesRouter = Router();

themesRouter.post('/share', shareLimiter, asyncHandler(shareTheme));
themesRouter.get('/:id', asyncHandler(getSharedTheme));
