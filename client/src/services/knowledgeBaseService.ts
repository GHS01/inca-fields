/**
 * Servicio para cargar y gestionar la base de conocimientos
 *
 * Este servicio utiliza el archivo generado automáticamente durante el proceso de construcción
 * que contiene la base de conocimientos extraída del archivo markdown.
 */

// Importar el contenido generado durante el build
// En desarrollo, si el archivo no existe, se utilizará un contenido de fallback
let KNOWLEDGE_BASE_CONTENT = '';

try {
  // Intentar importar el archivo generado
  // Nota: Esta importación dinámica es necesaria porque el archivo puede no existir en desarrollo
  const generatedModule = require('@/generated/knowledge-base');
  KNOWLEDGE_BASE_CONTENT = generatedModule.KNOWLEDGE_BASE_CONTENT;
  console.debug('Base de conocimientos cargada desde el archivo generado');
} catch (error) {
  console.warn('No se pudo cargar el archivo generado de la base de conocimientos. Usando contenido de fallback.');
  console.warn('Este mensaje es normal durante el desarrollo. En producción, el archivo debería existir.');
  console.warn('Error:', error);

  // Contenido de fallback para desarrollo (se usará solo si el archivo generado no existe)
  // Este contenido será reemplazado por el archivo generado durante el build
  KNOWLEDGE_BASE_CONTENT = `# Base de Conocimientos: Venta de Aguacates - Inca Fields (FALLBACK)

## Propósito
Este es un contenido de fallback que se usa solo durante el desarrollo cuando el archivo generado no existe.
En producción, este contenido será reemplazado por el contenido del archivo markdown.

## Nota Importante
Si ves este mensaje en producción, significa que el script de build no se ejecutó correctamente.
Por favor, verifica que el script scripts/build-knowledge-base.js se esté ejecutando durante el build.`;
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
