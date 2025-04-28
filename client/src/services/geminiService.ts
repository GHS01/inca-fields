/**
 * Servicio para interactuar con la API de Gemini directamente desde el cliente
 */

// Claves API de Gemini (normalmente deberían estar en variables de entorno, pero las hardcodeamos para esta solución)
const GEMINI_API_KEYS = [
  'AIzaSyCFR2kApUeCGSWOf_tkcLe1XH4qgKjDVJ0', // Clave principal
  'AIzaSyBEDtNY0MAWLsHcSn4rObEM_Cp7VdKwDjU'  // Clave secundaria
];

// URL de la API de Gemini
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Clase para gestionar las claves API
class ApiKeyManager {
  private keys: string[];
  private currentIndex: number = 0;
  private keyUsage: Map<string, { requests: number, lastUsed: number }>;
  private maxRequestsPerMinute: number = 60; // Límite por clave de Gemini

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

    // Preparar el contexto y el historial
    const messages = [
      { role: 'system', content: 'Eres un asistente virtual de Inca Fields. Responde de manera concisa sobre aguacates.' },
      // Solo incluir los últimos 5 mensajes del historial para reducir tamaño
      ...chatHistory.slice(-5),
      { role: 'user', content: userMessage }
    ];

    // Formato para la API de Gemini
    const requestBody = {
      contents: messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250,
        topP: 0.9,
        topK: 20
      }
    };

    // Crear un controlador de aborto para implementar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

    try {
      // Registrar el uso de esta clave API
      apiKeyManager.trackKeyUsage(apiKey);

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

      if (!response.ok) {
        if (response.status === 429) {
          console.log('Error 429: Límite de tasa excedido. Intentando con otra clave API...');
          // Intentar de nuevo con la siguiente clave (llamada recursiva)
          return await callGeminiAPI(userMessage, chatHistory);
        }
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();

      // Extraer la respuesta del modelo
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (fetchError) {
      // Limpiar el timeout en caso de error
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error al llamar a Gemini API:', error);
    // En lugar de propagar el error, devolvemos null para manejar el error en la función principal
    return null;
  }
}
