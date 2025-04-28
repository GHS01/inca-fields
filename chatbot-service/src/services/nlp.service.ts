import natural from 'natural';
import { Intent, Entity } from '../types';
import logger from '../utils/logger';

export class NLPService {
  private tokenizer: natural.WordTokenizer;
  private stemmer: typeof natural.PorterStemmerEs;
  
  // Mapeo de palabras clave a intenciones
  private intentKeywords: Record<Intent, string[]> = {
    [Intent.PRICE]: ['precio', 'costo', 'valor', 'cuánto', 'cuanto', 'tarifa', 'presupuesto'],
    [Intent.AVAILABILITY]: ['disponible', 'cuando', 'cuándo', 'temporada', 'época', 'fecha', 'mes', 'tiempo', 'hay'],
    [Intent.DELIVERY]: ['entrega', 'envío', 'envio', 'despacho', 'transporte', 'llega', 'recibir', 'recojo'],
    [Intent.PAYMENT]: ['pago', 'pagar', 'transferencia', 'efectivo', 'yape', 'plin', 'tarjeta', 'factura', 'depósito'],
    [Intent.PRODUCT]: ['aguacate', 'palta', 'producto', 'variedad', 'calidad', 'fresco', 'orgánico'],
    [Intent.QUALITY]: ['calidad', 'bueno', 'certificado', 'orgánico', 'ecológico', 'natural', 'sostenible'],
    [Intent.CONTACT]: ['contacto', 'teléfono', 'correo', 'email', 'whatsapp', 'especialista', 'experto', 'asesor'],
    [Intent.GREETING]: ['hola', 'saludos', 'buenos', 'días', 'tardes', 'noches', 'hey', 'qué tal']
  };
  
  // Entidades comunes a detectar
  private entityPatterns: Record<string, RegExp> = {
    'cantidad': /\b(\d+)\s*(kg|kilo|kilos|kilogramo|kilogramos|tonelada|toneladas|t)\b/i,
    'fecha': /\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/i,
    'ubicacion': /\b(lima|arequipa|trujillo|cusco|piura|chiclayo|ica|tacna|puno|junín|perú)\b/i,
    'tipocliente': /\b(mayorista|minorista|mayor|menor|retail|detalle|supermercado|restaurante|hotel)\b/i
  };
  
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmerEs;
  }
  
  analyzeMessage(message: string): { intent: Intent, entities: Entity[] } {
    try {
      // Tokenización y normalización básica
      const text = message.toLowerCase().trim();
      const tokens = this.tokenizer.tokenize(text) || [];
      
      // Detectar intención
      const intent = this.detectIntent(text, tokens);
      
      // Detectar entidades
      const entities = this.extractEntities(text);
      
      logger.info(`Análisis NLP: "${message}" -> Intent: ${intent}, Entities: ${entities.length}`);
      
      return { intent, entities };
    } catch (error) {
      logger.error('Error en análisis NLP:', error);
      return { intent: Intent.UNKNOWN, entities: [] };
    }
  }
  
  private detectIntent(text: string, tokens: string[]): Intent {
    // Verificar si es una pregunta
    const isQuestion = text.includes('?') || 
                      text.includes('¿') || 
                      ['qué', 'cuál', 'cómo', 'quién', 'dónde', 'cuándo', 'cuánto', 'por qué'].some(q => 
                        text.includes(q)
                      );
    
    if (isQuestion) {
      // Analizar qué tipo de pregunta es
      let maxScore = 0;
      let bestIntent = Intent.QUESTION;
      
      for (const [intent, keywords] of Object.entries(this.intentKeywords)) {
        const score = this.calculateIntentScore(text, tokens, keywords);
        if (score > maxScore) {
          maxScore = score;
          bestIntent = intent as Intent;
        }
      }
      
      return bestIntent;
    }
    
    // Si no es una pregunta, detectar intención basada en keywords
    let maxScore = 0;
    let bestIntent = Intent.UNKNOWN;
    
    for (const [intent, keywords] of Object.entries(this.intentKeywords)) {
      const score = this.calculateIntentScore(text, tokens, keywords);
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent as Intent;
      }
    }
    
    return bestIntent;
  }
  
  private calculateIntentScore(text: string, tokens: string[], keywords: string[]): number {
    let score = 0;
    
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        // Mayor peso si la palabra clave aparece como token completo
        if (tokens.includes(keyword)) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }
    
    return score;
  }
  
  private extractEntities(text: string): Entity[] {
    const entities: Entity[] = [];
    
    // Aplicar patrones de extracción de entidades
    for (const [type, pattern] of Object.entries(this.entityPatterns)) {
      const matches = text.match(pattern);
      if (matches) {
        entities.push({
          type,
          value: matches[0],
          position: text.indexOf(matches[0])
        });
      }
    }
    
    return entities;
  }
} 