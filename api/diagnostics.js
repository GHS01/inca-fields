// Función para diagnosticar problemas con el chatbot en producción
export default async function handler(req) {
  // Configurar CORS para Edge Functions
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Manejar solicitudes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  // Solo permitir solicitudes GET
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({
        error: 'Solo se aceptan solicitudes GET'
      }),
      {
        status: 405,
        headers
      }
    );
  }

  try {
    // Recopilar información de diagnóstico
    const diagnosticInfo = {
      // Información del entorno
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'no definido',
        VERCEL_ENV: process.env.VERCEL_ENV || 'no definido',
        VERCEL_REGION: process.env.VERCEL_REGION || 'no definido',
        VERCEL_URL: process.env.VERCEL_URL || 'no definido'
      },
      
      // Información de las claves API
      apiKeys: {
        GEMINI_API_KEY_DEFINED: !!process.env.GEMINI_API_KEY,
        GEMINI_API_KEY_2_DEFINED: !!process.env.GEMINI_API_KEY_2
      },
      
      // Información de la solicitud
      request: {
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers.entries())
      },
      
      // Información del runtime
      runtime: {
        type: 'edge',
        timestamp: new Date().toISOString()
      },
      
      // Prueba de conectividad
      connectivity: {
        status: 'ok'
      }
    };

    // Realizar una prueba de conectividad a la API de Gemini
    try {
      // Crear un controlador de aborto para implementar timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Intentar hacer una solicitud simple a la API de Gemini
      const testUrl = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + 
                      (process.env.GEMINI_API_KEY || 'INVALID_KEY');
      
      const response = await fetch(testUrl, {
        method: 'GET',
        signal: controller.signal
      });

      // Limpiar el timeout
      clearTimeout(timeoutId);

      // Actualizar el estado de conectividad
      diagnosticInfo.connectivity = {
        status: response.ok ? 'ok' : 'error',
        statusCode: response.status,
        statusText: response.statusText
      };

      if (response.ok) {
        const data = await response.json();
        diagnosticInfo.connectivity.apiResponse = {
          modelCount: data.models?.length || 0
        };
      }
    } catch (error) {
      // Si hay un error en la prueba de conectividad, registrarlo
      diagnosticInfo.connectivity = {
        status: 'error',
        error: error.name,
        message: error.message
      };
    }

    // Devolver la información de diagnóstico
    return new Response(
      JSON.stringify(diagnosticInfo, null, 2),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    // Capturar cualquier error y devolver una respuesta de error
    return new Response(
      JSON.stringify({
        error: 'Error al generar información de diagnóstico',
        message: error.message
      }),
      {
        status: 500,
        headers
      }
    );
  }
}
