// Biblioteca de respuestas estáticas para el chatbot
// Esta implementación elimina la necesidad de llamadas al servidor

// Respuestas predefinidas para diferentes temas
export const predefinedResponses: { [key: string]: string } = {
  "default": "¡Hola! 👋 Soy el asistente virtual de Inca Fields. ¿Estás interesado en comprar nuestros aguacates al por mayor o menor? Estoy aquí para ayudarte con toda la información que necesites. 🥑",
  "precio": "El precio por tonelada de aguacates es S/ 10,000. También vendemos por unidad a S/ 2.50 cada aguacate. ¿Qué cantidad te gustaría adquirir?",
  "venta": "¡Genial! Realizamos ventas al por mayor en los meses de enero, marzo y mayo. Para compras menores, estamos disponibles todo el año. ¿Qué te interesa específicamente?",
  "mayorista": "Para compras al por mayor, ofrecemos precios especiales a partir de 500 kg. El precio es de S/ 8,500 por tonelada para mayoristas. También ofrecemos servicio de entrega a domicilio para pedidos grandes.",
  "minorista": "Para compras minoristas, puedes adquirir nuestros aguacates en nuestra tienda online o en los puntos de venta autorizados. El precio es de S/ 2.50 por unidad o S/ 25 por kilogramo.",
  "calidad": "Nuestros aguacates son cultivados con los más altos estándares de calidad. Utilizamos técnicas de agricultura sostenible y no usamos pesticidas dañinos. Cada aguacate pasa por un riguroso control de calidad antes de ser empacado.",
  "envio": "Realizamos envíos a todo el Perú. Para Lima Metropolitana, la entrega es gratuita para pedidos mayores a S/ 100. Para provincias, el costo de envío depende de la ubicación y el peso del pedido.",
  "tiempo": "El tiempo de entrega para Lima Metropolitana es de 24-48 horas. Para provincias, el tiempo estimado es de 3-5 días hábiles, dependiendo de la ubicación.",
  "pago": "Aceptamos diferentes métodos de pago: transferencia bancaria, Yape, Plin, tarjetas de crédito/débito y pago contra entrega (solo en Lima Metropolitana).",
  "contacto": "Puedes contactarnos a través de nuestro WhatsApp: +51 987 654 321, por correo electrónico a info@incafields.com o mediante el formulario de contacto en nuestra página web.",
  "ubicacion": "Nuestra sede principal está ubicada en Miraflores, Lima. También tenemos campos de cultivo en Chanchamayo y Satipo, en la región Junín.",
  "variedades": "Ofrecemos principalmente la variedad Hass, conocida por su cremosidad y sabor. También tenemos disponibles las variedades Fuerte y Nabal en temporadas específicas.",
  "organico": "Sí, contamos con certificación orgánica para nuestros aguacates. Cultivamos siguiendo prácticas sostenibles y respetuosas con el medio ambiente.",
  "beneficios": "Los aguacates son ricos en grasas saludables, fibra, vitaminas (E, K, C, B5, B6) y potasio. Ayudan a reducir el colesterol, proteger la vista y mantener un corazón sano.",
  "recetas": "Los aguacates son muy versátiles en la cocina. Puedes usarlos en guacamole, ensaladas, sándwiches, smoothies, postres e incluso como sustituto de mantequilla en algunas recetas.",
  "conservacion": "Para conservar los aguacates, mantén los que están duros a temperatura ambiente hasta que maduren. Una vez maduros, guárdalos en el refrigerador para extender su vida útil por 2-3 días adicionales.",
  "temporada": "La temporada principal de aguacates en Perú es de marzo a septiembre, aunque gracias a nuestros diferentes campos de cultivo, podemos ofrecer aguacates de calidad durante todo el año.",
  "descuentos": "Ofrecemos descuentos por volumen para compras mayoristas. También tenemos promociones especiales en fechas específicas que anunciamos en nuestras redes sociales.",
  "especialista": "Si necesitas información más detallada o personalizada, te recomiendo hablar con uno de nuestros especialistas. Puedes contactarlos directamente haciendo clic en el botón 'Hablar con un especialista' que aparece abajo."
};

// Función para obtener una respuesta basada en el mensaje del usuario
export function getStaticResponse(message: string, messageCount: number): string {
  const lowerMessage = message.toLowerCase();
  
  // Si es el primer mensaje o hay una pregunta de saludo, dar respuesta de bienvenida
  if (messageCount <= 1 || lowerMessage.includes("hola") || lowerMessage.includes("buenos") || lowerMessage.includes("saludos")) {
    return predefinedResponses.default;
  }
  
  // Buscar palabras clave en el mensaje
  if (lowerMessage.includes("precio") || lowerMessage.includes("costo") || lowerMessage.includes("valor") || lowerMessage.includes("cuánto")) {
    return predefinedResponses.precio;
  }
  
  if (lowerMessage.includes("venta") || lowerMessage.includes("comprar") || lowerMessage.includes("adquirir")) {
    return predefinedResponses.venta;
  }
  
  if (lowerMessage.includes("mayor") || lowerMessage.includes("tonelada") || lowerMessage.includes("cantidad") || lowerMessage.includes("volumen")) {
    return predefinedResponses.mayorista;
  }
  
  if (lowerMessage.includes("menor") || lowerMessage.includes("unidad") || lowerMessage.includes("individual") || lowerMessage.includes("pocas")) {
    return predefinedResponses.minorista;
  }
  
  if (lowerMessage.includes("calidad") || lowerMessage.includes("bueno") || lowerMessage.includes("certificado")) {
    return predefinedResponses.calidad;
  }
  
  if (lowerMessage.includes("envío") || lowerMessage.includes("enviar") || lowerMessage.includes("despacho") || lowerMessage.includes("entrega")) {
    return predefinedResponses.envio;
  }
  
  if (lowerMessage.includes("tiempo") || lowerMessage.includes("cuándo") || lowerMessage.includes("demora") || lowerMessage.includes("días")) {
    return predefinedResponses.tiempo;
  }
  
  if (lowerMessage.includes("pago") || lowerMessage.includes("pagar") || lowerMessage.includes("tarjeta") || lowerMessage.includes("efectivo") || lowerMessage.includes("yape")) {
    return predefinedResponses.pago;
  }
  
  if (lowerMessage.includes("contacto") || lowerMessage.includes("teléfono") || lowerMessage.includes("correo") || lowerMessage.includes("email") || lowerMessage.includes("whatsapp")) {
    return predefinedResponses.contacto;
  }
  
  if (lowerMessage.includes("ubicación") || lowerMessage.includes("dirección") || lowerMessage.includes("dónde") || lowerMessage.includes("local")) {
    return predefinedResponses.ubicacion;
  }
  
  if (lowerMessage.includes("variedad") || lowerMessage.includes("tipo") || lowerMessage.includes("clase") || lowerMessage.includes("hass")) {
    return predefinedResponses.variedades;
  }
  
  if (lowerMessage.includes("orgánico") || lowerMessage.includes("ecológico") || lowerMessage.includes("natural") || lowerMessage.includes("sostenible")) {
    return predefinedResponses.organico;
  }
  
  if (lowerMessage.includes("beneficio") || lowerMessage.includes("salud") || lowerMessage.includes("nutriente") || lowerMessage.includes("propiedad")) {
    return predefinedResponses.beneficios;
  }
  
  if (lowerMessage.includes("receta") || lowerMessage.includes("cocinar") || lowerMessage.includes("preparar") || lowerMessage.includes("comida")) {
    return predefinedResponses.recetas;
  }
  
  if (lowerMessage.includes("conservar") || lowerMessage.includes("guardar") || lowerMessage.includes("almacenar") || lowerMessage.includes("refrigerar")) {
    return predefinedResponses.conservacion;
  }
  
  if (lowerMessage.includes("temporada") || lowerMessage.includes("época") || lowerMessage.includes("estación") || lowerMessage.includes("disponible")) {
    return predefinedResponses.temporada;
  }
  
  if (lowerMessage.includes("descuento") || lowerMessage.includes("oferta") || lowerMessage.includes("promoción") || lowerMessage.includes("rebaja")) {
    return predefinedResponses.descuentos;
  }
  
  if (lowerMessage.includes("especialista") || lowerMessage.includes("experto") || lowerMessage.includes("asesor") || lowerMessage.includes("persona") || lowerMessage.includes("humano")) {
    return predefinedResponses.especialista;
  }
  
  // Respuesta genérica que varía según el número de interacciones
  let respuestaGenerica = "Nuestros aguacates son cultivados con los más altos estándares de calidad. ¿Hay algo específico sobre nuestros productos que te gustaría conocer? 🥑";
  
  // Añadir sugerencia de especialista después de la 5ª pregunta
  if (messageCount >= 5) {
    respuestaGenerica += " Si deseas información más detallada, puedes conversar con un especialista usando el botón en la parte inferior del chat.";
  }
  
  return respuestaGenerica;
}
