import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, ExternalLink, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCurrentSection } from '@/hooks/use-current-section';
import { useIsMobile } from '@/hooks/use-mobile';
import { CHAT_API_URL } from '@/config/api';
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

// La URL del servicio de chatbot ahora se importa desde config/api.ts

const StaticChatBubble = () => {
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

  // Detectar si estamos en un dispositivo móvil o tablet
  const isMobile = useIsMobile();

  // Detectar la sección actual
  const { isHomeSection } = useCurrentSection();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para detectar si el mensaje es sobre compras al por mayor o menor
  const detectQueryType = (message: string): QueryType => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('mayor') ||
      lowerMessage.includes('mayoreo') ||
      lowerMessage.includes('tonelada') ||
      lowerMessage.includes('grandes') ||
      lowerMessage.includes('volumen') ||
      lowerMessage.includes('grande') ||
      lowerMessage.includes('mayorista')
    ) {
      return 'mayoreo';
    }

    if (
      lowerMessage.includes('menor') ||
      lowerMessage.includes('menudeo') ||
      lowerMessage.includes('kilo') ||
      lowerMessage.includes('poco') ||
      lowerMessage.includes('pequeña') ||
      lowerMessage.includes('pocos') ||
      lowerMessage.includes('detalle') ||
      lowerMessage.includes('personal')
    ) {
      return 'menudeo';
    }

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

  // Funciones para verificar si el mensaje incluye preguntas
  const isPriceQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes('precio') ||
      lowerMessage.includes('costo') ||
      lowerMessage.includes('valor') ||
      lowerMessage.includes('cuánto') ||
      lowerMessage.includes('cuanto') ||
      lowerMessage.includes('tarifa')
    );
  };

  const isDeliveryQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes('entrega') ||
      lowerMessage.includes('envío') ||
      lowerMessage.includes('envio') ||
      lowerMessage.includes('envian') ||
      lowerMessage.includes('llega') ||
      lowerMessage.includes('recibir') ||
      lowerMessage.includes('recojo') ||
      lowerMessage.includes('transporte') ||
      lowerMessage.includes('despacho')
    );
  };

  const isAvailabilityQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes('disponible') ||
      lowerMessage.includes('cuando') ||
      lowerMessage.includes('cuándo') ||
      lowerMessage.includes('temporada') ||
      lowerMessage.includes('época') ||
      lowerMessage.includes('fecha') ||
      lowerMessage.includes('mes') ||
      lowerMessage.includes('tiempo')
    );
  };

  const isPaymentQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes('pago') ||
      lowerMessage.includes('pagar') ||
      lowerMessage.includes('transferencia') ||
      lowerMessage.includes('efectivo') ||
      lowerMessage.includes('yape') ||
      lowerMessage.includes('plin') ||
      lowerMessage.includes('tarjeta') ||
      lowerMessage.includes('factura')
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = { role: 'user' as const, content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Incrementar el contador de preguntas
      const newCount = questionCount + 1;
      setQuestionCount(newCount);

      // Detectar tipo de consulta
      const detectedType = detectQueryType(newMessage);
      if (queryType === 'unknown' && detectedType !== 'unknown') {
        setQueryType(detectedType);
      }

      // Detectar cantidad
      const extractedNumber = extractNumber(newMessage);
      if (extractedNumber !== null) {
        setQuantity(extractedNumber);
      }

      // Preparar el historial de chat para enviar al servidor
      // Limitamos a los últimos 10 mensajes para no sobrecargar la API
      const chatHistoryToSend = messages.slice(-10);
      console.log(`Enviando historial de chat: ${chatHistoryToSend.length} mensajes`);

      // Datos para enviar al servidor
      const requestData = {
        message: newMessage,
        chatHistory: chatHistoryToSend,
        messageCount: newCount,
        queryType: queryType !== 'unknown' ? queryType : detectedType,
        quantity: quantity || extractedNumber
      };

      // Intentar llamar a la API con reintentos
      let response = null;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          console.log(`Intento ${retryCount + 1} de llamada a la API...`);

          // Llamar al microservicio de chatbot con la URL de la configuración
          response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
          });

          // Si la respuesta es exitosa, salir del bucle
          if (response.ok) {
            break;
          }

          // Si es un error 405 (Method Not Allowed), no reintentar
          if (response.status === 405) {
            console.error('Error 405: Método no permitido. No se reintentará.');
            throw new Error(`Error ${response.status}: Método no permitido`);
          }

          // Incrementar contador de reintentos
          retryCount++;

          // Si hemos alcanzado el máximo de reintentos, lanzar error
          if (retryCount > maxRetries) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }

          // Esperar antes de reintentar (backoff exponencial)
          await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, retryCount)));
        } catch (fetchError) {
          console.error(`Error en intento ${retryCount + 1}:`, fetchError);

          // Si es un error de red (no de respuesta HTTP), incrementar contador
          retryCount++;

          // Si hemos alcanzado el máximo de reintentos, relanzar el error
          if (retryCount > maxRetries) {
            throw fetchError;
          }

          // Esperar antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, retryCount)));
        }
      }

      // Procesar la respuesta
      if (response && response.ok) {
        const data = await response.json();

        // Agregar la respuesta del chatbot
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response || '¡Lo siento! Hubo un problema al procesar tu consulta. Por favor, intenta de nuevo.'
        }]);

        // Actualizar estado de sugerencia de especialista
        if (newCount >= 5 && !specialistSuggested) {
          setSpecialistSuggested(true);
        }
      } else {
        // Si después de los reintentos no tenemos una respuesta válida, usar fallback
        throw new Error('No se pudo obtener una respuesta válida del servidor');
      }
    } catch (error) {
      console.error('Error al procesar mensaje:', error);

      // Usar el sistema de fallback para generar una respuesta local
      console.log('Usando sistema de fallback para generar respuesta...');
      const fallbackResponse = getFallbackResponse(newMessage);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackResponse
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

  // Determinar si debemos mostrar la burbuja de chat
  const shouldShowChatBubble = !isMobile || !isHomeSection || isOpen;

  return (
    <>
      {/* Inyectar los keyframes de la animación en el DOM */}
      <style>{pulsateAnimation}</style>

      {/* Estilos adicionales para la transición de la burbuja */}
      <style>{`
        @media (max-width: 768px) {
          .chat-bubble-container {
            transition: opacity 0.3s ease, transform 0.3s ease;
          }
          .chat-bubble-hidden {
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
          }
          .chat-bubble-visible {
            opacity: 1;
            transform: translateY(0);
          }
          .chat-text-mobile {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <div className={cn(
        "fixed bottom-5 right-5 z-50 chat-bubble-container",
        shouldShowChatBubble ? "chat-bubble-visible" : "chat-bubble-hidden"
      )}>
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
              <span className={cn(
                "font-body text-[#2D5C34] font-normal tracking-normal",
                isMobile ? "chat-text-mobile" : "text-sm"
              )}>¿Compras al por mayor?</span>
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

            {/* Botón para hablar con especialista */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
              <Button
                onClick={redirectToSpecialist}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-2 text-[#2D5C34] border-[#2D5C34]/30 hover:bg-gradient-to-r hover:from-[#2D5C34] hover:to-[#3D7244] hover:text-white hover:border-transparent transition-all duration-300 rounded-xl shadow-sm hover:shadow-md group text-sm"
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

export default StaticChatBubble;
