/**
 * Servicio para cargar y gestionar la base de conocimientos
 *
 * Este servicio utiliza el archivo generado automáticamente durante el proceso de construcción
 * que contiene la base de conocimientos extraída del archivo markdown.
 */

// Importar el contenido generado durante el build
// En desarrollo, si el archivo no existe, se utilizará un contenido de fallback
let KNOWLEDGE_BASE_CONTENT = '';

// En producción, intentamos cargar el contenido desde un archivo estático
// Esto evita el uso de require() que no está disponible en el navegador
const FALLBACK_CONTENT = `# Base de Conocimientos: Venta de Aguacates - Inca Fields (FALLBACK)

## Propósito
Este es un contenido de fallback que se usa cuando no se puede cargar la base de conocimientos.

## Información General
- Somos Inca Fields, productores y distribuidores de aguacates de alta calidad.
- Ofrecemos aguacates tanto al por mayor como al por menor.
- Para más información específica, contacta con nuestros especialistas.

## Contacto
Puedes contactarnos usando el botón que aparece abajo para hablar con un especialista.

## Horarios
Lunes a viernes de 9:00 AM a 6:00 PM. Sábados de 10:00 AM a 2:00 PM. Domingos cerrado.`;

// Inicializamos con el contenido de fallback
KNOWLEDGE_BASE_CONTENT = FALLBACK_CONTENT;

// Intentamos cargar el contenido generado usando importación dinámica
// Esta es compatible con navegadores modernos y entornos de producción
try {
  // Usamos una función autoejecutable asíncrona para poder usar await
  (async () => {
    try {
      // Intentar importar el archivo generado usando import() dinámico
      const generatedModule = await import('@/generated/knowledge-base');
      if (generatedModule && generatedModule.KNOWLEDGE_BASE_CONTENT) {
        KNOWLEDGE_BASE_CONTENT = generatedModule.KNOWLEDGE_BASE_CONTENT;
        console.debug('Base de conocimientos cargada desde el archivo generado');
        // Actualizar la caché
        knowledgeBaseCache = KNOWLEDGE_BASE_CONTENT;
      }
    } catch (importError) {
      console.warn('No se pudo cargar el archivo generado de la base de conocimientos. Usando contenido de fallback.');
      console.warn('Este mensaje es normal durante el desarrollo. En producción, el archivo debería existir.');
      console.warn('Error:', importError);
      // Ya tenemos el contenido de fallback inicializado
    }
  })();
} catch (error) {
  console.warn('Error al intentar cargar la base de conocimientos:', error);
  // Ya tenemos el contenido de fallback inicializado
}

// Variable para almacenar en caché la base de conocimientos
// Forzamos a null para asegurar que se recargue la base de conocimientos
let knowledgeBaseCache: string | null = null;

/**
 * Carga la base de conocimientos
 */
export async function loadKnowledgeBase(): Promise<string> {
  // Si ya tenemos la base de conocimientos en caché, devolverla
  if (knowledgeBaseCache) {
    console.debug('Usando base de conocimientos en caché');
    return knowledgeBaseCache;
  }

  try {
    // Usar el contenido importado
    const knowledgeBase = KNOWLEDGE_BASE_CONTENT;

    // Verificar si la base de conocimientos contiene información sobre precios al por mayor
    const containsMayoreoPrice = knowledgeBase.includes('10,000') ||
                                knowledgeBase.includes('10000') ||
                                knowledgeBase.includes('diez mil');

    if (containsMayoreoPrice) {
      console.warn('⚠️ ADVERTENCIA: La base de conocimientos contiene información sobre precios al por mayor');
      console.warn('Esto puede causar que el asistente responda con precios específicos');
      console.warn('Verifica que el archivo memory/conocimientos.markdown no contenga precios específicos');
    }

    // Guardar en caché
    knowledgeBaseCache = knowledgeBase;

    console.debug('Base de conocimientos cargada correctamente');
    console.debug('Contenido de la base de conocimientos (primeros 300 caracteres):', knowledgeBase.substring(0, 300));
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
