/**
 * Script para verificar que los archivos generados se hayan copiado correctamente
 * Este script se ejecuta después del proceso de construcción (build)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función principal
async function main() {
  try {
    console.log('🔍 Verificando archivos generados...');

    // Rutas a los archivos generados
    const generatedDir = path.join(__dirname, '..', 'client', 'src', 'generated');
    const knowledgeBasePath = path.join(generatedDir, 'knowledge-base.ts');
    const fallbackResponsesPath = path.join(generatedDir, 'fallback-responses.ts');

    // Verificar si los archivos existen
    if (!fs.existsSync(knowledgeBasePath)) {
      console.error(`❌ Error: El archivo ${knowledgeBasePath} no existe`);
      process.exit(1);
    }

    if (!fs.existsSync(fallbackResponsesPath)) {
      console.error(`❌ Error: El archivo ${fallbackResponsesPath} no existe`);
      process.exit(1);
    }

    console.log('✅ Archivos generados verificados correctamente');

    // Verificar que los archivos se hayan copiado al directorio de salida
    const distDir = path.join(__dirname, '..', 'dist', 'public');
    
    // Buscar los archivos generados en el directorio de salida
    const files = fs.readdirSync(distDir, { recursive: true });
    const knowledgeBaseFile = files.find(file => 
      typeof file === 'string' && file.includes('knowledge-base') && file.endsWith('.js')
    );
    const fallbackResponsesFile = files.find(file => 
      typeof file === 'string' && file.includes('fallback-responses') && file.endsWith('.js')
    );

    if (!knowledgeBaseFile) {
      console.warn('⚠️ Advertencia: No se encontró el archivo knowledge-base.js en el directorio de salida');
      console.warn('Esto puede causar problemas en producción');
    } else {
      console.log(`✅ Archivo knowledge-base.js encontrado en el directorio de salida: ${knowledgeBaseFile}`);
    }

    if (!fallbackResponsesFile) {
      console.warn('⚠️ Advertencia: No se encontró el archivo fallback-responses.js en el directorio de salida');
      console.warn('Esto puede causar problemas en producción');
    } else {
      console.log(`✅ Archivo fallback-responses.js encontrado en el directorio de salida: ${fallbackResponsesFile}`);
    }

    console.log('✅ Verificación completada');
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
