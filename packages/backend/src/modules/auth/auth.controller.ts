/**
 * Authentication Controller
 * Handles HTTP requests for auth endpoints
 */

import { LoginDTO, RegisterDTO } from '@themeforge/shared';
import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/error-handler';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  /**
   * POST /api/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const data: RegisterDTO = req.body;

    const result = await authService.register(data);

    res.status(201).json(result);
  });

  /**
   * POST /api/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const data: LoginDTO = req.body;

    const result = await authService.login(data);

    res.status(200).json(result);
  });

  /**
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.user?.sessionId;

    if (sessionId) {
      await authService.logout(sessionId);
    }

    res.status(200).json({ message: 'Logged out successfully' });
  });

  /**
   * GET /api/auth/me
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const user = await authService.getCurrentUser(userId);

    res.status(200).json({ user });
  });

  /**
   * POST /api/auth/refresh
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json(result);
  });
}
