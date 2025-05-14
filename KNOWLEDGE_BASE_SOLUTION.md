# Solución para la Base de Conocimientos del Asistente IncaFields

## Problema Resuelto

Se ha implementado una solución para eliminar la información hardcodeada en el código del asistente IncaFields. Anteriormente, la base de conocimientos estaba hardcodeada directamente en el archivo `client/src/services/knowledgeBaseService.ts`, lo que dificultaba las actualizaciones y creaba inconsistencias cuando se modificaba el archivo `memory/conocimientos.markdown`.

## Solución Implementada

La solución implementada consiste en:

1. **Generación automática durante el build**: Un script que lee el archivo `memory/conocimientos.markdown` y genera archivos TypeScript con el contenido.
2. **Eliminación de información hardcodeada**: Se ha eliminado toda la información hardcodeada del código y se ha reemplazado por importaciones de los archivos generados.
3. **Compatibilidad con Vercel**: La solución es compatible con el despliegue en Vercel, ya que los archivos se generan durante el proceso de construcción.

## Archivos Modificados

- `client/src/services/knowledgeBaseService.ts`: Modificado para usar el archivo generado en lugar de la información hardcodeada.
- `client/src/lib/fallbackResponses.ts`: Modificado para usar las respuestas generadas en lugar de las hardcodeadas.
- `package.json`: Añadidos scripts de prebuild para ejecutar el script de generación.

## Archivos Creados

- `scripts/build-knowledge-base.js`: Script que lee el archivo markdown y genera los archivos TypeScript.
- `client/src/generated/knowledge-base.ts` (generado automáticamente): Contiene la base de conocimientos completa.
- `client/src/generated/fallback-responses.ts` (generado automáticamente): Contiene las respuestas de fallback extraídas de la base de conocimientos.

## Cómo Funciona

1. **Durante el proceso de construcción (build)**:
   - El script `scripts/build-knowledge-base.js` se ejecuta automáticamente.
   - Lee el archivo `memory/conocimientos.markdown`.
   - Genera los archivos TypeScript con el contenido.

2. **En el código del cliente**:
   - Los archivos `knowledgeBaseService.ts` y `fallbackResponses.ts` importan el contenido desde los archivos generados.
   - Si los archivos generados no existen (durante el desarrollo), se usa un contenido de fallback.

3. **Cuando quieras actualizar la información**:
   - Modifica el archivo `memory/conocimientos.markdown`.
   - Ejecuta un nuevo build (o haces un commit que desencadena un build automático en Vercel).
   - El script de build regenera los archivos con el contenido actualizado.

## Ventajas de esta Solución

1. **No hay información hardcodeada manualmente** - Todo el contenido proviene del archivo markdown.
2. **Proceso automatizado** - No hay posibilidad de errores humanos al copiar y pegar.
3. **Única fuente de verdad** - El archivo `memory/conocimientos.markdown` es la única fuente de información.
4. **Compatible con Vercel** - Funciona perfectamente en un entorno serverless.
5. **Mantenimiento sencillo** - Solo necesitas editar un archivo markdown.

## Cómo Actualizar la Información

Para actualizar la información del asistente, simplemente:

1. Edita el archivo `memory/conocimientos.markdown`.
2. Ejecuta `npm run build` para generar los archivos actualizados.
3. Despliega la aplicación.

En un entorno de CI/CD como Vercel, simplemente haz un commit y push de los cambios en el archivo markdown, y el proceso de construcción automático se encargará del resto.

## Consideraciones para el Desarrollo

Durante el desarrollo local, es posible que veas mensajes de advertencia sobre archivos generados que no existen. Esto es normal y no afecta al funcionamiento de la aplicación. Los archivos se generarán automáticamente durante el build.

Si quieres generar los archivos manualmente durante el desarrollo, puedes ejecutar:

```bash
node scripts/build-knowledge-base.js
```

## Conclusión

Con esta solución, se ha eliminado completamente la información hardcodeada del código y se ha implementado un proceso automatizado que garantiza que todas las respuestas del asistente estén basadas en la información actualizada del archivo `memory/conocimientos.markdown`. Esto facilita enormemente el mantenimiento y la actualización de la información del asistente.
