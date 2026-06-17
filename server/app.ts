import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { productRoutes } from './routes/productRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { settingsRoutes } from './routes/settingsRoutes';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow non-browser clients (no Origin header) and any allow-listed origin.
        if (!origin || env.allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: '8mb' }));
  app.use(morgan('dev'));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true, service: 'solelux-api' });
  });

  app.use('/api', productRoutes);
  app.use('/api', settingsRoutes);
  app.use('/api', orderRoutes);
  app.use('/api', adminRoutes);
  app.use(errorHandler);

  return app;
}
