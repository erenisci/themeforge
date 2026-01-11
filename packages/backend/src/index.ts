/**
 * ThemeForge Backend API
 * Express server entry point
 */

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pool } from './config/database';
import { env } from './config/environment';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { apiLimiter } from './middleware/rate-limit';
import { authRouter } from './modules/auth/auth.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed',
    });
  }
});

// API Routes
app.use('/api/auth', authRouter);
// More routes will be added: themes, billing, addons, etc.

// 404 Handler
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

// Start server
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log('🚀 ThemeForge Backend');
  console.log(`   - Environment: ${env.NODE_ENV}`);
  console.log(`   - Port: ${PORT}`);
  console.log(`   - API: http://localhost:${PORT}/api`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

export default app;
