# Configuración de EmailJS para el Formulario de Contacto

Este documento explica cómo configurar EmailJS para recibir los mensajes del formulario de contacto por correo electrónico.

## ¿Qué es EmailJS?

EmailJS es un servicio que permite enviar correos electrónicos directamente desde el código JavaScript del cliente, sin necesidad de un servidor backend. Ofrece un plan gratuito que incluye hasta 200 correos por mes, lo que es suficiente para la mayoría de los sitios web pequeños.

## Pasos para configurar EmailJS

### 1. Crear una cuenta en EmailJS

1. Ve a [EmailJS](https://www.emailjs.com/) y crea una cuenta gratuita.
2. Inicia sesión en tu cuenta.

### 2. Configurar un servicio de correo electrónico

1. En el panel de control, ve a la sección "Email Services".
2. Haz clic en "Add New Service".
3. Selecciona tu proveedor de correo electrónico (Gmail, Outlook, etc.).
4. Sigue las instrucciones para conectar tu cuenta de correo.
5. Asigna un nombre al servicio (por ejemplo, "inca-fields-contact").
6. Guarda la configuración y anota el ID del servicio (lo necesitarás más adelante).

### 3. Crear una plantilla de correo electrónico

1. Ve a la sección "Email Templates".
2. Haz clic en "Create New Template".
3. Diseña tu plantilla de correo. Puedes usar las siguientes variables en tu plantilla:
   - `{{from_name}}`: Nombre de la persona que envía el mensaje
   - `{{from_email}}`: Email de la persona que envía el mensaje
   - `{{subject}}`: Asunto del mensaje
   - `{{message}}`: Contenido del mensaje
4. Ejemplo de plantilla:

```
Nuevo mensaje de contacto de Inca Fields

Nombre: {{from_name}}
Email: {{from_email}}
Asunto: {{subject}}

Mensaje:
{{message}}
```

5. Guarda la plantilla y anota el ID de la plantilla.

### 4. Obtener la clave pública de la API

1. Ve a la sección "Account" > "API Keys".
2. Copia tu clave pública (Public Key).

### 5. Configurar las variables de entorno

1. Abre el archivo `.env` en la raíz del proyecto.
2. Actualiza las siguientes variables con los valores que anotaste:

```
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

3. Guarda el archivo.

### 6. Reconstruir la aplicación

1. Ejecuta `npm run build` para reconstruir la aplicación con las nuevas variables de entorno.
2. Inicia la aplicación con `npm start`.

## Prueba del formulario

1. Ve a la sección de contacto de tu sitio web.
2. Completa el formulario y envíalo.
3. Deberías recibir un correo electrónico con los detalles del mensaje.

## Solución de problemas

Si no recibes los correos electrónicos:

1. Verifica que las variables de entorno estén correctamente configuradas.
2. Revisa la consola del navegador para ver si hay errores.
3. Asegúrate de que el servicio de correo electrónico esté correctamente configurado en EmailJS.
4. Verifica que la plantilla de correo electrónico esté correctamente configurada.
5. Comprueba la carpeta de spam de tu correo electrónico.

## Límites del plan gratuito

- 200 correos por mes
- Sin soporte para archivos adjuntos
- Branding de EmailJS en los correos

Si necesitas más funcionalidades, puedes actualizar a un plan de pago en [EmailJS](https://www.emailjs.com/pricing/).
