/**
 * Servicio para interactuar con la API de Gemini directamente desde el cliente
 */

import {
  GEMINI_API_KEYS,
  GEMINI_API_URL,
  GEMINI_GENERATION_CONFIG,
  GEMINI_API_TIMEOUT,
  GEMINI_REQUESTS_PER_MINUTE,
  GEMINI_SYSTEM_PROMPT
} from '@/config/gemini';
import { getKnowledgeBase } from './knowledgeBaseService';

// Clase para gestionar las claves API
class ApiKeyManager {
  private keys: string[];
  private currentIndex: number = 0;
  private keyUsage: Map<string, { requests: number, lastUsed: number }>;
  private maxRequestsPerMinute: number = GEMINI_REQUESTS_PER_MINUTE;

  constructor(apiKeys: string[]) {
    this.keys = apiKeys;
    this.keyUsage = new Map();

    // Inicializar el uso de cada clave
    for (const key of this.keys) {
      this.keyUsage.set(key, {
        requests: 0,
        lastUsed: 0
      });
    }
  }

  /**
   * Obtiene la siguiente clave API disponible
   */
  getNextAvailableKey(): string | null {
    if (this.keys.length === 0) {
      return null;
    }

    const now = Date.now();

    // Verificar todas las claves, comenzando desde la actual
    for (let i = 0; i < this.keys.length; i++) {
      const index = (this.currentIndex + i) % this.keys.length;
      const key = this.keys[index];
      const usage = this.keyUsage.get(key)!;

      // Reiniciar contador si ha pasado un minuto desde el último uso
      if (usage.lastUsed > 0 && now - usage.lastUsed >= 60000) {
        console.log(`Reiniciando contador para la clave API #${index + 1}`);
        usage.requests = 0;
      }

      // Si esta clave no ha alcanzado su límite, usarla
      if (usage.requests < this.maxRequestsPerMinute) {
        this.currentIndex = index;
        console.log(`Usando clave API #${index + 1} (${usage.requests}/${this.maxRequestsPerMinute} solicitudes)`);
        return key;
      }
    }

    // Si todas las claves han alcanzado su límite, devolver null
    console.log('Todas las claves API han alcanzado su límite');
    return null;
  }

  /**
   * Registra el uso de una clave API
   */
  trackKeyUsage(key: string): void {
    const usage = this.keyUsage.get(key);
    if (usage) {
      usage.requests++;
      usage.lastUsed = Date.now();
      console.log(`Solicitud registrada para clave API. Total: ${usage.requests}/${this.maxRequestsPerMinute}`);
    }
  }
}

// Crear una instancia del gestor de claves API
const apiKeyManager = new ApiKeyManager(GEMINI_API_KEYS);

/**
 * Interfaz para los mensajes del chat
 */
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Llama a la API de Gemini con un mensaje y el historial de chat
 */
export async function callGeminiAPI(userMessage: string, chatHistory: ChatMessage[]): Promise<string | null> {
  try {
    // Obtener la siguiente clave API disponible
    const apiKey = apiKeyManager.getNextAvailableKey();

    // Si no hay claves disponibles, lanzar error
    if (!apiKey) {
      console.log('No hay claves API disponibles. Usando respuestas predefinidas.');
      throw new Error('Límite de solicitudes a Gemini API alcanzado');
    }

    // Cargar la base de conocimientos
    const knowledgeBase = await getKnowledgeBase();

    // Preparar el contexto y el historial
    // Nota: gemini-1.5-flash no admite el rol 'system', así que incluimos las instrucciones en el primer mensaje

    // Filtrar solo los mensajes de usuario y asistente
    const filteredHistory = chatHistory.slice(-5).filter(msg =>
      msg.role === 'user' || msg.role === 'assistant'
    );

    // Crear el contenido para la API de Gemini
    const contents = [];

    // Añadir los mensajes del historial
    filteredHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    });

    // Añadir el mensaje actual del usuario (con instrucciones del sistema y base de conocimientos si es el primer mensaje)
    const isFirstMessage = filteredHistory.length === 0;
    let userContent = '';

    if (isFirstMessage) {
      // Incluir el prompt del sistema y la base de conocimientos en el primer mensaje
      userContent = `${GEMINI_SYSTEM_PROMPT}\n\n### BASE DE CONOCIMIENTOS ###\n${knowledgeBase}\n\n### CONSULTA DEL USUARIO ###\n${userMessage}`;
    } else {
      // Para mensajes posteriores, solo incluir la consulta del usuario
      userContent = userMessage;
    }

    contents.push({
      role: 'user',
      parts: [{ text: userContent }]
    });

    // Formato para la API de Gemini
    const requestBody = {
      contents: contents,
      generationConfig: GEMINI_GENERATION_CONFIG
    };

    // Crear un controlador de aborto para implementar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_API_TIMEOUT);

    try {
      // Registrar el uso de esta clave API
      apiKeyManager.trackKeyUsage(apiKey);

      console.log('Enviando solicitud a Gemini API...');

      // Llamada a la API con timeout
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      // Limpiar el timeout
      clearTimeout(timeoutId);

      console.log(`Respuesta de Gemini API recibida con status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 429) {
          console.log('Error 429: Límite de tasa excedido. Intentando con otra clave API...');
          // Intentar de nuevo con la siguiente clave (llamada recursiva)
          return await callGeminiAPI(userMessage, chatHistory);
        }

        // Para otros errores, mostrar más información
        const errorText = await response.text();
        console.error(`Error en la API (${response.status}): ${errorText}`);
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos recibidos de Gemini API:', JSON.stringify(data).substring(0, 200) + '...');

      // Extraer la respuesta del modelo
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Formato de respuesta inesperado:', JSON.stringify(data));
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (fetchError) {
      // Limpiar el timeout en caso de error
      clearTimeout(timeoutId);

      // Si es un error de timeout, mostrar mensaje específico
      if (fetchError.name === 'AbortError') {
        console.error('Timeout al llamar a Gemini API');
        throw new Error('Timeout al llamar a Gemini API');
      }

      throw fetchError;
    }
  } catch (error) {
    console.error('Error al llamar a Gemini API:', error);
    // En lugar de propagar el error, devolvemos null para manejar el error en la función principal
    return null;
  }
}
