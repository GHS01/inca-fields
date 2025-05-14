/**
 * Script para generar archivos TypeScript con la base de conocimientos
 * Este script se ejecuta durante el proceso de construcción (build)
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
    // Ruta al archivo de conocimientos
    const knowledgeBasePath = path.join(__dirname, '..', 'memory', 'conocimientos.markdown');

    // Verificar si el archivo existe
    if (!fs.existsSync(knowledgeBasePath)) {
      console.error(`Error: El archivo ${knowledgeBasePath} no existe`);
      process.exit(1);
    }

    // Leer el contenido del archivo
    const content = fs.readFileSync(knowledgeBasePath, 'utf8');

    // Crear el directorio de salida si no existe
    const outputDir = path.join(__dirname, '..', 'client', 'src', 'generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generar el archivo con la base de conocimientos completa
    const knowledgeBaseTsPath = path.join(outputDir, 'knowledge-base.ts');
    const knowledgeBaseTsContent = `
// Este archivo se genera automáticamente durante el proceso de construcción
// No modificar manualmente

export const KNOWLEDGE_BASE_CONTENT = ${JSON.stringify(content)};
`;

    fs.writeFileSync(knowledgeBaseTsPath, knowledgeBaseTsContent);
    console.log(`✅ Base de conocimientos generada en ${knowledgeBaseTsPath}`);

    // Generar el archivo con las respuestas de fallback
    const fallbackResponsesTsPath = path.join(outputDir, 'fallback-responses.ts');
    const fallbackResponsesTsContent = `
// Este archivo se genera automáticamente durante el proceso de construcción
// No modificar manualmente

export const FALLBACK_RESPONSES = {
  mayoreo: {
    precio: "Para compras al por mayor, contáctese con uno de nuestros mayoristas para atención exclusiva usando el botón de contacto.",
    disponibilidad: "Los aguacates al por mayor están disponibles en enero, marzo y mayo.",
    entrega: "Para pedidos al por mayor: Entrega por camionadas en 3-7 días hábiles tras confirmar pedido.",
    pago: "Transferencia bancaria, efectivo o pagos digitales (Yape, Plin) para ambos tipos de venta.",
    default: "Para compras al por mayor, contáctese con uno de nuestros mayoristas para atención exclusiva usando el botón de contacto. Los aguacates al por mayor están disponibles en enero, marzo y mayo. ¿Te gustaría conocer más detalles?"
  },
  menudeo: {
    precio: "S/ 6.50 por kg, según disponibilidad.",
    disponibilidad: "Nuestros aguacates al por menor están disponibles todo el año, sujeto a disponibilidad de cosecha.",
    entrega: "Para compras al por menor: Entrega a domicilio o recogida en puntos de venta en 1-3 días hábiles.",
    pago: "Transferencia bancaria, efectivo o pagos digitales (Yape, Plin) para ambos tipos de venta.",
    default: "El precio al por menor es S/ 6.50 por kg, según disponibilidad. Nuestros aguacates están disponibles todo el año, sujeto a disponibilidad de cosecha. ¿Te gustaría conocer más detalles?"
  },
  general: {
    default: "Actualmente no manejo esa información, te sugiero que te pongas en contacto con uno de nuestros especialistas para que puedan brindarte mayor información al respecto usando el botón que aparece abajo.",
    horarios: "Lunes a viernes de 9:00 AM a 6:00 PM. Sábados de 10:00 AM a 2:00 PM. Domingos cerrado.",
    contacto: "Puedes contactarnos usando el botón que aparece abajo para hablar con un especialista.",
    ubicacion: "Para información sobre nuestra ubicación, por favor contacta con uno de nuestros especialistas usando el botón que aparece abajo."
  }
};
`;

    fs.writeFileSync(fallbackResponsesTsPath, fallbackResponsesTsContent);
    console.log(`✅ Respuestas de fallback generadas en ${fallbackResponsesTsPath}`);

    console.log('✅ Proceso completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante la generación de archivos:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
