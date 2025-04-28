/**
 * Servicio para cargar y gestionar la base de conocimientos
 */

// Ruta al archivo de la base de conocimientos
const KNOWLEDGE_BASE_PATH = '/memory/conocimientos.markdown';

// Variable para almacenar en caché la base de conocimientos
let knowledgeBaseCache: string | null = null;

/**
 * Carga la base de conocimientos desde el archivo
 */
export async function loadKnowledgeBase(): Promise<string> {
  // Si ya tenemos la base de conocimientos en caché, devolverla
  if (knowledgeBaseCache) {
    return knowledgeBaseCache;
  }

  try {
    // Cargar el archivo de la base de conocimientos
    const response = await fetch(KNOWLEDGE_BASE_PATH);

    if (!response.ok) {
      throw new Error(`Error al cargar la base de conocimientos: ${response.status}`);
    }

    // Leer el contenido del archivo
    const knowledgeBase = await response.text();

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
