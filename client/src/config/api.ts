/**
 * Configuración de las URLs de la API según el entorno
 */

// Determinar si estamos en producción
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';

// URL base de la API
export const API_BASE_URL = isProduction 
  ? '/api' // En producción, usar una ruta relativa
  : 'http://localhost:5000/api'; // En desarrollo, usar localhost

// URLs específicas
export const CHAT_API_URL = `${API_BASE_URL}/chat`;
