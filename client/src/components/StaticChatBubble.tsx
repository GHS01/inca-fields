import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, ExternalLink, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getStaticResponse } from '@/lib/staticChatbot';

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

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const StaticChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente virtual de Inca Fields. ¿En qué puedo ayudarte con nuestros aguacates? 🥑' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = { role: 'user' as const, content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      console.log('Procesando mensaje localmente:', newMessage);
      
      // Simular un pequeño retraso para dar sensación de procesamiento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Obtener el número de mensajes del usuario para contextualizar la respuesta
      const messageCount = messages.filter(msg => msg.role === 'user').length + 1;
      
      // Obtener respuesta estática basada en el mensaje y el contexto
      const responseText = getStaticResponse(newMessage, messageCount);
      
      // Añadir la respuesta al chat
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      
      // Mensaje de error genérico
      const errorMessage = 'Lo siento, parece que tuve un problema al procesar tu solicitud. Por favor, intenta de nuevo.';
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: errorMessage }
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
              <span className="font-body text-sm text-[#2D5C34] font-normal tracking-normal">¿Compras al por mayor?</span>
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
                    <div className="bg-gray-100 rounded-full px-4 py-2 text-sm animate-pulse">
                      <span>Escribiendo</span>
                      <span className="animate-[bounce_1s_infinite]">.</span>
                      <span className="animate-[bounce_1s_infinite_200ms]">.</span>
                      <span className="animate-[bounce_1s_infinite_400ms]">.</span>
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
