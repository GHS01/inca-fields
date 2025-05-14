/**
 * Respuestas predefinidas para cuando la API no está disponible
 *
 * Este archivo utiliza las respuestas generadas automáticamente durante el proceso de construcción
 * que contienen información extraída del archivo markdown.
 */

import { KEYWORDS } from '@/config/fallback';

// Intentar importar las respuestas generadas
let FALLBACK_RESPONSES: {
  mayoreo: {
    precio: string;
    disponibilidad: string;
    entrega: string;
    pago: string;
    default: string;
  };
  menudeo: {
    precio: string;
    disponibilidad: string;
    entrega: string;
    pago: string;
    default: string;
  };
  general: {
    default: string;
    horarios: string;
    contacto: string;
    ubicacion: string;
  };
};

try {
  // Intentar importar el archivo generado
  const generatedModule = require('@/generated/fallback-responses');
  FALLBACK_RESPONSES = generatedModule.FALLBACK_RESPONSES;
  console.debug('Respuestas de fallback cargadas desde el archivo generado');
} catch (error) {
  console.warn('No se pudo cargar el archivo generado de respuestas de fallback. Usando contenido de fallback.');
  console.warn('Este mensaje es normal durante el desarrollo. En producción, el archivo debería existir.');
  console.warn('Error:', error);

  // Respuestas de fallback para desarrollo (se usarán solo si el archivo generado no existe)
  FALLBACK_RESPONSES = {
    mayoreo: {
      precio: 'Para compras al por mayor, contacte a un mayorista para obtener información sobre precios actualizados.',
      disponibilidad: 'Los aguacates al por mayor están disponibles en temporadas específicas. Contacte para más información.',
      entrega: 'Para pedidos al por mayor, ofrecemos entrega según acuerdo con el cliente.',
      pago: 'Aceptamos diversos métodos de pago para compras al por mayor.',
      default: 'Para compras al por mayor, contacte a un mayorista para obtener información detallada.'
    },
    menudeo: {
      precio: 'El precio de nuestros aguacates al por menor es de S/ 6.50 por kilogramo aproximadamente.',
      disponibilidad: 'Nuestros aguacates al por menor están disponibles durante todo el año, sujeto a disponibilidad.',
      entrega: 'Para compras al por menor, ofrecemos entrega a domicilio o recogida en puntos de venta.',
      pago: 'Aceptamos diversos métodos de pago para compras al por menor.',
      default: 'Para compras al por menor, ofrecemos aguacates de alta calidad a precios competitivos.'
    },
    general: {
      default: 'Actualmente no manejo esa información, te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.',
      horarios: 'Contacte para información sobre nuestros horarios de atención.',
      contacto: 'Puedes contactarnos usando el botón que aparece abajo para hablar con un especialista.',
      ubicacion: 'Para información sobre nuestra ubicación, por favor contacta con uno de nuestros especialistas.'
    }
  };
}

// Exportar las respuestas para uso en el código
export const RESPUESTAS_MAYOREO = FALLBACK_RESPONSES.mayoreo;
export const RESPUESTAS_MENUDEO = FALLBACK_RESPONSES.menudeo;
export const RESPUESTAS_GENERALES = FALLBACK_RESPONSES.general;

/**
 * Detecta el tipo de consulta basado en palabras clave
 */
export function detectQueryType(message: string): 'mayoreo' | 'menudeo' | 'unknown' {
  const lowerMessage = message.toLowerCase();

  // Verificar mayoreo
  for (const keyword of KEYWORDS.mayoreo) {
    if (lowerMessage.includes(keyword)) {
      return 'mayoreo';
    }
  }

  // Verificar menudeo
  for (const keyword of KEYWORDS.menudeo) {
    if (lowerMessage.includes(keyword)) {
      return 'menudeo';
    }
  }

  return 'unknown';
}

/**
 * Detecta si es una pregunta sobre precios
 */
export function isPriceQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return KEYWORDS.precio.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Detecta si es una pregunta sobre disponibilidad
 */
export function isAvailabilityQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return KEYWORDS.disponibilidad.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Detecta si es una pregunta sobre entrega
 */
export function isDeliveryQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return KEYWORDS.entrega.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Detecta si es una pregunta sobre métodos de pago
 */
export function isPaymentQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return KEYWORDS.pago.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Detecta si es una pregunta sobre horarios
 */
export function isScheduleQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return KEYWORDS.horarios.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Detecta si es una pregunta sobre contacto
 */
export function isContactQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return KEYWORDS.contacto.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Detecta si es una pregunta sobre ubicación
 */
export function isLocationQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return KEYWORDS.ubicacion.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Genera una respuesta basada en el mensaje del usuario
 */
export function getFallbackResponse(message: string): string {
  // Primero verificar si es una pregunta sobre horarios, contacto o ubicación
  if (isScheduleQuestion(message)) {
    return RESPUESTAS_GENERALES.horarios;
  }

  if (isContactQuestion(message)) {
    return RESPUESTAS_GENERALES.contacto;
  }

  if (isLocationQuestion(message)) {
    return RESPUESTAS_GENERALES.ubicacion;
  }

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
