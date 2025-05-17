// No necesitamos importar fetch en Vercel Edge Functions
// Usaremos el fetch global disponible en el entorno

// Configuración de la API de Gemini
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Clase para gestionar las claves API
class ApiKeyManager {
  constructor(apiKeys) {
    this.apiKeys = apiKeys.map(key => ({
      key,
      lastUsed: 0,
      available: true
    }));
    this.currentIndex = 0;
  }

  getNextAvailableKey() {
    // Si no hay claves, retornar null
    if (this.apiKeys.length === 0) {
      return null;
    }

    // Verificar si alguna clave está disponible
    const now = Date.now();
    for (let i = 0; i < this.apiKeys.length; i++) {
      const keyInfo = this.apiKeys[i];
      // Si la clave está disponible o han pasado más de 60 segundos desde su último uso
      if (keyInfo.available || (now - keyInfo.lastUsed) > 60000) {
        keyInfo.available = true;
        keyInfo.lastUsed = now;
        this.currentIndex = i;
        return keyInfo.key;
      }
    }

    // Si ninguna clave está disponible, retornar null
    return null;
  }

  markKeyAsUnavailable(key) {
    const keyInfo = this.apiKeys.find(k => k.key === key);
    if (keyInfo) {
      keyInfo.available = false;
    }
  }

  getTimeUntilAvailable() {
    if (this.apiKeys.length === 0) {
      return Infinity;
    }

    const now = Date.now();
    let minTime = Infinity;

    for (const keyInfo of this.apiKeys) {
      const timeLeft = 60000 - (now - keyInfo.lastUsed);
      if (timeLeft < minTime) {
        minTime = timeLeft;
      }
    }

    return Math.max(0, minTime);
  }
}

// Respuestas predefinidas para cuando la API no está disponible
const RESPUESTAS_MAYOREO = {
  precio: 'Para compras al por mayor, contáctese con uno de nuestros mayoristas para atención exclusiva usando el botón de contacto.',
  disponibilidad: 'Los aguacates al por mayor están disponibles en los meses de Enero, Marzo y Mayo, que son nuestras temporadas principales de cosecha. Para otras fechas, por favor contacte directamente con nuestro equipo de ventas.',
  entrega: 'Para pedidos al por mayor: Entrega por camionadas en 3-7 días hábiles tras confirmar pedido.',
  pago: 'Transferencia bancaria, efectivo o pagos digitales (Yape, Plin) para ambos tipos de venta.',
  calidad: 'Nuestros aguacates al por mayor son de la misma calidad premium que vendemos al por menor. Garantizamos un producto fresco, con el punto óptimo de maduración para que llegue en perfectas condiciones.',
  default: 'Para compras al por mayor, contáctese con uno de nuestros mayoristas para atención exclusiva usando el botón de contacto. Los aguacates al por mayor están disponibles en enero, marzo y mayo. ¿Te gustaría conocer más detalles?'
};

// Respuestas para preguntas de menudeo
const RESPUESTAS_MENUDEO = {
  precio: 'El precio de nuestros aguacates premium al por menor es de S/ 6.50 por kilogramo (aproximadamente 4 aguacates). También ofrecemos packs especiales: Pack Familiar (3kg) por S/ 18.50 y Pack Gourmet (selección especial de 8 aguacates) por S/ 24.99.',
  disponibilidad: 'Nuestros aguacates al por menor están disponibles durante todo el año en nuestra tienda online y puntos de venta seleccionados. Realizamos envíos de Lunes a Sábado.',
  entrega: 'Para compras al por menor, realizamos entregas en Lima Metropolitana en 24-48 horas. El costo de envío es de S/ 5.00 para pedidos menores a S/ 50.00, y gratis para compras mayores.',
  pago: 'Para compras al por menor aceptamos todas las tarjetas de crédito y débito, transferencias bancarias, Yape, Plin y pago contra entrega en efectivo.',
  conservacion: 'Para conservar tus aguacates, mantén los que están duros a temperatura ambiente hasta que maduren. Una vez maduros, puedes refrigerarlos para extender su vida útil por 2-3 días adicionales.',
  default: 'Nuestros aguacates premium al por menor tienen un precio de S/ 6.50 por kilogramo. Realizamos entregas en Lima Metropolitana en 24-48 horas. ¿Te gustaría conocer más sobre nuestros productos, precios especiales o métodos de conservación?'
};

// Respuestas generales
const RESPUESTAS_GENERALES = {
  default: 'Actualmente no manejo esa información, te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.',
  horarios: 'Nuestros horarios de atención son de Lunes a Viernes de 9:00 AM a 6:00 PM y Sábados de 9:00 AM a 1:00 PM. Estamos cerrados los domingos y feriados.',
  contacto: 'Puedes contactarnos a través de nuestro teléfono: +51 998 148 917, por correo electrónico a peru.aguacates@gmail.com o mediante el formulario de contacto en nuestra página web.',
  ubicacion: 'Nuestra oficina central se encuentra en Av. Blv de la Literatura 164, Lima, Perú.'
};

// Función para detectar el tipo de consulta
function detectQueryType(message) {
  const lowerMessage = message.toLowerCase();

  // Palabras clave para mayoreo
  const mayoreoKeywords = [
    'mayor', 'mayoreo', 'tonelada', 'toneladas', 'ton', 'grandes cantidades',
    'grandes pedidos', 'grandes volúmenes', 'compra grande', 'cantidad grande',
    'grandes lotes', 'distribuidor', 'distribuidores', 'revender', 'reventa',
    'exportar', 'exportación', 'negocio', 'comercial', 'empresa', 'empresarial',
    'restaurante', 'hotel', 'supermercado', 'mayorista', 'mayoristas', '500 kg',
    '1000 kg'
  ];

  // Palabras clave para menudeo
  const menudeoKeywords = [
    'menor', 'menudeo', 'kilo', 'kilos', 'kg', 'pequeñas cantidades',
    'pequeños pedidos', 'pequeños volúmenes', 'compra pequeña', 'cantidad pequeña',
    'unidad', 'unidades', 'personal', 'casa', 'hogar', 'familiar', 'consumo propio',
    'particular', 'individual', '6.50', 'seis', 'minorista'
  ];

  // Verificar mayoreo
  for (const keyword of mayoreoKeywords) {
    if (lowerMessage.includes(keyword)) {
      return 'mayoreo';
    }
  }

  // Verificar menudeo
  for (const keyword of menudeoKeywords) {
    if (lowerMessage.includes(keyword)) {
      return 'menudeo';
    }
  }

  return 'unknown';
}

// Función para detectar si es una pregunta sobre precios
function isPriceQuestion(message) {
  const lowerMessage = message.toLowerCase();
  const priceKeywords = [
    'precio', 'precios', 'costo', 'costos', 'valor', 'cuánto', 'cuanto',
    'cuestan', 'cuesta', 'tarifa', 'tarifas', 'pagar', 'cobran', 'cobra',
    'vale', 'valen', 'oferta', 'ofertas', 'descuento', 'descuentos',
    'económico', 'barato', 'costoso', 'promoción', 'promociones', 's/'
  ];

  return priceKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Función para detectar si es una pregunta sobre disponibilidad
function isAvailabilityQuestion(message) {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes('disponible') ||
    lowerMessage.includes('cuando') ||
    lowerMessage.includes('cuándo') ||
    lowerMessage.includes('temporada') ||
    lowerMessage.includes('época') ||
    lowerMessage.includes('fecha') ||
    lowerMessage.includes('mes') ||
    lowerMessage.includes('tiempo')
  );
}

// Función para detectar si es una pregunta sobre entrega
function isDeliveryQuestion(message) {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes('entrega') ||
    lowerMessage.includes('envío') ||
    lowerMessage.includes('envio') ||
    lowerMessage.includes('despacho') ||
    lowerMessage.includes('recibir') ||
    lowerMessage.includes('recibo') ||
    lowerMessage.includes('llega') ||
    lowerMessage.includes('llegada') ||
    lowerMessage.includes('domicilio') ||
    lowerMessage.includes('casa') ||
    lowerMessage.includes('dirección') ||
    lowerMessage.includes('direccion')
  );
}

// Función para detectar si es una pregunta sobre métodos de pago
function isPaymentQuestion(message) {
  const lowerMessage = message.toLowerCase();
  return (
    lowerMessage.includes('pago') ||
    lowerMessage.includes('pagar') ||
    lowerMessage.includes('tarjeta') ||
    lowerMessage.includes('efectivo') ||
    lowerMessage.includes('transferencia') ||
    lowerMessage.includes('yape') ||
    lowerMessage.includes('plin') ||
    lowerMessage.includes('depósito') ||
    lowerMessage.includes('deposito') ||
    lowerMessage.includes('contra entrega') ||
    lowerMessage.includes('crédito') ||
    lowerMessage.includes('credito') ||
    lowerMessage.includes('débito') ||
    lowerMessage.includes('debito')
  );
}

// Función para generar una respuesta predefinida
function getPredefinedResponse(message) {
  // Detectar tipo de consulta (mayoreo o menudeo)
  const queryType = detectQueryType(message);

  // Si no es ni mayoreo ni menudeo, damos una respuesta general
  if (queryType === 'unknown') {
    return RESPUESTAS_GENERALES.default;
  }

  // Seleccionar el conjunto de respuestas según el tipo de consulta
  const respuestas = queryType === 'mayoreo' ? RESPUESTAS_MAYOREO : RESPUESTAS_MENUDEO;

  // Detectar tipo de pregunta (precio, disponibilidad, entrega, pago)
  if (isPriceQuestion(message)) {
    return respuestas.precio;
  }

  if (isAvailabilityQuestion(message)) {
    return respuestas.disponibilidad;
  }

  if (isDeliveryQuestion(message)) {
    return respuestas.entrega;
  }

  if (isPaymentQuestion(message)) {
    return respuestas.pago;
  }

  // Si no detectamos un tipo específico de pregunta, dar respuesta por defecto
  return respuestas.default;
}

// Función para llamar a la API de Gemini con timeout
async function callGeminiAPI(userMessage, chatHistory, apiKey) {
  try {
    // Preparar el contexto y el historial (simplificado para reducir tamaño)
    const messages = [
      { role: 'system', content: 'Eres un asistente virtual de Inca Fields. Responde de manera concisa sobre aguacates. IMPORTANTE: Para preguntas sobre precios al por mayor, SIEMPRE responde: "Para compras al por mayor, contáctese con uno de nuestros mayoristas para atención exclusiva usando el botón de contacto." NO menciones precios específicos para compras al por mayor.' },
      // Solo incluir los últimos 3 mensajes del historial para reducir tamaño
      ...chatHistory.slice(-3),
      { role: 'user', content: userMessage }
    ];

    // Formato para la API de Gemini (configuración simplificada)
    const requestBody = {
      contents: messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150, // Reducido para respuestas más cortas
        topP: 0.9,
        topK: 20
      }
    };

    // Crear un controlador de aborto para implementar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout (aumentado para evitar timeouts prematuros)

    try {
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
          throw new Error('Límite de tasa excedido');
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

// Función principal para manejar las solicitudes - versión optimizada
export default async function handler(req) {
  // Configurar CORS para Edge Functions
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Manejar solicitudes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  // Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        response: 'Solo se aceptan solicitudes POST'
      }),
      {
        status: 405,
        headers
      }
    );
  }

  try {
    // Parsear el cuerpo de la solicitud como JSON con un timeout
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          response: "Error al procesar la solicitud. Por favor, intenta de nuevo."
        }),
        {
          status: 400,
          headers
        }
      );
    }

    const { message, chatHistory = [] } = body;

    if (!message) {
      return new Response(
        JSON.stringify({
          response: "Lo siento, no pude entender tu mensaje. ¿Podrías intentarlo de nuevo?"
        }),
        {
          status: 400,
          headers
        }
      );
    }

    // Generar respuesta predefinida inmediatamente como fallback
    const fallbackResponse = getPredefinedResponse(message);

    // Obtener las claves API de las variables de entorno
    const apiKeys = [];
    if (process.env.GEMINI_API_KEY) {
      apiKeys.push(process.env.GEMINI_API_KEY);
    }
    if (process.env.GEMINI_API_KEY_2) {
      apiKeys.push(process.env.GEMINI_API_KEY_2);
    }

    // Si no hay claves API disponibles, usar respuestas predefinidas inmediatamente
    if (apiKeys.length === 0) {
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        {
          status: 200,
          headers
        }
      );
    }

    // Intentar llamar a la API de Gemini con la primera clave disponible
    // No usamos el gestor de claves API para simplificar y acelerar
    const apiKey = apiKeys[0];
    const geminiResponse = await callGeminiAPI(message, chatHistory, apiKey);

    // Si la llamada a Gemini falló o devolvió null, usar el fallback
    if (!geminiResponse) {
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        {
          status: 200,
          headers
        }
      );
    }

    // Si llegamos aquí, tenemos una respuesta válida de Gemini
    return new Response(
      JSON.stringify({ response: geminiResponse }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    // Capturar cualquier error y devolver una respuesta genérica
    console.error('Error en la función Edge:', error);

    return new Response(
      JSON.stringify({
        response: "Actualmente no manejo esa información, te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo."
      }),
      {
        status: 200,
        headers
      }
    );
  }
};
