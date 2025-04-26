import { defineConfig } from "drizzle-kit";

// Configuración para desarrollo, no se usa en producción
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://fake:fake@localhost:5432/fake",
  },
});
