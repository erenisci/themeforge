/**
 * Authentication Routes
 */

import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rate-limit';
import { AuthController } from './auth.controller';

const router = Router();
const controller = new AuthController();

// Public routes (with rate limiting)
router.post('/register', authLimiter, controller.register);
router.post('/login', authLimiter, controller.login);
router.post('/refresh', authLimiter, controller.refreshToken);

// Protected routes
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.getCurrentUser);

export { router as authRouter };
