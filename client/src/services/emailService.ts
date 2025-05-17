/**
 * Servicio para enviar correos electrónicos usando EmailJS
 * 
 * Este servicio permite enviar correos electrónicos desde el cliente
 * utilizando EmailJS (https://www.emailjs.com/)
 */

// Tipos para los parámetros de EmailJS
interface EmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Configuración de EmailJS
// Estos valores deben ser reemplazados con los proporcionados por EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

/**
 * Inicializa EmailJS
 * Esta función debe ser llamada una vez al inicio de la aplicación
 */
export const initEmailJS = (): void => {
  // Cargar el script de EmailJS dinámicamente
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  script.async = true;
  script.onload = () => {
    // Inicializar EmailJS con la clave pública
    (window as any).emailjs.init(EMAILJS_PUBLIC_KEY);
  };
  document.body.appendChild(script);
};

/**
 * Envía un correo electrónico usando EmailJS
 * 
 * @param params Parámetros del correo (nombre, email, asunto, mensaje)
 * @returns Promise que se resuelve cuando el correo es enviado
 */
export const sendEmail = async (params: EmailParams): Promise<{ success: boolean; message: string }> => {
  try {
    // Verificar que EmailJS esté cargado
    if (!(window as any).emailjs) {
      console.error('EmailJS no está cargado. Asegúrate de llamar a initEmailJS primero.');
      return { 
        success: false, 
        message: 'Error al enviar el mensaje. El servicio de correo no está disponible.' 
      };
    }

    // Preparar los parámetros para la plantilla
    const templateParams = {
      from_name: params.name,
      from_email: params.email,
      subject: params.subject,
      message: params.message,
    };

    // Enviar el correo
    const response = await (window as any).emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return { 
        success: true, 
        message: 'Mensaje enviado correctamente. Te contactaremos pronto.' 
      };
    } else {
      console.error('Error al enviar el correo:', response);
      return { 
        success: false, 
        message: `Error al enviar el mensaje. Código: ${response.status}` 
      };
    }
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return { 
      success: false, 
      message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' 
    };
  }
};
