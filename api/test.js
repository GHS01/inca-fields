// Función simple para probar que el runtime Edge funciona correctamente
export default function handler(req) {
  return new Response(
    JSON.stringify({ 
      status: "ok", 
      message: "La función Edge está funcionando correctamente",
      method: req.method,
      url: req.url
    }),
    { 
      status: 200, 
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      } 
    }
  );
}
