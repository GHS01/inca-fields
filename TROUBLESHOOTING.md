# Solución de problemas del chatbot

Este documento proporciona instrucciones para solucionar problemas comunes con el chatbot en producción.

## Problemas comunes y soluciones

### Error 405 (Method Not Allowed)

Si el chatbot muestra el mensaje de fallback y en la consola del navegador aparece un error 405:

1. Verifica que la función serverless esté configurada correctamente en Vercel
2. Asegúrate de que el archivo `api/chat.config.json` tenga la configuración correcta del runtime Edge
3. Comprueba que la función esté manejando correctamente las solicitudes POST

### Error 500 (Internal Server Error)

Si el chatbot muestra el mensaje de fallback y en la consola del navegador aparece un error 500:

1. Verifica las variables de entorno en Vercel (GEMINI_API_KEY y GEMINI_API_KEY_2)
2. Revisa los logs de la función en el panel de Vercel
3. Utiliza el endpoint de diagnóstico `/api/diagnostics` para obtener información sobre el entorno

### Errores de Timeout (AbortError)

Si el chatbot muestra errores de timeout en la consola del navegador:

1. Verifica la conectividad de red entre el cliente y el servidor
2. Comprueba si la función Edge está tardando demasiado en responder
3. Considera aumentar el valor de `API_TIMEOUT` en `client/src/config/api.ts` si los timeouts son frecuentes
4. Verifica que la API de Gemini esté respondiendo correctamente usando el endpoint `/api/diagnostics`
5. Revisa los logs de Vercel para ver si hay errores en la función Edge

### Problemas con la API de Gemini

Si el chatbot está usando respuestas predefinidas debido a problemas con la API de Gemini:

1. Verifica que las claves API de Gemini estén configuradas correctamente en Vercel
2. Comprueba que las claves API no hayan alcanzado su límite de cuota
3. Asegúrate de que el sistema de rotación de claves API esté funcionando correctamente
4. Utiliza el endpoint `/api/diagnostics` para verificar la conectividad con la API de Gemini

## Herramientas de diagnóstico

El proyecto incluye varias herramientas para ayudar a diagnosticar problemas:

- `/api/test`: Endpoint simple para verificar que las funciones Edge estén funcionando
- `/api/diagnostics`: Endpoint que proporciona información detallada sobre el entorno, variables de entorno y conectividad con la API de Gemini

## Logs y monitoreo

Para ver los logs de las funciones serverless:

1. Ve al panel de Vercel
2. Selecciona el proyecto
3. Haz clic en "Deployments" y selecciona el despliegue más reciente
4. Haz clic en "Functions" para ver los logs de las funciones

## Contacto para soporte

Si no puedes resolver el problema, contacta al equipo de desarrollo en [correo@ejemplo.com](mailto:correo@ejemplo.com).
