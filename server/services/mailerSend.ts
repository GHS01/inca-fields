import { InsertContact } from '@shared/schema';
import { log } from '../vite';

interface MailerSendEmailParams {
  to: {
    email: string;
    name?: string;
  }[];
  from: {
    email: string;
    name?: string;
  };
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Service for sending emails using MailerSend API
 */
export class MailerSendService {
  private apiKey: string;
  private apiUrl: string = 'https://api.mailersend.com/v1/email';
  private fromEmail: string;
  private fromName: string;
  private toEmail: string;

  constructor() {
    this.apiKey = process.env.MAILERSEND_API_KEY || '';

    // Usamos el dominio verificado que MailerSend ha asignado a la cuenta
    this.fromEmail = 'contacto@test-eqvygm0n68zl0p7w.mlsender.net'; // Dominio verificado
    this.fromName = process.env.MAILERSEND_FROM_NAME || 'Inca Fields Premium';

    // El correo al que se enviarán los mensajes (debe ser el mismo que se usó para registrar la cuenta)
    this.toEmail = process.env.MAILERSEND_TO_EMAIL || 'peru.aguacates@gmail.com';

    if (!this.apiKey) {
      log('⚠️ MAILERSEND_API_KEY is not set. Email functionality will not work.');
    }

    log(`📧 MailerSend configurado con:
    - API Key: ${this.apiKey ? '✅ Configurada' : '❌ No configurada'}
    - From: ${this.fromEmail} (${this.fromName})
    - To: ${this.toEmail}`);
  }

  /**
   * Send an email using MailerSend API
   */
  async sendEmail(params: MailerSendEmailParams): Promise<boolean> {
    if (!this.apiKey) {
      log('⚠️ Cannot send email: MAILERSEND_API_KEY is not set');
      return false;
    }

    try {
      // Log the request for debugging
      log(`📧 Sending email from ${params.from.email} to ${params.to.map(t => t.email).join(', ')}`);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(params)
      });

      // Log the full response for debugging
      const responseText = await response.text();
      let errorData = {};

      try {
        if (responseText) {
          errorData = JSON.parse(responseText);
        }
      } catch (e) {
        log(`Warning: Could not parse response as JSON: ${responseText}`);
      }

      if (!response.ok) {
        log(`❌ Error sending email: ${response.status} ${response.statusText}`);
        log(`Error details: ${JSON.stringify(errorData)}`);
        return false;
      }

      log('✅ Email sent successfully');
      return true;
    } catch (error) {
      log(`❌ Exception sending email: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Send a contact form submission as an email
   */
  async sendContactFormEmail(contact: InsertContact): Promise<boolean> {
    const text = `
Nuevo mensaje de contacto:

Nombre: ${contact.name}
Email: ${contact.email}
WhatsApp: ${contact.whatsapp}
Asunto: ${contact.subject}
Mensaje:
${contact.message}

Aceptó política de privacidad: ${contact.acceptedPrivacy ? 'Sí' : 'No'}
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2D5C34; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #2D5C34; }
    .message { white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
    .footer { margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Nuevo Mensaje de Contacto</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Nombre:</span> ${contact.name}
      </div>
      <div class="field">
        <span class="label">Email:</span> ${contact.email}
      </div>
      <div class="field">
        <span class="label">WhatsApp:</span> ${contact.whatsapp}
      </div>
      <div class="field">
        <span class="label">Asunto:</span> ${contact.subject}
      </div>
      <div class="field">
        <span class="label">Mensaje:</span>
        <div class="message">${contact.message.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="field">
        <span class="label">Aceptó política de privacidad:</span> ${contact.acceptedPrivacy ? 'Sí' : 'No'}
      </div>
    </div>
    <div class="footer">
      Este mensaje fue enviado desde el formulario de contacto de Inca Fields Premium.
    </div>
  </div>
</body>
</html>
`;

    // Registrar información de depuración
    log(`📧 Intentando enviar email de contacto:
    - From: ${this.fromEmail} (${this.fromName})
    - To: ${this.toEmail}
    - Subject: Nuevo contacto: ${contact.subject}
    - Nombre del contacto: ${contact.name}
    - Email del contacto: ${contact.email}`);

    return this.sendEmail({
      to: [{ email: this.toEmail }],
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      subject: `Nuevo contacto: ${contact.subject}`,
      text,
      html
    });
  }
}

// Create a singleton instance
export const mailerSend = new MailerSendService();
