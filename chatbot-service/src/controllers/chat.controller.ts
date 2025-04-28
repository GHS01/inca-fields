import { Request, Response } from 'express';
import { KnowledgeService } from '../services/knowledge.service';
import { NLPService } from '../services/nlp.service';
import logger from '../utils/logger';

export class ChatController {
  private knowledgeService: KnowledgeService;
  private nlpService: NLPService;
  
  constructor() {
    this.knowledgeService = new KnowledgeService();
    this.nlpService = new NLPService();
    
    // Bind methods
    this.processMessage = this.processMessage.bind(this);
    this.getInfo = this.getInfo.bind(this);
  }
  
  async processMessage(req: Request, res: Response) {
    try {
      const { message, messageCount = 0 } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'El mensaje es requerido' });
      }
      
      logger.info(`Mensaje recibido (${messageCount}): ${message}`);
      
      // Analizar el mensaje con NLP para extraer intenciones y entidades
      const analysis = this.nlpService.analyzeMessage(message);
      
      // Obtener la respuesta adecuada del servicio de conocimientos
      const response = await this.knowledgeService.getResponse(
        message, 
        analysis.intent, 
        analysis.entities, 
        messageCount
      );
      
      return res.json({ response });
    } catch (error) {
      logger.error('Error al procesar mensaje:', error);
      return res.status(500).json({ 
        error: 'Error al procesar el mensaje',
        fallbackResponse: '¡Lo siento! Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo o contacta directamente con un especialista.' 
      });
    }
  }
  
  async getInfo(req: Request, res: Response) {
    try {
      const info = await this.knowledgeService.getInfo();
      return res.json(info);
    } catch (error) {
      logger.error('Error al obtener información:', error);
      return res.status(500).json({ error: 'Error al obtener información del chatbot' });
    }
  }
} 