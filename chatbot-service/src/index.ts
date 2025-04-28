import dotenv from 'dotenv';
dotenv.config();

import { createServer } from './server';
import logger from './utils/logger';

const port = process.env.PORT || 3001;

async function startServer() {
  const app = createServer();
  
  app.listen(port, () => {
    logger.info(`Servicio de chatbot escuchando en el puerto ${port}`);
    logger.info(`Leyendo conocimientos desde: ${process.env.KNOWLEDGE_FILE_PATH}`);
  });
}

startServer().catch(err => {
  logger.error('Error al iniciar el servidor:', err);
  process.exit(1);
}); 