import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

// Variable para almacenar la API key desde variables de entorno
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Verificar si la API key está configurada
if (!GEMINI_API_KEY) {
  console.warn('⚠️ ADVERTENCIA: La variable de entorno GEMINI_API_KEY no está configurada. El chatbot usará respuestas predefinidas.');
}

// Cargar la base de conocimientos
const knowledgeBasePath = path.join(process.cwd(), 'memory', 'conocimientos.markdown');
let knowledgeBase = '';

try {
  knowledgeBase = fs.readFileSync(knowledgeBasePath, 'utf8');
} catch (error) {
  console.error('Error al cargar la base de conocimientos:', error);
  knowledgeBase = '# Base de Conocimientos no disponible';
}

// Extraer información clave de la base de conocimientos
const precioUnidad = 2.50; // S/ 2.50 por unidad
const pesoPromedio = 0.25; // 0.25 kg o 250g por aguacate
const precioTonelada = 10000; // S/ 10,000 por tonelada
const periodosMayoreo = ['enero', 'marzo', 'mayo'];

// Prompt del sistema para el asistente de ventas (actualizado)
const systemPrompt = `
Eres el asistente virtual amigable de Inca Fields, una empresa especializada en aguacates premium.
Tu objetivo es ayudar a los clientes de manera conversacional y natural, proporcionando información
sobre nuestros productos y servicios.

Usa esta base de conocimientos para responder preguntas específicas:
${knowledgeBase}

Instrucciones importantes:
1. Inicia SIEMPRE con un saludo amigable y pregunta si están interesados en compras al por mayor o menor.
2. Cuando el usuario responda sobre su interés en compras al por mayor o menor:
   - Si menciona "menor" o "minorista": Pregúntale por cuántos kilos de aguacate está interesado.
   - Si menciona "mayor" o "mayorista": Infórmale que la venta al por mayor empieza desde 1 tonelada y pregunta cuántas toneladas le interesa adquirir.
3. Realiza cálculos basados en la información proporcionada:
   - Ventas al por menor: Calcula el precio basado en los kilos (1 kg = 4 aguacates aprox. a S/ 2.50 cada uno)
   - Ventas al por mayor: Calcula el precio basado en toneladas (1 tonelada = S/ 10,000)
4. Responde preguntas sobre la venta de aguacates de Inca Fields usando la información de la base de conocimientos.
5. Mantén tus respuestas amigables, naturales y conversacionales.
6. Usa emojis ocasionalmente para ser más amigable, pero sin exagerar.
7. Si no sabes una respuesta específica, sé honesto y ofrece la información general que sí conoces.

Sobre la derivación a especialistas:
- No menciones al especialista inmediatamente.
- Solo después de 5 interacciones, puedes sugerir amablemente "Si deseas información más detallada,
  puedes hablar con uno de nuestros especialistas usando el botón que aparece abajo".
- Haz esta sugerencia de forma natural, como parte de tu respuesta a una pregunta.
`;

// Simulación de respuestas del asistente para no depender de Gemini mientras solucionamos los problemas
const predefinedResponses: { [key: string]: string } = {
  "default": "¡Hola! 👋 Soy el asistente virtual de Inca Fields. ¿Estás interesado en comprar nuestros aguacates al por mayor o menor? Estoy aquí para ayudarte con toda la información que necesites. 🥑",
  "precio": "El precio por tonelada de aguacates es S/ 10,000. También vendemos por unidad a S/ 2.50 cada aguacate. ¿Qué cantidad te gustaría adquirir?",
  "venta": "¡Genial! Realizamos ventas al por mayor en los meses de enero, marzo y mayo. Para compras menores, estamos disponibles todo el año. ¿Qué te interesa específicamente?",
  "disponibilidad": "Actualmente tenemos disponibilidad de aguacates. Para compras al por mayor, los mejores meses son enero, marzo y mayo. ¿Te gustaría conocer más sobre nuestras variedades?",
  "unidad": "El precio por aguacate es S/ 2.50, y para ventas al por mayor ofrecemos precios especiales por tonelada a S/ 10,000. ¿Qué cantidad estás considerando?",
  "variedad": "Trabajamos principalmente con aguacates Hass y Fuerte, que son variedades premium conocidas por su cremosidad y sabor excepcional. ¿Has probado alguna de estas variedades antes?",
  "especialista": "Si deseas información más personalizada sobre tu compra, puedes hablar con uno de nuestros especialistas usando el botón que aparece abajo. Ellos podrán atenderte con detalles específicos para tu caso."
};

// Función para detectar intención de compra al por mayor o menor
function detectarTipoCompra(mensaje: string): 'mayor' | 'menor' | null {
  const mensajeLower = mensaje.toLowerCase();

  // Detectar compra al por mayor
  if (mensajeLower.includes('mayor') ||
      mensajeLower.includes('mayoreo') ||
      mensajeLower.includes('tonelada') ||
      mensajeLower.includes('toneladas') ||
      mensajeLower.includes('grandes cantidades') ||
      mensajeLower.includes('distribuidor') ||
      mensajeLower.includes('wholesale')) {
    return 'mayor';
  }

  // Detectar compra al por menor
  if (mensajeLower.includes('menor') ||
      mensajeLower.includes('minorista') ||
      mensajeLower.includes('unidad') ||
      mensajeLower.includes('unidades') ||
      mensajeLower.includes('kilo') ||
      mensajeLower.includes('kilos') ||
      mensajeLower.includes('retail') ||
      mensajeLower.includes('individual')) {
    return 'menor';
  }

  return null;
}

// Función para calcular precio basado en cantidad
function calcularPrecio(cantidad: number, tipo: 'mayor' | 'menor'): string {
  if (tipo === 'mayor') {
    // Calcular precio por toneladas
    const precio = cantidad * precioTonelada;
    return `Para ${cantidad} tonelada${cantidad > 1 ? 's' : ''} de aguacates, el precio sería S/ ${precio.toLocaleString('es-PE')}. Recuerda que nuestras ventas al por mayor se realizan en los meses de ${periodosMayoreo.join(', ')}.`;
  } else {
    // Calcular precio por kilos
    const aguacatesAproximados = Math.ceil(cantidad / pesoPromedio);
    const precio = aguacatesAproximados * precioUnidad;
    return `Para ${cantidad} kilo${cantidad > 1 ? 's' : ''} de aguacates, necesitarías aproximadamente ${aguacatesAproximados} aguacates, lo que costaría alrededor de S/ ${precio.toFixed(2)}.`;
  }
}

// Función para extraer números de un mensaje
function extraerCantidad(mensaje: string): number | null {
  const matches = mensaje.match(/\d+(\.\d+)?/);
  return matches ? parseFloat(matches[0]) : null;
}

// Función para obtener una respuesta predefinida basada en palabras clave y contexto
function getPredefinedResponse(message: string, messageCount: number, chatHistory: {role: string, content: string}[]): string {
  message = message.toLowerCase();

  // Si es el primer mensaje o hay una pregunta de saludo, dar respuesta de bienvenida
  if (messageCount <= 1 || (message.includes("hola") || message.includes("buenos") || message.includes("saludos"))) {
    return predefinedResponses.default;
  }

  // Consultar base de conocimientos antes de responder
  // En una implementación real, esto consultaría la base de conocimientos mediante embeddings o búsqueda semántica

  // Verificar si es respuesta a pregunta anterior sobre tipo de compra
  if (messageCount > 1) {
    const ultimaPregunta = chatHistory.filter(msg => msg.role === 'assistant').pop()?.content || '';

    // Si la última pregunta fue sobre interés en compra al por mayor o menor
    if (ultimaPregunta.includes('¿Estás interesado en comprar') || ultimaPregunta.includes('por mayor o menor')) {
      const tipoCompra = detectarTipoCompra(message);

      if (tipoCompra === 'mayor') {
        return "Excelente, nuestras ventas al por mayor comienzan desde 1 tonelada de aguacates. ¿Cuántas toneladas te interesaría adquirir? 🥑";
      } else if (tipoCompra === 'menor') {
        return "¡Perfecto! Para ventas al por menor, ¿cuántos kilos de aguacate estarías interesado en comprar? Recuerda que cada aguacate pesa aproximadamente 250 gramos.";
      }
    }

    // Si la pregunta anterior fue sobre cantidad de toneladas o kilos
    if (ultimaPregunta.includes('¿Cuántas toneladas') || ultimaPregunta.includes('tonelada')) {
      const cantidad = extraerCantidad(message);
      if (cantidad !== null) {
        return calcularPrecio(cantidad, 'mayor');
      }
    }

    if (ultimaPregunta.includes('¿cuántos kilos') || ultimaPregunta.includes('kilos de aguacate')) {
      const cantidad = extraerCantidad(message);
      if (cantidad !== null) {
        return calcularPrecio(cantidad, 'menor');
      }
    }
  }

  // Respuestas basadas en palabras clave
  if (message.includes("precio") || message.includes("costo") || message.includes("valor")) {
    return predefinedResponses.precio;
  } else if (message.includes("venta") || message.includes("comprar") || message.includes("adquirir")) {
    return predefinedResponses.venta;
  } else if (message.includes("disponible") || message.includes("hay") || message.includes("stock")) {
    return predefinedResponses.disponibilidad;
  } else if (message.includes("unidad") || message.includes("uno") || message.includes("individual")) {
    return predefinedResponses.unidad;
  } else if (message.includes("variedad") || message.includes("tipo") || message.includes("clase")) {
    return predefinedResponses.variedad;
  }

  // Sugerir especialista solo después de 5 interacciones
  const sugerirEspecialista = messageCount >= 5;
  const preguntaSobreEspecialista = message.includes("contacto") ||
                                   message.includes("especialista") ||
                                   message.includes("hablar") ||
                                   message.includes("persona") ||
                                   message.includes("más información");

  if (preguntaSobreEspecialista) {
    return predefinedResponses.especialista;
  }

  // Respuesta genérica que varía según el número de interacciones
  let respuestaGenerica = "Nuestros aguacates son cultivados con los más altos estándares de calidad. ¿Hay algo específico sobre nuestros productos que te gustaría conocer? 🥑";

  // Añadir sugerencia de especialista después de la 5ª pregunta
  if (sugerirEspecialista) {
    respuestaGenerica += " Si gustarias conversar con un especialista para información más detallada, puedes hacerlo usando el botón en la parte inferior del chat.";
  }

  return respuestaGenerica;
}

// Función para manejar las solicitudes del chatbot
export async function handleChatRequest(req: Request, res: Response) {
  try {
    const { message, chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Se requiere un mensaje', response: "Lo siento, no pude entender tu mensaje. ¿Podrías intentarlo de nuevo?" });
    }

    // Contar cuántos mensajes ha enviado el usuario
    const messageCount = chatHistory.filter((entry: { role: string }) => entry.role === 'user').length + 1;

    // En lugar de usar Gemini (que está dando problemas), usamos respuestas predefinidas
    // Pasamos la historia del chat para poder tener contexto de conversación
    const responseText = getPredefinedResponse(message, messageCount, chatHistory);

    // Simulamos un pequeño retraso para que parezca que está procesando
    setTimeout(() => {
      return res.json({ response: responseText });
    }, 500);

  } catch (error) {
    console.error('Error al procesar la solicitud del chatbot:', error);
    // Asegurarnos de que siempre devolvemos un objeto JSON, incluso en caso de error
    return res.status(500).json({
      error: 'Error al procesar la solicitud',
      response: "Lo siento, hubo un problema técnico. Por favor, intenta de nuevo o contacta directamente con un especialista usando el botón abajo."
    });
  }
}