# Inca Fields Premium

Sitio web para Inca Fields Premium, una empresa dedicada a la producción y comercialización de aguacates de alta calidad.

## Tecnologías utilizadas

- **Frontend**: React, TailwindCSS, Framer Motion, React Query
- **Backend**: Express.js, Node.js
- **Almacenamiento**: Memoria (implementación en memoria para formularios y suscripciones)
- **Bundler**: Vite

## Estructura del proyecto

- `client/`: Código del frontend
- `server/`: Código del backend
- `shared/`: Código compartido entre frontend y backend
- `dist/`: Archivos compilados (generados al construir)

## Requisitos previos

- Node.js 18 o superior
- npm 8 o superior

## Configuración para desarrollo

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`

## Construcción para producción

```bash
npm run build
```

## Despliegue en Vercel

Este proyecto está configurado para ser desplegado en Vercel. Sigue estos pasos:

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una
2. Conecta tu repositorio de GitHub a Vercel
3. Configura las siguientes variables de entorno en Vercel:
   - `NODE_ENV`: Establece como "production"
4. Despliega el proyecto

### Notas importantes para el despliegue

- El archivo `vercel.json` ya está configurado para manejar correctamente las rutas de la API y los archivos estáticos
- La aplicación utiliza almacenamiento en memoria, por lo que los datos (contactos y suscripciones) se perderán al reiniciar el servidor

## Licencia

MIT
