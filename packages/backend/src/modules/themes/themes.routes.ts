import { Router } from 'express';
import { asyncHandler } from '../../middleware/error-handler';
import { galleryLimiter, shareLimiter } from '../../middleware/rate-limit';
import { getSharedTheme, listPublicThemes, shareTheme } from './themes.controller';

export const themesRouter = Router();

themesRouter.post('/share', shareLimiter, asyncHandler(shareTheme));
themesRouter.get('/gallery', galleryLimiter, asyncHandler(listPublicThemes));
themesRouter.get('/:id', asyncHandler(getSharedTheme));
