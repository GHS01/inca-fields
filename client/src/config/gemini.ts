/**
 * Configuración para la API de Gemini
 */

// Claves API de Gemini (normalmente deberían estar en variables de entorno)
export const GEMINI_API_KEYS = [
  'AIzaSyCFR2kApUeCGSWOf_tkcLe1XH4qgKjDVJ0', // Clave principal
  'AIzaSyBEDtNY0MAWLsHcSn4rObEM_Cp7VdKwDjU'  // Clave secundaria
];

// URL de la API de Gemini (versión v1beta)
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Configuración para la generación de texto
export const GEMINI_GENERATION_CONFIG = {
  temperature: 0.7,
  maxOutputTokens: 250,
  topP: 0.9,
  topK: 20
};

// Timeout para las solicitudes a la API (en milisegundos)
export const GEMINI_API_TIMEOUT = 15000; // 15 segundos

// Límite de solicitudes por minuto por clave API
export const GEMINI_REQUESTS_PER_MINUTE = 60;

// Prompt del sistema para la API de Gemini
export const GEMINI_SYSTEM_PROMPT = 'Eres un asistente virtual de Inca Fields. Responde de manera concisa sobre aguacates. Usa la información de la base de conocimientos para responder preguntas sobre horarios, precios, disponibilidad y otros detalles.';
