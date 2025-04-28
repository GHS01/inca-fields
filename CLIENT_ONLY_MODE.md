# Modo Cliente-Solamente para el Chatbot de Inca Fields

## Descripción

Este documento explica la implementación del "Modo Cliente-Solamente" para el chatbot de Inca Fields, una solución implementada para resolver problemas persistentes de timeout con las funciones Edge de Vercel.

## ¿Por qué se implementó esta solución?

El chatbot estaba experimentando problemas persistentes de timeout (error 504) al intentar comunicarse con la API de Gemini a través de las funciones Edge de Vercel. Después de múltiples intentos de solución, se decidió implementar una solución radical que elimina la dependencia del servidor para las respuestas del chatbot.

## Cómo funciona

En esta implementación:

1. **Llamadas directas a la API de Gemini**: El cliente (navegador) llama directamente a la API de Gemini sin pasar por el servidor de Vercel.
2. **Claves API hardcodeadas**: Las claves API de Gemini están hardcodeadas en el cliente para simplificar la implementación.
3. **Sistema de rotación de claves**: Se mantiene el sistema de rotación de claves API para evitar alcanzar los límites de cuota.
4. **Sistema de fallback**: Se mantiene el sistema de respuestas predefinidas como fallback cuando la API de Gemini no responde.

## Ventajas y desventajas

### Ventajas
- Elimina los problemas de timeout con las funciones Edge de Vercel
- Reduce la latencia al eliminar un salto en la comunicación
- Simplifica la arquitectura del sistema

### Desventajas
- Las claves API están expuestas en el cliente (riesgo de seguridad)
- No hay forma de ocultar las claves API en variables de entorno del cliente
- Posible abuso de las claves API por parte de usuarios malintencionados

## Recomendaciones para producción

Para un entorno de producción más seguro, se recomienda:

1. **Rotar las claves API regularmente**: Cambiar las claves API periódicamente para minimizar el impacto de posibles abusos.
2. **Implementar restricciones de dominio**: Configurar las claves API de Gemini para que solo funcionen desde dominios específicos.
3. **Monitorear el uso**: Vigilar el uso de las claves API para detectar patrones de abuso.
4. **Considerar una solución proxy**: A largo plazo, considerar implementar un proxy seguro que oculte las claves API pero que no sufra de los problemas de timeout.

## Archivos modificados

- `client/src/services/geminiService.ts` (nuevo): Servicio para llamar directamente a la API de Gemini desde el cliente
- `client/src/components/StaticChatBubble.tsx`: Modificado para usar el nuevo servicio en lugar de llamar al servidor

## Cómo volver al modo anterior

Si en el futuro se resuelven los problemas con las funciones Edge de Vercel, se puede volver al modo anterior:

1. Eliminar el archivo `client/src/services/geminiService.ts`
2. Restaurar las importaciones originales en `client/src/components/StaticChatBubble.tsx`
3. Restaurar la función `handleSendMessage` original que llama al servidor

## Notas adicionales

Esta solución se implementó como último recurso después de agotar otras opciones. Aunque no es ideal desde el punto de vista de la seguridad, proporciona una experiencia de usuario funcional y confiable.
