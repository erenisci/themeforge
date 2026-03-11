import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/environment';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { apiLimiter } from './middleware/rate-limit';
import { themesRouter } from './modules/themes/themes.routes';

// Initialize database
import './config/database';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use('/api', apiLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/themes', themesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`ThemeForge Backend running on port ${env.PORT}`);
});

export default app;
