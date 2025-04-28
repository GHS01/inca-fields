# Configuración de Variables de Entorno en Vercel

Este documento explica cómo configurar las variables de entorno necesarias para el sistema de rotación de claves API de Gemini en Vercel.

## Variables de Entorno Requeridas

Para que el sistema de rotación de claves API funcione correctamente, debes configurar las siguientes variables de entorno en tu proyecto de Vercel:

1. `GEMINI_API_KEY` - Tu clave API principal de Gemini
2. `GEMINI_API_KEY_2` - Tu clave API secundaria de Gemini

## Pasos para Configurar Variables de Entorno en Vercel

1. Inicia sesión en tu cuenta de [Vercel](https://vercel.com)
2. Selecciona tu proyecto "inca-fields"
3. Ve a la pestaña "Settings" (Configuración)
4. En el menú lateral, selecciona "Environment Variables" (Variables de Entorno)
5. Añade las siguientes variables:

   | Nombre | Valor |
   |--------|-------|
   | `GEMINI_API_KEY` | `AIzaSyCFR2kApUeCGSWOf_tkcLe1XH4qgKjDVJ0` |
   | `GEMINI_API_KEY_2` | `AIzaSyBEDtNY0MAWLsHcSn4rObEM_Cp7VdKwDjU` |

6. Asegúrate de que las variables estén configuradas para todos los entornos (Production, Preview, Development)
7. Haz clic en "Save" (Guardar)

## Verificación

Después de configurar las variables de entorno y desplegar tu aplicación, puedes verificar que el sistema de rotación de claves API está funcionando correctamente revisando los logs de la aplicación. Deberías ver mensajes como:

```
Sistema de rotación de claves API inicializado con 2 claves
Usando clave API #1 (0/2 solicitudes)
Solicitud registrada para clave API. Total: 1/2
```

## Solución de Problemas

Si encuentras problemas con el sistema de rotación de claves API:

1. Verifica que ambas claves API estén correctamente configuradas en las variables de entorno de Vercel
2. Asegúrate de que las claves API sean válidas y estén activas
3. Revisa los logs de la aplicación para identificar posibles errores
4. Si una clave API deja de funcionar, puedes actualizarla en las variables de entorno sin necesidad de modificar el código

## Añadir Más Claves API

Si deseas añadir más claves API en el futuro:

1. Obtén nuevas claves API de Google Gemini
2. Añade nuevas variables de entorno en Vercel con nombres como `GEMINI_API_KEY_3`, `GEMINI_API_KEY_4`, etc.
3. Actualiza el código en `server/chatbot.ts` para incluir las nuevas claves:

```typescript
// Añadir la tercera clave si está disponible
if (process.env.GEMINI_API_KEY_3) {
  apiKeys.push(process.env.GEMINI_API_KEY_3);
  console.log('Clave API terciaria de Gemini añadida');
}
```

El sistema de rotación de claves API detectará automáticamente las nuevas claves y las utilizará en la rotación.
