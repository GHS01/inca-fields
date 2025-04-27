import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware para gestionar errores de parsing JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ 
      error: 'JSON inválido', 
      response: "Lo siento, hubo un problema con tu solicitud. Por favor, intenta de nuevo." 
    });
  }
  next();
});

// Logger mejorado
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        // Limitar lo que mostramos en el log para evitar información sensible o logs demasiado largos
        const safeResponse = { ...capturedJsonResponse };
        if (safeResponse.response && typeof safeResponse.response === 'string' && safeResponse.response.length > 50) {
          safeResponse.response = safeResponse.response.substring(0, 50) + '...';
        }
        
        logLine += ` :: ${JSON.stringify(safeResponse)}`;
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Middleware para manejar errores (debe estar después de las rutas)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error en el servidor:', err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Siempre devolvemos JSON para las rutas API
    if (_req.path.startsWith('/api')) {
      return res.status(status).json({ 
        error: message,
        response: "Lo siento, hubo un problema técnico. Por favor, intenta de nuevo más tarde."
      });
    }
    
    res.status(status).json({ message });
  });

  // Middleware para manejar rutas no encontradas para API
  app.use('/api/*', (req, res) => {
    res.status(404).json({ 
      error: 'Ruta no encontrada',
      response: "Lo siento, esta funcionalidad no está disponible."
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use the PORT environment variable provided by Vercel or default to 5000
  const port = process.env.PORT || 5000;
  server.listen({
    port: Number(port),
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Servidor funcionando en el puerto ${port}`);
  });
})();
