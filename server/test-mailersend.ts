import dotenv from 'dotenv';
dotenv.config();

import { mailerSend } from './services/mailerSend';
import { log } from './vite';

/**
 * Script para probar la configuración de MailerSend
 */
async function testMailerSend() {
  log('🧪 Iniciando prueba de MailerSend...');

  // Verificar la configuración
  log(`📋 Configuración actual:
  - API Key: ${process.env.MAILERSEND_API_KEY ? '✅ Configurada' : '❌ No configurada'}
  - From Email: ${process.env.MAILERSEND_FROM_EMAIL || 'No configurado'}
  - To Email: ${process.env.MAILERSEND_TO_EMAIL || 'No configurado'}
  `);

  // Intentar enviar un correo de prueba
  const result = await mailerSend.sendEmail({
    to: [{ email: process.env.MAILERSEND_TO_EMAIL || 'peru.aguacates@gmail.com' }],
    from: {
      email: 'contacto@test-eqvygm0n68zl0p7w.mlsender.net', // Dominio verificado
      name: 'Inca Fields Premium'
    },
    subject: 'Prueba de MailerSend',
    text: 'Este es un correo de prueba enviado desde la API de MailerSend.',
    html: '<p>Este es un correo de prueba enviado desde la API de MailerSend.</p>'
  });

  if (result) {
    log('✅ Prueba exitosa: El correo se envió correctamente.');
  } else {
    log('❌ Prueba fallida: No se pudo enviar el correo.');
  }
}

// Ejecutar la prueba
testMailerSend().catch(error => {
  log(`❌ Error durante la prueba: ${error instanceof Error ? error.message : String(error)}`);
});
