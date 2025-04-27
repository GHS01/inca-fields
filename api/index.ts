import express from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware para registrar solicitudes API
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Registrar el cuerpo de la solicitud para rutas API
  if (path.startsWith("/api")) {
    console.log(`Solicitud recibida: ${req.method} ${path}`);
    console.log(`Cuerpo de la solicitud:`, req.body);
  }

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
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`Respuesta enviada: ${logLine}`);
    }
  });

  next();
});

// Registrar rutas API
registerRoutes(app);

// Manejar errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
});

// Servir archivos estáticos
const distPath = path.join(process.cwd(), "dist/public");
app.use(express.static(distPath));

// Ruta catch-all para SPA
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Exportar la aplicación Express para Vercel
export default app;
