import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, ExternalLink, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFallbackResponse } from '@/lib/fallbackResponses';

// Añadimos un keyframe personalizado para el efecto de pulsación
const pulsateAnimation = `
  @keyframes gentle-pulsate {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    50% {
      transform: scale(1.03);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
`;

// Tipos de consulta que puede hacer el usuario
type QueryType = 'unknown' | 'mayoreo' | 'menudeo';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Respuestas predefinidas para el modo desarrollo (local) - Ya no se utilizan, se usa getFallbackResponse
// Mantenemos la estructura por compatibilidad, pero las respuestas se generan dinámicamente
const RESPUESTAS_PARA_DESARROLLO = {
  // Respuestas para preguntas de mayoreo
  mayoreo: {
    precio: 'Para compras al por mayor, contáctese con uno de nuestros mayoristas para atención exclusiva usando el botón de contacto.',
    disponibilidad: 'Los aguacates al por mayor están disponibles en los meses de Enero, Marzo y Mayo, que son nuestras temporadas principales de cosecha. Para otras fechas, por favor contacte directamente con nuestro equipo de ventas.',
    entrega: 'La entrega se realiza por camionadas en camiones de 5 a 10 toneladas. El tiempo de entrega es de 3-7 días hábiles tras confirmar el pedido, dependiendo de la ubicación de entrega dentro del Perú.',
    pago: 'Para pedidos al por mayor aceptamos pago del 50% por adelantado y 50% contra entrega. Los pagos pueden realizarse mediante transferencia bancaria, depósito o efectivo. Emitimos factura para todas las compras mayoristas.'
  },
  // Respuestas para preguntas de menudeo
  menudeo: {
    precio: 'El precio de nuestros aguacates al por menor es de S/ 6.50 por kg. Ofrecemos descuentos por volumen: 5% de descuento en compras de 10+ kg y 10% de descuento en compras de 25+ kg.',
    disponibilidad: 'Nuestros aguacates al por menor están disponibles todo el año en nuestros puntos de venta y para entrega a domicilio, sujeto a disponibilidad según la temporada de cosecha.',
    entrega: 'Ofrecemos entrega a domicilio en Lima Metropolitana con un costo adicional de S/ 10 para pedidos menores a S/ 100. La entrega es gratuita para pedidos mayores a S/ 100. El tiempo estimado de entrega es de 24-48 horas después de confirmar su pedido.',
    pago: 'Para compras al por menor aceptamos efectivo, transferencias bancarias, Yape, Plin, y tarjetas de crédito/débito. El pago debe ser completo antes de la entrega o al recibir el producto en caso de pago contra entrega.'
  },
  // Respuestas generales y conversacionales
  general: {
    saludo: '¡Hola! Soy el asistente virtual de Inca Aguacates. ¿En qué puedo ayudarte hoy?',
    despedida: 'Gracias por contactar a Inca Aguacates. ¡Que tengas un excelente día!',
    ayuda: 'Puedo responder preguntas sobre nuestros precios, disponibilidad, entregas y métodos de pago. ¿Sobre qué tema te gustaría recibir información?',
    contacto: 'Para hablar con un representante de ventas, puedes llamarnos al 01-234-5678 o enviarnos un correo a ventas@incaaguacates.com',
    default: 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla o preguntar sobre nuestros precios, disponibilidad, entregas o métodos de pago?'
  }
};

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente virtual de Inca Fields. ¿Estás interesado en comprar aguacates al por mayor o al por menor? 🥑' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Estado para el tipo de consulta (mayoreo o menudeo)
  const [queryType, setQueryType] = useState<QueryType>('unknown');

  // Estado para la cantidad (kilos o toneladas)
  const [quantity, setQuantity] = useState<number | null>(null);

  // Contador de preguntas del usuario
  const [questionCount, setQuestionCount] = useState(0);

  // Estado para saber si ya sugerimos contactar a un especialista
  const [specialistSuggested, setSpecialistSuggested] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detector de tipo de consulta mejorado con palabras clave más específicas
  const detectQueryType = (message: string): 'mayoreo' | 'menudeo' | 'unknown' => {
    const lowerMessage = message.toLowerCase();

    // Palabras clave para mayoreo
    const mayoreoKeywords = [
      'mayor', 'mayoreo', 'tonelada', 'toneladas', 'ton', 'grandes cantidades',
      'grandes pedidos', 'grandes volúmenes', 'compra grande', 'cantidad grande',
      'grandes lotes', 'distribuidor', 'distribuidores', 'revender', 'reventa',
      'exportar', 'exportación', 'negocio', 'comercial', 'empresa', 'empresarial',
      'restaurante', 'hotel', 'supermercado', 'mayorista', 'mayoristas', '500 kg',
      '1000 kg'
    ];

    // Palabras clave para menudeo
    const menudeoKeywords = [
      'menor', 'menudeo', 'kilo', 'kilos', 'kg', 'pequeñas cantidades',
      'pequeños pedidos', 'pequeños volúmenes', 'compra pequeña', 'cantidad pequeña',
      'unidad', 'unidades', 'personal', 'casa', 'hogar', 'familiar', 'consumo propio',
      'particular', 'individual', '6.50', 'seis', 'minorista'
    ];

    // Verificar mayoreo
    for (const keyword of mayoreoKeywords) {
      if (lowerMessage.includes(keyword)) {
        console.log("Detectado tipo de consulta: mayoreo");
        return 'mayoreo';
      }
    }

    // Verificar menudeo
    for (const keyword of menudeoKeywords) {
      if (lowerMessage.includes(keyword)) {
        console.log("Detectado tipo de consulta: menudeo");
        return 'menudeo';
      }
    }

    // Si no detectamos nada específico, retornamos unknown
    console.log("Tipo de consulta no detectado");
    return 'unknown';
  };

  // Función para extraer números del mensaje
  const extractNumber = (message: string): number | null => {
    const matches = message.match(/\d+/g);
    if (matches && matches.length > 0) {
      return parseInt(matches[0], 10);
    }
    return null;
  };

  // Funciones de detección de temas específicos
  const isPriceQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    const priceKeywords = [
      'precio', 'precios', 'costo', 'costos', 'valor', 'cuánto', 'cuanto',
      'cuestan', 'cuesta', 'tarifa', 'tarifas', 'pagar', 'cobran', 'cobra',
      'vale', 'valen', 'oferta', 'ofertas', 'descuento', 'descuentos',
      'económico', 'barato', 'costoso', 'promoción', 'promociones', 's/'
    ];

    return priceKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const isAvailabilityQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    const availabilityKeywords = [
      'disponible', 'disponibles', 'disponibilidad', 'hay', 'tienen', 'stock',
      'inventario', 'existencia', 'existencias', 'temporada', 'temporadas',
      'época', 'épocas', 'cuándo', 'cuando', 'mes', 'meses', 'año', 'años',
      'periodo', 'periodos', 'estación', 'estaciones', 'cosecha'
    ];

    return availabilityKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const isDeliveryQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    const deliveryKeywords = [
      'envío', 'envio', 'enviar', 'envían', 'envian', 'despacho', 'despachar',
      'entrega', 'entregar', 'entregan', 'llevar', 'llevan', 'transporte',
      'transportar', 'transportan', 'envíos', 'envios', 'entregas', 'delivery',
      'reparto', 'distribución', 'distribucion', 'recogida', 'recoger', 'recojo',
      'domicilio', 'tienda', 'local', 'tiempo', 'demora', 'tardanza', 'días', 'dias'
    ];

    return deliveryKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const isPaymentQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    const paymentKeywords = [
      'pago', 'pagos', 'pagar', 'abonar', 'abono', 'forma de pago', 'formas de pago',
      'método de pago', 'métodos de pago', 'metodo de pago', 'metodos de pago',
      'transferencia', 'tarjeta', 'tarjetas', 'efectivo', 'crédito', 'credito',
      'débito', 'debito', 'yape', 'plin', 'depósito', 'deposito', 'banco', 'bancos',
      'cancelar', 'cancelación', 'cancelacion', 'factura', 'facturas', 'boleta', 'boletas',
      'cuotas', 'adelanto', 'adelantos', 'inicial', 'iniciales'
    ];

    return paymentKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  /**
   * Procesa el mensaje del usuario y genera una respuesta apropiada
   */
  const processMessage = (message: string): string => {
    console.log("Procesando mensaje localmente:", message);

    // Usar el sistema de fallback para generar una respuesta
    return getFallbackResponse(message);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = { role: 'user' as const, content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      console.log('Procesando mensaje localmente:', newMessage);

      // Simulamos un tiempo de respuesta para que parezca natural
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Generamos una respuesta local basada en el contexto
      const localResponse = processMessage(newMessage);

      // Agregamos la respuesta generada localmente
      setMessages(prev => [...prev, { role: 'assistant', content: localResponse }]);
    } catch (error) {
      console.error('Error al procesar mensaje:', error);

      // Mensaje de error personalizado
      const errorMessage = 'Lo siento, parece que tuve un problema al procesar tu solicitud. Por favor, intenta de nuevo o contacta directamente con un especialista.';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const redirectToSpecialist = () => {
    window.open('https://w.app/incafields', '_blank');
  };

  return (
    <>
      {/* Inyectar los keyframes de la animación en el DOM */}
      <style>{pulsateAnimation}</style>

      <div className="fixed bottom-5 right-5 z-50">
        {/* Botón flotante estilo WhatsApp - Solo visible cuando el chat está cerrado */}
        {!isOpen && (
          <div className="flex flex-col items-end">
            <div
              className="mb-2 bg-white px-4 py-2 rounded-lg shadow-md"
              style={{
                animation: 'gentle-pulsate 2s ease-in-out infinite',
                transformOrigin: 'center'
              }}
            >
              <span className="font-body text-sm text-[#2D5C34] font-normal tracking-normal">¿Necesitas ayuda con tu compra?</span>
            </div>
            <Button
              onClick={toggleChat}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <MessageCircle size={24} className="text-white drop-shadow-md" />
            </Button>
          </div>
        )}

        {/* Ventana de chat */}
        {isOpen && (
          <div className="absolute bottom-0 right-0 w-[320px] sm:w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 transition-all duration-300 animate-in slide-in-from-bottom-5">
            {/* Encabezado del chat con gradiente */}
            <div className="bg-gradient-to-r from-[#1F4425] via-[#2D5C34] to-[#3D7244] p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mr-2 shadow-inner border border-white/20">
                    <MessageCircle size={18} className="text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base tracking-wide">Asistente Inca Fields</h3>
                    <p className="text-xs font-light opacity-85 tracking-wide">Siempre disponible para ayudarte</p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="h-7 w-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            </div>

            {/* Cuerpo del chat con patrón sutil */}
            <div
              ref={messageContainerRef}
              className="flex-1 overflow-y-auto h-[320px] max-h-[320px] bg-gradient-to-b from-gray-50 to-white bg-opacity-90 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgNTJBMjIgMjIgMCAxIDEgNTIgMzAgMjIgMjIgMCAwIDEgMzAgNTJabTAtNDBhMTggMTggMCAxIDAgMTggMThBMTggMTggMCAwIDAgMzAgMTJaIiBmaWxsPSIjZjJmMmYyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')]"
            >
              <div className="p-3 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-full",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] relative",
                        message.role === 'user' ? "order-1" : "order-1"
                      )}
                    >
                      <div
                        className={cn(
                          "px-3 py-2 rounded-2xl shadow-sm text-sm",
                          message.role === 'user'
                            ? "bg-gradient-to-br from-[#2D5C34] to-[#1F4425] text-white rounded-tr-none"
                            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="absolute bottom-0 right-1 flex items-center text-[10px] text-white/90">
                          <Check size={10} className="ml-1" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%]">
                      <div className="bg-white text-gray-800 px-3 py-2 rounded-2xl border border-gray-100 rounded-tl-none shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Botón para hablar con especialista - Siempre con estilo hover */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
              <Button
                onClick={redirectToSpecialist}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-2 text-white border-transparent bg-gradient-to-r from-[#2D5C34] to-[#3D7244] transition-all duration-300 rounded-xl shadow-md group text-sm"
              >
                <span className="font-medium">Hablar con un especialista</span>
                <ExternalLink size={14} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Campo de entrada del mensaje estilizado */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-200 rounded-2xl pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D5C34]/30 focus:border-[#2D5C34] transition-all resize-none h-10 min-h-[40px] max-h-32 text-sm shadow-sm bg-gray-50/50"
                  placeholder="Escribe tu mensaje..."
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full bg-gradient-to-r from-[#2D5C34] to-[#3D7244] hover:from-[#3D7244] hover:to-[#2D5C34] flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-md"
                >
                  <ArrowRight size={14} className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBubble;