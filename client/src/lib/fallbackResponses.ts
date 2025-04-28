/**
 * Respuestas predefinidas para cuando la API no está disponible
 */

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
  horarios: 'Nuestros horarios de atención son de Lunes a Viernes de 9:00 AM a 6:00 PM y Sábados de 9:00 AM a 1:00 PM. Estamos cerrados los domingos y feriados.',
  contacto: 'Puedes contactarnos a través de nuestro WhatsApp: +51 987 654 321, por correo electrónico a info@incafields.com o mediante el formulario de contacto en nuestra página web.',
  ubicacion: 'Nuestra sede principal se encuentra en Av. La Molina 1234, La Molina, Lima. También contamos con puntos de venta en Miraflores y San Isidro.'
};

/**
 * Detecta el tipo de consulta basado en palabras clave
 */
export function detectQueryType(message: string): 'mayoreo' | 'menudeo' | 'unknown' {
  const lowerMessage = message.toLowerCase();
  
  // Palabras clave para mayoreo
  const mayoreoKeywords = [
    'mayor', 'mayoreo', 'tonelada', 'toneladas', 'ton', 'grandes cantidades', 
    'grandes pedidos', 'grandes volúmenes', 'compra grande', 'cantidad grande',
    'grandes lotes', 'distribuidor', 'distribuidores', 'revender', 'reventa',
    'exportar', 'exportación', 'negocio', 'comercial', 'empresa', 'empresarial',
    'restaurante', 'hotel', 'supermercado', 'mayorista', 'mayoristas', '500 kg',
    '1000 kg', '10000', 'diez mil', '5000'
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

/**
 * Detecta si es una pregunta sobre precios
 */
export function isPriceQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const priceKeywords = [
    'precio', 'precios', 'costo', 'costos', 'valor', 'cuánto', 'cuanto', 
    'cuestan', 'cuesta', 'tarifa', 'tarifas', 'pagar', 'cobran', 'cobra',
    'vale', 'valen', 'oferta', 'ofertas', 'descuento', 'descuentos',
    'económico', 'barato', 'costoso', 'promoción', 'promociones', 's/'
  ];
  
  return priceKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Detecta si es una pregunta sobre disponibilidad
 */
export function isAvailabilityQuestion(message: string): boolean {
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

/**
 * Detecta si es una pregunta sobre entrega
 */
export function isDeliveryQuestion(message: string): boolean {
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

/**
 * Detecta si es una pregunta sobre métodos de pago
 */
export function isPaymentQuestion(message: string): boolean {
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

/**
 * Genera una respuesta basada en el mensaje del usuario
 */
export function getFallbackResponse(message: string): string {
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
