/**
 * Servicio para cargar y gestionar la base de conocimientos
 */

// Contenido de la base de conocimientos directamente en el código
// Esto evita problemas de carga de archivos
const KNOWLEDGE_BASE_CONTENT = `# Base de Conocimientos: Venta de Aguacates - Inca Fields

## Propósito
Proveer información breve y precisa sobre la venta de aguacates de Inca Fields, tanto al por mayor como al por menor, incluyendo precios, periodos de venta, horarios y disponibilidad.

## Información Clave
**Producto**: Aguacates (variedad Hass).
**Tipos de venta**:
  **Al por mayor**: Por toneladas.
  **Al por menor**: Por kilogramos.
**Precios**:
  **Al por mayor**:
  - Precio por unidad: S/ 2.50 (dos soles con cincuenta céntimos).
  - Peso promedio por aguacate: 0.25 kg (250 gramos).
  - Cálculo por tonelada:
    - 1 tonelada = 1000 kg.
    - Aguacates por tonelada: 1000 kg ÷ 0.25 kg = 4000 aguacates.
    - Precio por tonelada: 4000 aguacates × S/ 2.50 = **S/ 10,000**.
  **Al por menor**:
  - Precio por kilogramo: S/ 6.50 (basado en mercado minorista promedio en Perú).
**Periodos de venta al por mayor**:
- Enero, Marzo, Mayo.
**Periodos de venta al por menor**:
- Todo el año, sujeto a disponibilidad de cosecha.
**Disponibilidad**: Producción anual en Perú supera las 511,000 toneladas, con alta disponibilidad en La Libertad, Lambayeque y Lima.
**Horarios de atención**:
- Lunes a viernes: 9:00 AM - 6:00 PM.
- Sábado: 10:00 AM - 3:00 PM.
- Domingo: 12:00 PM - 3:00 PM.

## Preguntas Frecuentes (FAQ)
**¿Cuál es el precio de los aguacates?**
- Al por mayor: S/ 10,000 por tonelada. Al por menor: S/ 6.50 por kg.
**¿Cuándo están disponibles los aguacates al por mayor?**
- En enero, marzo y mayo.
**¿Venden aguacates al por menor?**
- Sí, vendemos aguacates todo el año, según disponibilidad.
**¿Cómo se realiza la entrega?**
- Al por mayor: Por camionadas, en 3-7 días hábiles. Al por menor: Entrega a domicilio o recogida en puntos de venta en 1-3 días.
**¿Qué formas de pago aceptan?**
- Transferencia bancaria, efectivo o pagos digitales (Yape, Plin) para ambos tipos de venta.
**¿El precio es negociable?**
- Sí, para compras al por mayor superiores a 5 toneladas. Para compras al por menor, los precios son fijos.
**¿Ofrecen descuentos por volumen?**
- Sí, 5% de descuento para compras mayores a 10 toneladas y 10% para compras mayores a 20 toneladas.
**¿Cuál es la calidad de sus aguacates?**
- Ofrecemos aguacates Hass de primera calidad, cultivados bajo estándares internacionales.`;

// Variable para almacenar en caché la base de conocimientos
let knowledgeBaseCache: string | null = null;

/**
 * Carga la base de conocimientos
 */
export async function loadKnowledgeBase(): Promise<string> {
  // Si ya tenemos la base de conocimientos en caché, devolverla
  if (knowledgeBaseCache) {
    return knowledgeBaseCache;
  }

  try {
    // Usar el contenido definido directamente en el código
    const knowledgeBase = KNOWLEDGE_BASE_CONTENT;

    // Guardar en caché
    knowledgeBaseCache = knowledgeBase;

    console.log('Base de conocimientos cargada correctamente');
    console.log('Contenido de la base de conocimientos (primeros 200 caracteres):', knowledgeBase.substring(0, 200));
    return knowledgeBase;
  } catch (error) {
    console.error('Error al cargar la base de conocimientos:', error);
    // Devolver un mensaje de error como base de conocimientos
    return 'Error al cargar la base de conocimientos. Por favor, contacta con un especialista.';
  }
}

/**
 * Obtiene la base de conocimientos (cargándola si es necesario)
 */
export async function getKnowledgeBase(): Promise<string> {
  return knowledgeBaseCache || await loadKnowledgeBase();
}
