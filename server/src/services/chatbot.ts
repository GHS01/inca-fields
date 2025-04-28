import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Valida si la API key está disponible
const isGeminiAvailable = (): boolean => {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ ADVERTENCIA: GEMINI_API_KEY no está configurada');
    return false;
  }
  return true;
};

// Contexto del chatbot para Inca Fields
const systemPrompt = `
Eres un asistente virtual de Inca Fields, una empresa peruana que vende aguacates de alta calidad.
Debes ser amigable, profesional y conocedor sobre nuestros productos.

Información importante:
- Vendemos aguacates Hass Premium a $50 MXN/kg (menudeo) y $40 MXN/kg (mayoreo, mínimo 10kg)
- Ofrecemos envíos a toda la República Mexicana
- Tenemos opciones de pago: efectivo, transferencia y tarjeta
- El tiempo de maduración es de 3-5 días
- Para compras mayoristas (>10kg), ofrecemos descuentos especiales
- Nuestros aguacates tienen certificación de calidad

Responde de manera concisa con la información relevante para el cliente.
Si no conoces alguna respuesta específica, sugiere contactar directamente con ventas@incafields.com

Mantén tus respuestas cortas y directas, idealmente menos de 50 palabras.
`;

// Interfaz para la estructura de mensaje
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Interfaz para la respuesta de Gemini API
interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// Función para generar respuesta con Gemini API
export const generateGeminiResponse = async (userMessage: string, conversationHistory: Message[] = []): Promise<string> => {
  // Verificar si la API está disponible
  if (!isGeminiAvailable()) {
    throw new Error('Gemini API no disponible');
  }

  try {
    // Preparar el contexto y el historial
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
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
        maxOutputTokens: 200,
        topP: 0.95,
        topK: 40
      }
    };

    // Llamada a la API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json() as Record<string, unknown>;
      console.error('Error al llamar a Gemini API:', errorData);
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    // Extraer la respuesta del modelo
    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Formato de respuesta inesperado de Gemini API');
    }

  } catch (error) {
    console.error('Error al generar respuesta:', error);
    throw error;
  }
};

// Exportar función para detección de intención
export const detectIntent = (message: string): 'mayoreo' | 'menudeo' | 'general' => {
  const lowerMsg = message.toLowerCase();
  
  // Palabras clave para mayoreo
  const mayoreoKeywords = ['mayoreo', 'mayorista', 'grandes cantidades', 'volumen', 'tonelada', 'paleta', 'por mayor', '10 kilos', '10 kg', 'más de 10', 'descuento'];
  
  // Palabras clave para menudeo
  const menudeoKeywords = ['menudeo', 'por pieza', 'por kilo', 'individual', 'poca cantidad', 'pocos aguacates', 'al detalle', 'por unidad'];
  
  // Verificar si contiene palabras clave de mayoreo
  if (mayoreoKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return 'mayoreo';
  }
  
  // Verificar si contiene palabras clave de menudeo
  if (menudeoKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return 'menudeo';
  }
  
  // Por defecto
  return 'general';
}; 