import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api.routes';
import logger from './utils/logger';

export function createServer() {
  const app = express();
  
  // Middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }));
  app.use(express.json());
  
  // Logging middleware
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
  
  // Rutas
  app.use('/api', apiRoutes);
  
  // Health check
  app.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Error handling
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Error no controlado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  });
  
  return app;
} 