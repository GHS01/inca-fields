import fs from 'fs';
import path from 'path';
import { MarkdownUtils } from '../utils/markdown.utils';
import logger from '../utils/logger';
import { Intent, Entity, KnowledgeSection } from '../types';

export class KnowledgeService {
  private knowledgeFilePath: string;
  private markdownUtils: MarkdownUtils;
  private knowledgeSections: KnowledgeSection[] = [];
  private lastUpdateTime: number = 0;
  
  constructor() {
    this.knowledgeFilePath = process.env.KNOWLEDGE_FILE_PATH || './memory/conocimientos.markdown';
    this.markdownUtils = new MarkdownUtils();
    
    // Cargar conocimientos iniciales
    this.loadKnowledge();
    
    // Configurar actualización periódica (cada 5 minutos)
    setInterval(() => this.checkForUpdates(), 5 * 60 * 1000);
  }
  
  private async loadKnowledge() {
    try {
      const content = fs.readFileSync(this.knowledgeFilePath, 'utf8');
      this.knowledgeSections = this.markdownUtils.parseMarkdownToSections(content);
      this.lastUpdateTime = Date.now();
      logger.info(`Conocimientos cargados con éxito: ${this.knowledgeSections.length} secciones`);
    } catch (error) {
      logger.error('Error al cargar conocimientos:', error);
      throw new Error('No se pudieron cargar los conocimientos');
    }
  }
  
  private async checkForUpdates() {
    try {
      const stats = fs.statSync(this.knowledgeFilePath);
      if (stats.mtimeMs > this.lastUpdateTime) {
        logger.info('Detectados cambios en el archivo de conocimientos. Recargando...');
        await this.loadKnowledge();
      }
    } catch (error) {
      logger.error('Error al verificar actualizaciones:', error);
    }
  }
  
  async getResponse(message: string, intent: Intent, entities: Entity[], messageCount: number): Promise<string> {
    // Asegurar que los conocimientos estén cargados
    if (this.knowledgeSections.length === 0) {
      await this.loadKnowledge();
    }
    
    // Si es el primer mensaje o un saludo, dar bienvenida
    if (messageCount <= 1 || intent === Intent.GREETING) {
      return this.getDefaultWelcome();
    }
    
    // Buscar en las secciones de FAQ si es una pregunta específica
    if (intent === Intent.QUESTION) {
      const faqSection = this.knowledgeSections.find(section => 
        section.title.toLowerCase().includes('frecuentes') || 
        section.title.toLowerCase().includes('faq')
      );
      
      if (faqSection && faqSection.subsections) {
        // Intentar encontrar una respuesta en las FAQ
        for (const qa of faqSection.subsections) {
          if (this.isRelevantQuestion(qa.title, message, intent, entities)) {
            return qa.content;
          }
        }
      }
    }
    
    // Buscar por intención y entidades
    let bestResponse = this.findBestResponse(message, intent, entities);
    
    // Si no se encontró una respuesta específica, dar una respuesta genérica
    if (!bestResponse) {
      bestResponse = this.getGenericResponse(messageCount);
    }
    
    // Después de 5 preguntas, sugerir contactar a un especialista
    if (messageCount >= 5) {
      bestResponse += "\n\nSi deseas información más detallada, puedes conversar con un especialista usando el botón en la parte inferior del chat.";
    }
    
    return bestResponse;
  }
  
  private isRelevantQuestion(question: string, message: string, intent: Intent, entities: Entity[]): boolean {
    // Implementación simple para determinar si una pregunta del FAQ es relevante para el mensaje
    const lowerQuestion = question.toLowerCase();
    const lowerMessage = message.toLowerCase();
    
    // Verificar palabras clave comunes
    const questionKeywords = lowerQuestion.split(/\s+/).filter(word => word.length > 3);
    const messageKeywords = lowerMessage.split(/\s+/).filter(word => word.length > 3);
    
    const commonWords = questionKeywords.filter(word => messageKeywords.includes(word));
    
    // Si hay entidades que coinciden con la pregunta
    const entityMatch = entities.some(entity => 
      lowerQuestion.includes(entity.value.toLowerCase())
    );
    
    return commonWords.length >= 2 || entityMatch;
  }
  
  private findBestResponse(message: string, intent: Intent, entities: Entity[]): string | null {
    // Buscar en las secciones relevantes según la intención y entidades
    const lowerMessage = message.toLowerCase();
    
    // Mapeo de intenciones a posibles títulos de sección
    const intentSectionMap: Record<Intent, string[]> = {
      [Intent.PRICE]: ['precio', 'precios', 'costo'],
      [Intent.AVAILABILITY]: ['disponibilidad', 'periodos', 'venta'],
      [Intent.DELIVERY]: ['entrega', 'transporte', 'envío'],
      [Intent.PAYMENT]: ['pago', 'pagos', 'negociación'],
      [Intent.PRODUCT]: ['producto', 'aguacates', 'información'],
      [Intent.QUALITY]: ['calidad', 'orgánicos'],
      [Intent.CONTACT]: ['contacto', 'especialista'],
      [Intent.GREETING]: ['propósito'],
      [Intent.QUESTION]: ['preguntas', 'faq'],
      [Intent.UNKNOWN]: []
    };
    
    const relevantSectionTitles = intentSectionMap[intent] || [];
    
    // Buscar en secciones relevantes
    for (const section of this.knowledgeSections) {
      const lowerTitle = section.title.toLowerCase();
      
      if (relevantSectionTitles.some(title => lowerTitle.includes(title))) {
        // Si es una sección con subsecciones, buscar la más relevante
        if (section.subsections && section.subsections.length > 0) {
          for (const subsection of section.subsections) {
            const lowerSubtitle = subsection.title.toLowerCase();
            
            // Verificar si el mensaje contiene palabras clave del subtítulo
            const isRelevant = lowerSubtitle.split(' ')
              .some(word => word.length > 3 && lowerMessage.includes(word));
              
            if (isRelevant) {
              return subsection.content;
            }
          }
          
          // Si no encontramos subsección relevante, usar primera subsección
          return section.subsections[0].content;
        }
        
        // Si no tiene subsecciones, usar el contenido principal
        return section.content;
      }
    }
    
    // Búsqueda por entidades
    if (entities.length > 0) {
      for (const entity of entities) {
        for (const section of this.knowledgeSections) {
          if (section.content.toLowerCase().includes(entity.value.toLowerCase())) {
            return section.content;
          }
          
          // Buscar en subsecciones
          if (section.subsections) {
            for (const subsection of section.subsections) {
              if (subsection.content.toLowerCase().includes(entity.value.toLowerCase())) {
                return subsection.content;
              }
            }
          }
        }
      }
    }
    
    // No se encontró respuesta específica
    return null;
  }
  
  private getDefaultWelcome(): string {
    return "¡Hola! 👋 Soy el asistente virtual de Inca Fields. ¿Estás interesado en comprar nuestros aguacates al por mayor o menor? Estoy aquí para ayudarte con toda la información que necesites. 🥑";
  }
  
  private getGenericResponse(messageCount: number): string {
    return "Nuestros aguacates son cultivados con los más altos estándares de calidad. ¿Hay algo específico sobre nuestros productos que te gustaría conocer? 🥑";
  }
  
  async getInfo(): Promise<any> {
    return {
      totalSections: this.knowledgeSections.length,
      lastUpdate: new Date(this.lastUpdateTime).toISOString(),
      knowledgeFilePath: this.knowledgeFilePath,
      status: 'active'
    };
  }
} 