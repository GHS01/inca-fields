/**
 * Configuración para el sistema de fallback
 */

// Mensaje de error genérico cuando no se puede manejar una consulta
export const DEFAULT_ERROR_MESSAGE = 'Actualmente no manejo esa información, te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.';

// Número máximo de intentos para llamar a la API antes de usar el fallback
export const MAX_API_RETRIES = 2;

// Tiempo de espera entre reintentos (en milisegundos)
export const RETRY_DELAY = 1000;

// Palabras clave para detectar tipos de consultas
export const KEYWORDS = {
  // Palabras clave para mayoreo
  mayoreo: [
    'mayor', 'mayoreo', 'tonelada', 'toneladas', 'ton', 'grandes cantidades',
    'grandes pedidos', 'grandes volúmenes', 'compra grande', 'cantidad grande',
    'grandes lotes', 'distribuidor', 'distribuidores', 'revender', 'reventa',
    'exportar', 'exportación', 'negocio', 'comercial', 'empresa', 'empresarial',
    'restaurante', 'hotel', 'supermercado', 'mayorista', 'mayoristas', '500 kg',
    '1000 kg'
  ],

  // Palabras clave para menudeo
  menudeo: [
    'menor', 'menudeo', 'kilo', 'kilos', 'kg', 'pequeñas cantidades',
    'pequeños pedidos', 'pequeños volúmenes', 'compra pequeña', 'cantidad pequeña',
    'unidad', 'unidades', 'personal', 'casa', 'hogar', 'familiar', 'consumo propio',
    'particular', 'individual', '6.50', 'seis', 'minorista'
  ],

  // Palabras clave para precios
  precio: [
    'precio', 'precios', 'costo', 'costos', 'valor', 'cuánto', 'cuanto',
    'cuestan', 'cuesta', 'tarifa', 'tarifas', 'pagar', 'cobran', 'cobra',
    'vale', 'valen', 'oferta', 'ofertas', 'descuento', 'descuentos',
    'económico', 'barato', 'costoso', 'promoción', 'promociones', 's/'
  ],

  // Palabras clave para disponibilidad
  disponibilidad: [
    'disponible', 'disponibilidad', 'cuando', 'cuándo', 'temporada',
    'época', 'fecha', 'mes', 'tiempo', 'hay', 'tienen', 'stock'
  ],

  // Palabras clave para entrega
  entrega: [
    'entrega', 'envío', 'envio', 'despacho', 'recibir', 'recibo',
    'llega', 'llegada', 'domicilio', 'casa', 'dirección', 'direccion',
    'transporte', 'transportar', 'enviar', 'mandar', 'llevar'
  ],

  // Palabras clave para pago
  pago: [
    'pago', 'pagar', 'tarjeta', 'efectivo', 'transferencia', 'yape',
    'plin', 'depósito', 'deposito', 'contra entrega', 'crédito',
    'credito', 'débito', 'debito', 'factura', 'boleta', 'comprobante'
  ],

  // Palabras clave para horarios
  horarios: [
    'horario', 'hora', 'abierto', 'cerrado', 'atienden', 'atención',
    'atencion', 'cuando abren', 'cuando cierran', 'días', 'dias',
    'lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes',
    'sábado', 'sabado', 'domingo'
  ],

  // Palabras clave para contacto
  contacto: [
    'contacto', 'contactar', 'teléfono', 'telefono', 'llamar', 'email',
    'correo', 'whatsapp', 'comunicar', 'comunicarme', 'mensaje', 'chat'
  ],

  // Palabras clave para ubicación
  ubicacion: [
    'ubicación', 'ubicacion', 'dirección', 'direccion', 'donde', 'dónde',
    'lugar', 'encuentran', 'localización', 'localizacion', 'tienda',
    'local', 'oficina', 'sede', 'sucursal', 'punto de venta'
  ]
};
