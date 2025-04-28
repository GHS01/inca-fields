import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { ApiKeyManager } from './apiKeyManager';

// Cargar variables de entorno directamente aquí también
// Intentar cargar desde diferentes archivos
try {
  // Primero intentar con .env.local
  dotenv.config({ path: '.env.local' });

  // Si no se cargó la API key, intentar con .env
  if (!process.env.GEMINI_API_KEY) {
    dotenv.config({ path: '.env' });
  }

  // Si aún no se cargó, intentar con la carga por defecto
  if (!process.env.GEMINI_API_KEY) {
    dotenv.config();
  }
} catch (error) {
  console.error('Error al cargar variables de entorno:', error);
}

// Depuración de variables de entorno
console.log('Variables de entorno cargadas:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- GEMINI_API_KEY está definida:', !!process.env.GEMINI_API_KEY);
console.log('- GEMINI_API_KEY_2 está definida:', !!process.env.GEMINI_API_KEY_2);

// Recopilar todas las claves API disponibles
const apiKeys: string[] = [];

// Añadir la clave principal si está disponible
if (process.env.GEMINI_API_KEY) {
  apiKeys.push(process.env.GEMINI_API_KEY);
  console.log('Clave API principal de Gemini añadida');
}

// Añadir la clave secundaria si está disponible
if (process.env.GEMINI_API_KEY_2) {
  apiKeys.push(process.env.GEMINI_API_KEY_2);
  console.log('Clave API secundaria de Gemini añadida');
}

// Si no hay claves en las variables de entorno, usar la clave de fallback
if (apiKeys.length === 0) {
  // Claves de fallback para desarrollo
  apiKeys.push('AIzaSyCFR2kApUeCGSWOf_tkcLe1XH4qgKjDVJ0'); // Clave principal
  apiKeys.push('AIzaSyBEDtNY0MAWLsHcSn4rObEM_Cp7VdKwDjU'); // Clave secundaria
  console.log('Usando claves API de fallback para desarrollo');
}

// Inicializar el gestor de claves API
const apiKeyManager = new ApiKeyManager(apiKeys);
console.log(`Sistema de rotación de claves API inicializado con ${apiKeyManager.getKeyCount()} claves`);

// Verificar si hay claves API configuradas
if (apiKeyManager.getKeyCount() === 0) {
  console.warn('⚠️ ADVERTENCIA: No hay claves API configuradas. El chatbot usará respuestas predefinidas.');
}

// Interfaz para la información estructurada extraída de la base de conocimientos
interface KnowledgeInfo {
  horarios?: {
    disponible: boolean;
    texto: string;
  };
  ubicaciones?: {
    disponible: boolean;
    texto: string;
  };
  contacto?: {
    disponible: boolean;
    texto: string;
  };
  precios?: {
    disponible: boolean;
    texto: string;
  };
  variedades?: {
    disponible: boolean;
    texto: string;
  };
  [key: string]: any; // Para otras categorías que se puedan añadir en el futuro
}

// Función específica para extraer información de horarios
function extractHorarios(markdownContent: string): { disponible: boolean; texto: string } {
  // Buscar específicamente el ítem de lista sobre horarios en la sección de Información Clave
  // Patrón mejorado para capturar múltiples líneas de horarios
  const horarioItemRegex = /- \*\*Horarios de atención\*\*:(?:\s*)((?:\s*- [^\n]*\n?)+)/i;
  const match = markdownContent.match(horarioItemRegex);

  if (match && match[1]) {
    return { disponible: true, texto: match[1].trim() };
  }

  // Buscar horarios directamente como elementos de lista
  const horariosDirectosRegex = /(?:Horarios|Atención|Atendemos)[^\n]*\n((?:\s*- [^\n]*\n?)+)/i;
  const directMatch = markdownContent.match(horariosDirectosRegex);

  if (directMatch && directMatch[1]) {
    return { disponible: true, texto: directMatch[1].trim() };
  }

  // Buscar en la sección de FAQ
  const faqRegex = /\*\*¿Cuáles son los horarios de atención\?\*\*\s*-\s*([^.]+(?:\.[^-]*)+)/i;
  const faqMatch = markdownContent.match(faqRegex);

  if (faqMatch && faqMatch[1]) {
    return { disponible: true, texto: faqMatch[1].trim() };
  }

  // Buscar en la sección de Respuestas Sugeridas
  const respuestasRegex = /\*\*Consulta sobre horarios\*\*:\s*-\s*"([^"]+)"/i;
  const respuestasMatch = markdownContent.match(respuestasRegex);

  if (respuestasMatch && respuestasMatch[1]) {
    return { disponible: true, texto: respuestasMatch[1].trim() };
  }

  // Último intento: buscar líneas que contengan horarios específicos
  const lineasHorarios = markdownContent.match(/(?:Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)[^:]*:[^\n]+/gi);
  if (lineasHorarios && lineasHorarios.length > 0) {
    return { disponible: true, texto: lineasHorarios.join('\n') };
  }

  return { disponible: false, texto: '' };
}

// Función para extraer información estructurada de la base de conocimientos
function extractKnowledgeInfo(markdownContent: string): KnowledgeInfo {
  const info: KnowledgeInfo = {};

  // Función auxiliar para buscar secciones en el markdown
  const findSection = (sectionName: string): { disponible: boolean; texto: string } => {
    // Buscar encabezados con el nombre de la sección (diferentes niveles)
    const headingRegexes = [
      new RegExp(`## ${sectionName}[\\s\\n]+(.*?)(?=\\n##|$)`, 'is'),
      new RegExp(`### ${sectionName}[\\s\\n]+(.*?)(?=\\n###|\\n##|$)`, 'is'),
      new RegExp(`#### ${sectionName}[\\s\\n]+(.*?)(?=\\n####|\\n###|\\n##|$)`, 'is')
    ];

    // También buscar por palabras clave en el texto
    const keywordRegexes = [
      new RegExp(`(?:${sectionName.toLowerCase()})[^\\n]+\\n+(.*?)(?=\\n\\n|$)`, 'is')
    ];

    // Intentar encontrar la sección por encabezados
    for (const regex of headingRegexes) {
      const match = markdownContent.match(regex);
      if (match && match[1]) {
        return { disponible: true, texto: match[1].trim() };
      }
    }

    // Si no se encuentra por encabezados, buscar por palabras clave
    for (const regex of keywordRegexes) {
      const match = markdownContent.match(regex);
      if (match && match[1]) {
        return { disponible: true, texto: match[1].trim() };
      }
    }

    // Buscar párrafos que contengan la palabra clave
    const paragraphs = markdownContent.split('\n\n');
    for (const paragraph of paragraphs) {
      if (paragraph.toLowerCase().includes(sectionName.toLowerCase())) {
        return { disponible: true, texto: paragraph.trim() };
      }
    }

    return { disponible: false, texto: '' };
  };

  // Extraer información sobre horarios usando la función especializada
  info.horarios = extractHorarios(markdownContent);

  // Si no se encontró con la función especializada, intentar con el método general
  if (!info.horarios.disponible) {
    info.horarios = findSection('Horarios');
    if (!info.horarios.disponible) {
      // Intentar con términos alternativos
      info.horarios = findSection('Atención');
      if (!info.horarios.disponible) {
        info.horarios = findSection('Atendemos');
      }
    }
  }

  // Extraer información sobre ubicaciones
  info.ubicaciones = findSection('Ubicación');
  if (!info.ubicaciones.disponible) {
    info.ubicaciones = findSection('Dirección');
    if (!info.ubicaciones.disponible) {
      info.ubicaciones = findSection('Nos encontramos');
    }
  }

  // Extraer información sobre contacto
  info.contacto = findSection('Contacto');
  if (!info.contacto.disponible) {
    info.contacto = findSection('Teléfono');
    if (!info.contacto.disponible) {
      info.contacto = findSection('Correo');
    }
  }

  // Extraer información sobre precios
  info.precios = findSection('Precios');
  if (!info.precios.disponible) {
    info.precios = findSection('Precio');
    if (!info.precios.disponible) {
      info.precios = findSection('Costo');
    }
  }

  // Extraer información sobre variedades
  info.variedades = findSection('Variedades');
  if (!info.variedades.disponible) {
    info.variedades = findSection('Tipos');
  }

  return info;
}

// Variables para la base de conocimientos
const knowledgeBasePath = path.join(process.cwd(), 'memory', 'conocimientos.markdown');
let knowledgeBase = '';
let knowledgeInfo: KnowledgeInfo = {};
let lastKnowledgeBaseModified = 0;

// Función para cargar y procesar la base de conocimientos
function loadKnowledgeBase() {
  try {
    // Verificar si el archivo ha sido modificado
    const stats = fs.statSync(knowledgeBasePath);
    const currentModified = stats.mtimeMs;

    // Si el archivo no ha cambiado desde la última carga, no hacer nada
    if (lastKnowledgeBaseModified === currentModified && knowledgeBase) {
      return;
    }

    // Cargar el contenido del archivo
    knowledgeBase = fs.readFileSync(knowledgeBasePath, 'utf8');
    lastKnowledgeBaseModified = currentModified;

    // Extraer información estructurada
    knowledgeInfo = extractKnowledgeInfo(knowledgeBase);

    // Imprimir información extraída para depuración
    console.log('Información extraída de la base de conocimientos:');
    for (const [key, value] of Object.entries(knowledgeInfo)) {
      console.log(`- ${key}: ${value.disponible ? 'Disponible' : 'No disponible'}`);
      if (value.disponible) {
        console.log(`  "${value.texto.substring(0, 50)}${value.texto.length > 50 ? '...' : ''}"`);
      }
    }

    console.log(`Base de conocimientos cargada y procesada (${new Date().toLocaleTimeString()})`);
  } catch (error) {
    console.error('Error al cargar la base de conocimientos:', error);
    knowledgeBase = '# Base de Conocimientos no disponible';
    knowledgeInfo = {};
  }
}

// Cargar la base de conocimientos inicialmente
loadKnowledgeBase();

// Configurar un intervalo para verificar cambios en la base de conocimientos (cada 30 segundos)
setInterval(loadKnowledgeBase, 30000);

// Extraer información clave de la base de conocimientos
const precioUnidad = 2.50; // S/ 2.50 por unidad
const pesoPromedio = 0.25; // 0.25 kg o 250g por aguacate
const precioTonelada = 10000; // S/ 10,000 por tonelada
const periodosMayoreo = ['enero', 'marzo', 'mayo'];

// Prompt del sistema para el asistente de ventas (actualizado)
const systemPrompt = `
Eres el asistente virtual amigable de Inca Fields, una empresa especializada en aguacates premium.
Tu objetivo es ayudar a los clientes de manera conversacional y natural, proporcionando ÚNICAMENTE información
que esté presente en la base de conocimientos proporcionada.

Usa EXCLUSIVAMENTE esta base de conocimientos para responder preguntas específicas:
${knowledgeBase}

Instrucciones importantes:
1. Inicia SIEMPRE con un saludo amigable y pregunta si están interesados en compras al por mayor o menor.
2. Cuando el usuario responda sobre su interés en compras al por mayor o menor:
   - Si menciona "menor" o "minorista": Pregúntale por cuántos kilos de aguacate está interesado.
   - Si menciona "mayor" o "mayorista": Infórmale que la venta al por mayor empieza desde 1 tonelada y pregunta cuántas toneladas le interesa adquirir.
3. Realiza cálculos basados en la información proporcionada:
   - Ventas al por menor: Calcula el precio basado en los kilos (1 kg = 4 aguacates aprox. a S/ 2.50 cada uno)
   - Ventas al por mayor: Calcula el precio basado en toneladas (1 tonelada = S/ 10,000)
4. Responde preguntas ÚNICAMENTE usando la información de la base de conocimientos proporcionada.
5. Mantén tus respuestas amigables, naturales y conversacionales.
6. Usa emojis ocasionalmente para ser más amigable, pero sin exagerar.
7. NUNCA INVENTES INFORMACIÓN que no esté en la base de conocimientos.

Cuando no tengas información sobre algo:
- Si el usuario pregunta sobre información que NO está en la base de conocimientos (como horarios de atención, ubicaciones específicas, nombres de empleados, etc.), responde: "Actualmente no manejo esa información. Te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo."
- NO INVENTES respuestas ni proporciones información que no esté explícitamente en la base de conocimientos.
- NO ASUMAS información basada en conocimiento general o experiencias típicas.

Sobre la derivación a especialistas:
- Deriva al especialista inmediatamente cuando te pregunten algo que no esté en la base de conocimientos.
- Para otras consultas, solo después de 5 interacciones, puedes sugerir amablemente "Si deseas información más detallada,
  puedes hablar con uno de nuestros especialistas usando el botón que aparece abajo".
- Haz esta sugerencia de forma natural, como parte de tu respuesta a una pregunta.
`;

// Simulación de respuestas del asistente para no depender de Gemini mientras solucionamos los problemas
const predefinedResponses: { [key: string]: { [key: string]: string } } = {
  // Respuestas generales
  "general": {
    "default": "¡Hola! 👋 Soy el asistente virtual de Inca Fields. ¿Estás interesado en comprar nuestros aguacates al por mayor o menor? Estoy aquí para ayudarte con toda la información que necesites. 🥑",
    "greeting": "¡Hola! Bienvenido a Inca Fields. ¿En qué puedo ayudarte hoy? ¿Estás interesado en compras al por mayor o al por menor? 🥑",
    "thanks": "¡Gracias por tu interés en Inca Fields! Estamos para servirte con los mejores aguacates del mercado.",
    "goodbye": "¡Gracias por contactar a Inca Fields! Si tienes más preguntas en el futuro, no dudes en escribirnos. ¡Que tengas un excelente día! 🥑",
    "unknown": "No estoy seguro de entender tu consulta. ¿Podrías reformularla? Puedo ayudarte con información sobre precios, disponibilidad, entregas o métodos de pago.",
    "especialista": "Si deseas información más personalizada sobre tu compra, puedes hablar con uno de nuestros especialistas usando el botón que aparece abajo. Ellos podrán atenderte con detalles específicos para tu caso."
  },

  // Respuestas para información no disponible
  "no_disponible": {
    "horarios": "Actualmente no manejo información sobre horarios de atención. Te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.",
    "ubicacion": "Actualmente no manejo información sobre ubicaciones o direcciones específicas. Te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.",
    "contacto": "Actualmente no manejo información de contacto específica. Te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.",
    "personal": "Actualmente no manejo información sobre el personal o equipo de Inca Fields. Te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.",
    "default": "Actualmente no manejo esa información. Te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo."
  },

  // Respuestas para ventas al por mayor
  "mayor": {
    "intro": "¡Excelente! Para ventas al por mayor, nuestro precio es de S/ 10,000 por tonelada. Las ventas mayoristas están disponibles en los meses de enero, marzo y mayo. ¿Cuántas toneladas te interesaría adquirir?",
    "precio": "El precio por tonelada de aguacates es S/ 10,000. Para pedidos de 5+ toneladas, ofrecemos precios negociables. ¿Qué volumen estás considerando?",
    "disponibilidad": "Para compras al por mayor, los mejores meses son enero, marzo y mayo, que coinciden con nuestros períodos de mayor producción. ¿Ya tienes en mente cuándo realizarías tu compra?",
    "entrega": "La entrega de pedidos al por mayor se realiza en camiones de 5 a 10 toneladas, en un plazo de 3-7 días hábiles después de confirmar el pedido. ¿Necesitas información sobre alguna ubicación específica?",
    "pago": "Para ventas al por mayor, aceptamos un depósito inicial del 50% y el resto contra entrega. Los pagos pueden realizarse mediante transferencia bancaria o depósito. ¿Te gustaría conocer nuestras cuentas bancarias?",
    "cantidad": "Una tonelada equivale a aproximadamente 4,000 aguacates. Para pedidos mayoristas, el mínimo es de 1 tonelada. ¿Qué cantidad te interesaría adquirir?",
    "calidad": "Nuestros aguacates mayoristas cumplen con los más altos estándares de calidad y están certificados para exportación. Trabajamos principalmente con la variedad Hass, conocida por su excelente sabor y durabilidad."
  },

  // Respuestas para ventas al por menor
  "menor": {
    "intro": "¡Perfecto! Para ventas al por menor, el precio es de S/ 2.50 por unidad o S/ 6.50 por kilogramo. Estamos disponibles todo el año. ¿Cuántos kilos o unidades te gustaría comprar?",
    "precio": "El precio por aguacate es S/ 2.50 la unidad, o S/ 6.50 por kilogramo (aproximadamente 4 aguacates). Ofrecemos descuentos para compras mayores a 10 kg. ¿Qué cantidad necesitas?",
    "disponibilidad": "Tenemos aguacates disponibles todo el año para ventas al por menor. Siempre trabajamos con producto fresco de temporada. ¿Te gustaría hacer un pedido ahora?",
    "entrega": "Para ventas al por menor, ofrecemos entrega a domicilio en 1-3 días hábiles. El envío es gratuito para pedidos mayores a 10 kg en Lima. ¿Cuál sería tu dirección de entrega?",
    "pago": "Para compras al por menor aceptamos efectivo, transferencias bancarias, Yape y Plin. El pago debe realizarse completo antes de la entrega. ¿Qué método de pago prefieres?",
    "cantidad": "Cada aguacate pesa aproximadamente 250 gramos, por lo que 1 kg equivale a unos 4 aguacates. ¿Cuántos kilos te gustaría comprar?",
    "calidad": "Nuestros aguacates para venta al por menor son seleccionados cuidadosamente para garantizar la mejor calidad. Trabajamos principalmente con las variedades Hass y Fuerte, conocidas por su cremosidad y sabor excepcional."
  },

  // Respuestas sobre variedades y productos
  "producto": {
    "variedad": "Trabajamos principalmente con aguacates Hass y Fuerte, que son variedades premium conocidas por su cremosidad y sabor excepcional. ¿Has probado alguna de estas variedades antes?",
    "organico": "Sí, ofrecemos aguacates orgánicos certificados bajo pedido. Estos son cultivados sin pesticidas ni químicos sintéticos, respetando el medio ambiente. ¿Te interesaría conocer más sobre nuestros productos orgánicos?",
    "beneficios": "Los aguacates son conocidos como 'superalimentos' por su alto contenido de grasas saludables, fibra, vitaminas y minerales. Son excelentes para la salud cardiovascular y tienen propiedades antiinflamatorias.",
    "conservacion": "Para conservar tus aguacates, mantén los que están duros a temperatura ambiente hasta que maduren. Una vez maduros, puedes refrigerarlos para extender su vida útil por 2-3 días adicionales."
  }
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
    return predefinedResponses.general.greeting;
  }

  // Detectar preguntas sobre información específica
  const esConsultaHorarios = message.includes("horario") ||
                            message.includes("atienden") ||
                            message.includes("abierto") ||
                            message.includes("cerrado") ||
                            message.includes("días") ||
                            message.includes("dias") ||
                            (message.includes("cuando") && message.includes("abren"));

  const esConsultaUbicacion = message.includes("ubicación") ||
                             message.includes("ubicacion") ||
                             message.includes("dirección") ||
                             message.includes("direccion") ||
                             message.includes("donde") ||
                             message.includes("dónde") ||
                             message.includes("local") ||
                             message.includes("tienda") ||
                             message.includes("sucursal");

  const esConsultaContacto = message.includes("teléfono") ||
                            message.includes("telefono") ||
                            message.includes("celular") ||
                            message.includes("whatsapp") ||
                            message.includes("correo") ||
                            message.includes("email") ||
                            message.includes("contactar") ||
                            message.includes("contacto");

  const esConsultaPersonal = message.includes("gerente") ||
                            message.includes("dueño") ||
                            message.includes("encargado") ||
                            message.includes("jefe") ||
                            message.includes("vendedor") ||
                            message.includes("trabajador") ||
                            message.includes("empleado");

  // Responder con información de la base de conocimientos si está disponible
  if (esConsultaHorarios && knowledgeInfo.horarios?.disponible) {
    // Formatear la respuesta sobre horarios para que sea más clara y concisa
    const horarioTexto = knowledgeInfo.horarios.texto;

    // Verificar si la pregunta es específicamente sobre domingos
    if (message.toLowerCase().includes('domingo')) {
      // Buscar específicamente información sobre domingos en el texto de horarios
      const lineasHorarios = horarioTexto.split('\n');
      const domingoInfo = lineasHorarios.find(line => line.toLowerCase().includes('domingo'));

      if (domingoInfo) {
        // Limpiar el texto para eliminar caracteres markdown
        const domingoLimpio = domingoInfo
          .replace(/\s*-\s*/, '') // Eliminar guión inicial
          .replace(/\*\*/g, '') // Eliminar asteriscos de negrita
          .trim();

        return `${domingoLimpio}`;
      }
    }

    // Limpiar el texto para eliminar caracteres markdown y formatear mejor
    const horarioLimpio = horarioTexto
      .replace(/\n\s*-\s*/g, '\n• ') // Convertir guiones a bullets
      .replace(/\*\*/g, '') // Eliminar asteriscos de negrita
      .trim();

    return `Nuestros horarios de atención son:\n${horarioLimpio}`;
  } else if (esConsultaUbicacion && knowledgeInfo.ubicaciones?.disponible) {
    return `Sobre nuestra ubicación: ${knowledgeInfo.ubicaciones.texto}`;
  } else if (esConsultaContacto && knowledgeInfo.contacto?.disponible) {
    return `Información de contacto: ${knowledgeInfo.contacto.texto}`;
  }

  // Si no hay información disponible en la base de conocimientos, usar respuestas predefinidas
  if (esConsultaHorarios && !knowledgeInfo.horarios?.disponible) {
    return predefinedResponses.no_disponible.horarios;
  } else if (esConsultaUbicacion && !knowledgeInfo.ubicaciones?.disponible) {
    return predefinedResponses.no_disponible.ubicacion;
  } else if (esConsultaContacto && !knowledgeInfo.contacto?.disponible) {
    return predefinedResponses.no_disponible.contacto;
  } else if (esConsultaPersonal) {
    return predefinedResponses.no_disponible.personal;
  }

  // Detectar tipo de compra (mayor o menor)
  const tipoCompra = detectarTipoCompra(message);

  // Verificar si es respuesta a pregunta anterior sobre tipo de compra
  if (messageCount > 1) {
    const ultimaPregunta = chatHistory.filter(msg => msg.role === 'assistant').pop()?.content || '';

    // Si la última pregunta fue sobre interés en compra al por mayor o menor
    if (ultimaPregunta.includes('¿Estás interesado en comprar') ||
        ultimaPregunta.includes('por mayor o menor') ||
        ultimaPregunta.includes('al por mayor o al por menor')) {

      if (tipoCompra === 'mayor') {
        return predefinedResponses.mayor.intro;
      } else if (tipoCompra === 'menor') {
        return predefinedResponses.menor.intro;
      }
    }

    // Si la pregunta anterior fue sobre cantidad de toneladas o kilos
    if (ultimaPregunta.includes('toneladas') || ultimaPregunta.includes('tonelada')) {
      const cantidad = extraerCantidad(message);
      if (cantidad !== null) {
        return calcularPrecio(cantidad, 'mayor');
      }
    }

    if (ultimaPregunta.includes('kilos') || ultimaPregunta.includes('unidades')) {
      const cantidad = extraerCantidad(message);
      if (cantidad !== null) {
        return calcularPrecio(cantidad, 'menor');
      }
    }
  }

  // Detectar intención de la pregunta
  const esConsultaPrecio = message.includes("precio") || message.includes("costo") || message.includes("valor") || message.includes("cuánto") || message.includes("cuanto");
  const esConsultaDisponibilidad = message.includes("disponible") || message.includes("hay") || message.includes("stock") || message.includes("cuando") || message.includes("cuándo") || message.includes("temporada");
  const esConsultaEntrega = message.includes("entrega") || message.includes("envío") || message.includes("envio") || message.includes("despacho") || message.includes("transporte") || message.includes("llega");
  const esConsultaPago = message.includes("pago") || message.includes("pagar") || message.includes("transferencia") || message.includes("efectivo") || message.includes("yape") || message.includes("plin");
  const esConsultaProducto = message.includes("variedad") || message.includes("tipo") || message.includes("clase") || message.includes("orgánico") || message.includes("organico") || message.includes("calidad");
  const esAgradecimiento = message.includes("gracias") || message.includes("agradezco") || message.includes("agradecido");
  const esDespedida = message.includes("adiós") || message.includes("adios") || message.includes("hasta luego") || message.includes("chau");

  // Respuestas basadas en la intención detectada
  if (esAgradecimiento) {
    return predefinedResponses.general.thanks;
  } else if (esDespedida) {
    return predefinedResponses.general.goodbye;
  }

  // Si sabemos el tipo de compra (mayor o menor), dar respuestas específicas
  if (tipoCompra) {
    if (esConsultaPrecio) {
      return predefinedResponses[tipoCompra].precio;
    } else if (esConsultaDisponibilidad) {
      return predefinedResponses[tipoCompra].disponibilidad;
    } else if (esConsultaEntrega) {
      return predefinedResponses[tipoCompra].entrega;
    } else if (esConsultaPago) {
      return predefinedResponses[tipoCompra].pago;
    }
  }

  // Respuestas sobre productos independientemente del tipo de compra
  if (esConsultaProducto) {
    if (message.includes("orgánico") || message.includes("organico")) {
      return predefinedResponses.producto.organico;
    } else if (message.includes("beneficio") || message.includes("salud") || message.includes("nutrición") || message.includes("nutricion")) {
      return predefinedResponses.producto.beneficios;
    } else if (message.includes("conservar") || message.includes("guardar") || message.includes("almacenar") || message.includes("duran")) {
      return predefinedResponses.producto.conservacion;
    } else {
      return predefinedResponses.producto.variedad;
    }
  }

  // Sugerir especialista solo después de 5 interacciones
  const sugerirEspecialista = messageCount >= 5;
  const preguntaSobreEspecialista = message.includes("contacto") ||
                                   message.includes("especialista") ||
                                   message.includes("hablar") ||
                                   message.includes("persona") ||
                                   message.includes("más información");

  if (preguntaSobreEspecialista) {
    return predefinedResponses.general.especialista;
  }

  // Respuesta genérica que varía según el número de interacciones
  let respuestaGenerica = "Nuestros aguacates son cultivados con los más altos estándares de calidad. ¿Hay algo específico sobre nuestros productos que te gustaría conocer? 🥑";

  // Añadir sugerencia de especialista después de la 5ª pregunta
  if (sugerirEspecialista) {
    respuestaGenerica += " Si deseas conversar con un especialista para información más detallada, puedes hacerlo usando el botón en la parte inferior del chat.";
  }

  return respuestaGenerica;
}

// Ya no necesitamos el rateLimiter, ahora usamos el apiKeyManager

// Función para verificar si una respuesta contiene información inventada
function verificarRespuestaInventada(respuesta: string, pregunta: string): boolean {
  // Convertir a minúsculas para facilitar la comparación
  const respuestaLower = respuesta.toLowerCase();
  const preguntaLower = pregunta.toLowerCase();

  // Detectar tipo de pregunta
  const esConsultaHorarios = preguntaLower.includes("horario") ||
                            preguntaLower.includes("atienden") ||
                            preguntaLower.includes("abierto") ||
                            preguntaLower.includes("cerrado") ||
                            preguntaLower.includes("días") ||
                            preguntaLower.includes("dias") ||
                            (preguntaLower.includes("cuando") && preguntaLower.includes("abren"));

  const esConsultaUbicacion = preguntaLower.includes("ubicación") ||
                             preguntaLower.includes("ubicacion") ||
                             preguntaLower.includes("dirección") ||
                             preguntaLower.includes("direccion") ||
                             preguntaLower.includes("donde") ||
                             preguntaLower.includes("dónde") ||
                             preguntaLower.includes("local") ||
                             preguntaLower.includes("tienda") ||
                             preguntaLower.includes("sucursal");

  const esConsultaContacto = preguntaLower.includes("teléfono") ||
                            preguntaLower.includes("telefono") ||
                            preguntaLower.includes("celular") ||
                            preguntaLower.includes("whatsapp") ||
                            preguntaLower.includes("correo") ||
                            preguntaLower.includes("email") ||
                            preguntaLower.includes("contactar") ||
                            preguntaLower.includes("contacto");

  // Si la información está disponible en la base de conocimientos, no es inventada
  if (esConsultaHorarios && knowledgeInfo.horarios?.disponible) {
    // Verificar si la respuesta contiene la información de la base de conocimientos
    const horarioTexto = knowledgeInfo.horarios.texto.toLowerCase();

    // Si la pregunta es específicamente sobre domingos
    if (preguntaLower.includes('domingo')) {
      // Buscar específicamente información sobre domingos en el texto de horarios
      const lineasHorarios = horarioTexto.split('\n');
      const domingoInfo = lineasHorarios.find(line => line.includes('domingo'));

      if (domingoInfo && respuestaLower.includes(domingoInfo)) {
        return false; // La información sobre domingos está en la base de conocimientos
      }
    } else if (respuestaLower.includes(horarioTexto)) {
      return false; // La información completa está en la base de conocimientos
    }

    // Verificar si la respuesta contiene fragmentos de la información de horarios
    const lineasHorarios = horarioTexto.split('\n');
    const contieneFragmentos = lineasHorarios.some(linea => {
      if (linea.trim() && respuestaLower.includes(linea.trim())) {
        return true;
      }
      return false;
    });

    if (contieneFragmentos) {
      return false; // La respuesta contiene fragmentos válidos de la información de horarios
    }
  }

  if (esConsultaUbicacion && knowledgeInfo.ubicaciones?.disponible) {
    if (respuestaLower.includes(knowledgeInfo.ubicaciones.texto.toLowerCase())) {
      return false; // La información está en la base de conocimientos
    }
  }

  if (esConsultaContacto && knowledgeInfo.contacto?.disponible) {
    if (respuestaLower.includes(knowledgeInfo.contacto.texto.toLowerCase())) {
      return false; // La información está en la base de conocimientos
    }
  }

  // Patrones de información que no está en la base de conocimientos
  const patronesProhibidos = [
    // Horarios de atención
    { patron: /(?:atendemos|abrimos|horario|horarios|atención).*?(?:\d{1,2}[:.]\d{2}|(?:\d{1,2})(?:\s*(?:am|pm|a\.m\.|p\.m\.))|(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo))/i,
      tema: "horarios de atención" },

    // Ubicaciones específicas
    { patron: /(?:ubicad[oa]s?|localizad[oa]s?|direcciones?|sucursales?|tiendas?|locales?|nos encontr(?:amos|arás)|estamos en).*?(?:calle|avenida|av\.|jr\.|jiron|distrito|provincia|región)/i,
      tema: "ubicaciones o direcciones" },

    // Nombres de empleados o personal
    { patron: /(?:nuestro|nuestra|el|la).*?(?:gerente|supervisor|encargad[oa]|jefe|director[a]|vendedor[a]|representante|especialista).*?(?:se llama|es|será)/i,
      tema: "nombres de personal" },

    // Métodos de contacto específicos que no están en la base
    { patron: /(?:teléfono|celular|móvil|whatsapp|correo|email|e-mail).*?(?:\d{6,}|@|arroba)/i,
      tema: "información de contacto específica" }
  ];

  // Verificar si la pregunta es sobre alguno de estos temas
  const esPreguntaSobreTemaProhibido = patronesProhibidos.some(({ patron }) =>
    preguntaLower.match(patron)
  );

  // Si la pregunta es sobre un tema prohibido, verificar si la respuesta contiene información inventada
  if (esPreguntaSobreTemaProhibido) {
    for (const { patron, tema } of patronesProhibidos) {
      if (respuestaLower.match(patron)) {
        console.log(`Detectada posible información inventada sobre ${tema} en la respuesta`);
        return true;
      }
    }
  }

  // Verificar si la respuesta contiene frases que indican información específica que no está en la base
  // Obtener las frases reales de la base de conocimientos para compararlas
  let frasesReales: string[] = [];
  if (knowledgeInfo.horarios?.disponible) {
    const horarioTexto = knowledgeInfo.horarios.texto.toLowerCase();
    // Extraer frases reales de los horarios
    frasesReales = horarioTexto.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Extraer partes clave como días y horas
        const matches = line.match(/(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo|([0-9]{1,2}:[0-9]{2}\s*(?:am|pm|a\.m\.|p\.m\.)?))/gi);
        return matches || [];
      })
      .flat();
  }

  // Frases que se considerarían inventadas si no están en la base de conocimientos
  const frasesEspecificas = [
    "lunes a viernes", "sábados", "domingos", "9:00", "6:00",
    "abrimos", "cerramos", "no atendemos", "feriados", "permanecemos cerrados"
  ].filter(frase => !frasesReales.some(fraseReal => fraseReal.includes(frase.toLowerCase())));

  // Si la pregunta es sobre horarios y la respuesta contiene frases específicas
  if (esConsultaHorarios && !knowledgeInfo.horarios?.disponible) {
    for (const frase of frasesEspecificas) {
      if (respuestaLower.includes(frase)) {
        console.log(`Detectada posible información inventada sobre horarios en la respuesta`);
        return true;
      }
    }
  }

  return false;
}

// Respuesta predefinida para cuando se detecta información inventada
const respuestaNoDisponible = "Actualmente no manejo esa información. Te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.";

// Función para realizar la llamada a la API de Gemini
async function callGeminiAPI(userMessage: string, chatHistory: {role: string, content: string}[]) {
  try {
    // Obtener la siguiente clave API disponible
    const apiKey = apiKeyManager.getNextAvailableKey();

    // Si no hay claves disponibles, lanzar error
    if (!apiKey) {
      const waitTime = apiKeyManager.getTimeUntilAvailable();
      console.log(`Todas las claves API han alcanzado su límite. Tiempo estimado de espera: ${Math.ceil(waitTime/1000)} segundos.`);
      throw new Error('Límite de solicitudes a Gemini API alcanzado. Usando respuestas predefinidas.');
    }

    // URL correcta para la API de Gemini con la clave seleccionada
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    // Preparar el contenido con el formato correcto de la API v1
    const contents = [];

    // Primero agregamos el mensaje de sistema como primer mensaje del usuario
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });

    // Agregar el historial de chat en el formato correcto
    for (const msg of chatHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    // Agregar el mensaje actual del usuario
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    // Cuerpo de la solicitud con el formato correcto de la API v1
    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.6,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 800
      }
    };

    // Realizar la solicitud a la API
    console.log('Enviando solicitud a Gemini API (v1)...');

    // Registrar el uso de esta clave API
    apiKeyManager.trackKeyUsage(apiKey);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // Procesar la respuesta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Gemini API:', errorText);

      // Si el error es por límite de tasa (429), intentar con otra clave
      if (response.status === 429) {
        console.log('Error 429: Límite de tasa excedido. Intentando con otra clave API...');
        // Intentar de nuevo con la siguiente clave (llamada recursiva)
        return await callGeminiAPI(userMessage, chatHistory);
      }

      throw new Error(`Error al llamar a Gemini API: ${response.status} ${response.statusText}`);
    }

    interface GeminiResponse {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
        finishReason?: string;
      }>;
    }

    const responseData = await response.json() as GeminiResponse;

    // Extraer el texto de la respuesta (formato API v1)
    if (responseData.candidates &&
        responseData.candidates[0] &&
        responseData.candidates[0].content &&
        responseData.candidates[0].content.parts &&
        responseData.candidates[0].content.parts[0] &&
        responseData.candidates[0].content.parts[0].text) {

      const respuestaTexto = responseData.candidates[0].content.parts[0].text;
      console.log('Respuesta de Gemini recibida correctamente');
      return respuestaTexto;
    } else {
      console.warn('Estructura de respuesta inesperada de Gemini:', JSON.stringify(responseData));
      throw new Error('No se pudo extraer respuesta de Gemini API');
    }
  } catch (error) {
    console.error('Error al llamar a Gemini API:', error);
    throw error;
  }
}

// Función para obtener respuestas
async function getResponse(message: string, chatHistory: {role: string, content: string}[]) {
  try {
    console.log('Procesando mensaje:', message);

    // Recargar la base de conocimientos para asegurarnos de tener la información más actualizada
    loadKnowledgeBase();

    // Contar cuántos mensajes ha enviado el usuario
    const messageCount = chatHistory.filter(msg => msg.role === 'user').length + 1;

    // Ya no necesitamos verificar la API key aquí, el apiKeyManager se encarga de eso

    // Detectar tipo de pregunta para verificar si tenemos información en la base de conocimientos
    const messageLower = message.toLowerCase();
    const esConsultaHorarios = messageLower.includes("horario") ||
                              messageLower.includes("atienden") ||
                              (messageLower.includes("cuando") && messageLower.includes("abren"));
    const esConsultaUbicacion = messageLower.includes("ubicacion") ||
                               messageLower.includes("ubicación") ||
                               messageLower.includes("donde") ||
                               messageLower.includes("dónde");
    const esConsultaContacto = messageLower.includes("contacto") ||
                              messageLower.includes("teléfono") ||
                              messageLower.includes("telefono");

    // Intentar usar Gemini API si hay claves API disponibles
    if (apiKeyManager.getKeyCount() > 0) {
      try {
        console.log('Usando Gemini API para generar respuesta...');
        const geminiResponse = await callGeminiAPI(message, chatHistory);

        // Verificar si la respuesta contiene información inventada
        if (verificarRespuestaInventada(geminiResponse, message)) {
          console.log('Respuesta de Gemini contiene información inventada. Verificando base de conocimientos...');

          // Verificar si tenemos información en la base de conocimientos para esta pregunta
          if (esConsultaHorarios && knowledgeInfo.horarios?.disponible) {
            // Formatear la respuesta sobre horarios para que sea más clara y concisa
            const horarioTexto = knowledgeInfo.horarios.texto;

            // Verificar si la pregunta es específicamente sobre domingos
            if (message.toLowerCase().includes('domingo')) {
              // Buscar específicamente información sobre domingos en el texto de horarios
              const lineasHorarios = horarioTexto.split('\n');
              const domingoInfo = lineasHorarios.find(line => line.toLowerCase().includes('domingo'));

              if (domingoInfo) {
                // Limpiar el texto para eliminar caracteres markdown
                const domingoLimpio = domingoInfo
                  .replace(/\s*-\s*/, '') // Eliminar guión inicial
                  .replace(/\*\*/g, '') // Eliminar asteriscos de negrita
                  .trim();

                return `${domingoLimpio}`;
              }
            }

            // Limpiar el texto para eliminar caracteres markdown y formatear mejor
            const horarioLimpio = horarioTexto
              .replace(/\n\s*-\s*/g, '\n• ') // Convertir guiones a bullets
              .replace(/\*\*/g, '') // Eliminar asteriscos de negrita
              .trim();

            return `Nuestros horarios de atención son:\n${horarioLimpio}`;
          } else if (esConsultaUbicacion && knowledgeInfo.ubicaciones?.disponible) {
            return `Sobre nuestra ubicación: ${knowledgeInfo.ubicaciones.texto}`;
          } else if (esConsultaContacto && knowledgeInfo.contacto?.disponible) {
            return `Información de contacto: ${knowledgeInfo.contacto.texto}`;
          }

          return respuestaNoDisponible;
        }

        return geminiResponse;
      } catch (error) {
        console.error('Error con Gemini API, usando respuestas predefinidas como fallback:', error);

        // Verificar si tenemos información en la base de conocimientos para esta pregunta
        if (esConsultaHorarios && knowledgeInfo.horarios?.disponible) {
          // Formatear la respuesta sobre horarios para que sea más clara y concisa
          const horarioTexto = knowledgeInfo.horarios.texto;

          // Verificar si la pregunta es específicamente sobre domingos
          if (message.toLowerCase().includes('domingo')) {
            // Buscar específicamente información sobre domingos en el texto de horarios
            const lineasHorarios = horarioTexto.split('\n');
            const domingoInfo = lineasHorarios.find(line => line.toLowerCase().includes('domingo'));

            if (domingoInfo) {
              // Limpiar el texto para eliminar caracteres markdown
              const domingoLimpio = domingoInfo
                .replace(/\s*-\s*/, '') // Eliminar guión inicial
                .replace(/\*\*/g, '') // Eliminar asteriscos de negrita
                .trim();

              return `${domingoLimpio}`;
            }
          }

          // Limpiar el texto para eliminar caracteres markdown y formatear mejor
          const horarioLimpio = horarioTexto
            .replace(/\n\s*-\s*/g, '\n• ') // Convertir guiones a bullets
            .replace(/\*\*/g, '') // Eliminar asteriscos de negrita
            .trim();

          return `Nuestros horarios de atención son:\n${horarioLimpio}`;
        } else if (esConsultaUbicacion && knowledgeInfo.ubicaciones?.disponible) {
          return `Sobre nuestra ubicación: ${knowledgeInfo.ubicaciones.texto}`;
        } else if (esConsultaContacto && knowledgeInfo.contacto?.disponible) {
          return `Información de contacto: ${knowledgeInfo.contacto.texto}`;
        }

        return getPredefinedResponse(message, messageCount, chatHistory);
      }
    } else {
      // Si no hay claves API disponibles, usar respuestas predefinidas
      console.log('No hay claves API disponibles, usando respuestas predefinidas...');
      return getPredefinedResponse(message, messageCount, chatHistory);
    }
  } catch (error) {
    console.error('Error al generar respuesta:', error);
    return "Lo siento, hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.";
  }
}

// Función para manejar las solicitudes del chatbot
export async function handleChatRequest(req: Request, res: Response) {
  try {
    // Extraer mensaje y historial del chat
    const { message, chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        response: "Lo siento, no pude entender tu mensaje. ¿Podrías intentarlo de nuevo?"
      });
    }

    // Validar el formato del historial de chat
    const validatedChatHistory = validateChatHistory(chatHistory);

    // Limitar el historial a las últimas 10 interacciones para evitar tokens excesivos
    const limitedChatHistory = validatedChatHistory.slice(-10);

    console.log(`Historial de chat recibido: ${limitedChatHistory.length} mensajes`);

    // Obtener respuesta usando la función que ahora soporta Gemini
    const responseText = await getResponse(message, limitedChatHistory);

    // Devolver respuesta como JSON
    return res.status(200).json({ response: responseText });

  } catch (error) {
    console.error('Error al procesar la solicitud del chatbot:', error);

    // Respuesta de error simplificada
    return res.status(200).json({
      response: "Lo siento, hubo un problema técnico. Por favor, intenta de nuevo o contacta directamente con un especialista usando el botón abajo."
    });
  }
}

// Función para validar el formato del historial de chat
function validateChatHistory(chatHistory: any[]): {role: string, content: string}[] {
  if (!Array.isArray(chatHistory)) {
    console.warn('El historial de chat no es un array. Usando array vacío.');
    return [];
  }

  return chatHistory.filter(msg => {
    if (!msg || typeof msg !== 'object') {
      console.warn('Mensaje inválido en el historial:', msg);
      return false;
    }

    if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
      console.warn('Rol inválido en el mensaje:', msg.role);
      return false;
    }

    if (!msg.content || typeof msg.content !== 'string') {
      console.warn('Contenido inválido en el mensaje:', msg.content);
      return false;
    }

    return true;
  });
}