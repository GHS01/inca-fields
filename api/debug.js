// Función para depurar problemas en producción
export default function handler(req) {
  // Obtener información del entorno
  const environment = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_REGION: process.env.VERCEL_REGION,
    VERCEL_URL: process.env.VERCEL_URL,
    GEMINI_API_KEY_DEFINED: !!process.env.GEMINI_API_KEY,
    GEMINI_API_KEY_2_DEFINED: !!process.env.GEMINI_API_KEY_2
  };

  // Obtener información de la solicitud
  const requestInfo = {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  };

  // Devolver toda la información
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Información de diagnóstico",
      environment,
      request: requestInfo,
      timestamp: new Date().toISOString()
    }, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}
