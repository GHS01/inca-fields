import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';

const router = Router();
const chatController = new ChatController();

// Ruta para enviar un mensaje y recibir respuesta
router.post('/chat', chatController.processMessage);

// Ruta para obtener información sobre el chatbot
router.get('/info', chatController.getInfo);

export default router; 