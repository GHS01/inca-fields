/**
 * Respuestas predefinidas para cuando la API no está disponible
 */

import { KEYWORDS } from '@/config/fallback';

// Respuestas para preguntas de mayoreo
export const RESPUESTAS_MAYOREO = {
  precio: 'Para compras al por mayor, el precio es de S/ 10,000 por tonelada (equivalente a 1000 kg o aproximadamente 4000 aguacates). Este precio es negociable para pedidos de 5+ toneladas, con descuentos disponibles para pedidos de 20+ toneladas sujeto a evaluación.',
  disponibilidad: 'Los aguacates al por mayor están disponibles en los meses de Enero, Marzo y Mayo, que son nuestras temporadas principales de cosecha. Para otras fechas, por favor contacte directamente con nuestro equipo de ventas.',
  entrega: 'Para pedidos al por mayor, ofrecemos entrega en todo el Perú. El tiempo de entrega varía según la ubicación, generalmente entre 3-7 días hábiles. Los costos de envío se calculan según el volumen y distancia.',
  pago: 'Aceptamos transferencias bancarias, depósitos y pagos contra entrega para pedidos al por mayor. Para pedidos grandes, ofrecemos opciones de pago en cuotas previa evaluación.',
  calidad: 'Nuestros aguacates al por mayor son de la misma calidad premium que vendemos al por menor. Garantizamos un producto fresco, con el punto óptimo de maduración para que llegue en perfectas condiciones.',
  default: 'Para compras al por mayor, trabajamos con un mínimo de 1 tonelada. Ofrecemos precios competitivos, garantía de calidad y soporte logístico completo. ¿Te gustaría conocer más detalles sobre precios, disponibilidad o proceso de compra?'
};

// Respuestas para preguntas de menudeo
export const RESPUESTAS_MENUDEO = {
  precio: 'El precio de nuestros aguacates premium al por menor es de S/ 6.50 por kilogramo (aproximadamente 4 aguacates). También ofrecemos packs especiales: Pack Familiar (3kg) por S/ 18.50 y Pack Gourmet (selección especial de 8 aguacates) por S/ 24.99.',
  disponibilidad: 'Nuestros aguacates al por menor están disponibles durante todo el año en nuestra tienda online y puntos de venta seleccionados. Realizamos envíos de Lunes a Sábado.',
  entrega: 'Para compras al por menor, realizamos entregas en Lima Metropolitana en 24-48 horas. El costo de envío es de S/ 5.00 para pedidos menores a S/ 50.00, y gratis para compras mayores.',
  pago: 'Para compras al por menor aceptamos todas las tarjetas de crédito y débito, transferencias bancarias, Yape, Plin y pago contra entrega en efectivo.',
  conservacion: 'Para conservar tus aguacates, mantén los que están duros a temperatura ambiente hasta que maduren. Una vez maduros, puedes refrigerarlos para extender su vida útil por 2-3 días adicionales.',
  default: 'Nuestros aguacates premium al por menor tienen un precio de S/ 6.50 por kilogramo. Realizamos entregas en Lima Metropolitana en 24-48 horas. ¿Te gustaría conocer más sobre nuestros productos, precios especiales o métodos de conservación?'
};

// Respuestas generales
export const RESPUESTAS_GENERALES = {
  default: 'Actualmente no manejo esa información, te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.',
  horarios: 'Nuestros horarios de atención son de Lunes a Viernes de 9:00 AM a 6:00 PM, Sábados de 10:00 AM a 3:00 PM y Domingos de 12:00 PM a 3:00 PM.',
  contacto: 'Puedes contactarnos a través de nuestro WhatsApp: +51 987 654 321, por correo electrónico a info@incafields.com o mediante el formulario de contacto en nuestra página web.',
  ubicacion: 'Nuestra sede principal se encuentra en Av. La Molina 1234, La Molina, Lima. También contamos con puntos de venta en Miraflores y San Isidro.'
};

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
