import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Clock, Loader, MessageCircle, Sparkles, Activity } from 'lucide-react';

export default function UltraProfessionalChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Mensaje de bienvenida con delay profesional
    setTimeout(() => {
      setMessages([{
        _id: 'welcome',
        isBot: true,
        message: '¡Bienvenido! Soy tu asistente de IA profesional. Estoy aquí para brindarte respuestas precisas y asistencia personalizada. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date().toISOString()
      }]);
    }, 800);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      _id: Date.now().toString(),
      isBot: false,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Hacer request al servidor
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend
        })
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();
      
      // Simular typing delay para experiencia más natural
      setTimeout(() => {
        setMessages(prev => [...prev, {
          _id: (Date.now() + 1).toString(),
          isBot: true,
          message: data.message,
          timestamp: new Date().toISOString()
        }]);
        setIsTyping(false);
      }, 1200);

    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          _id: (Date.now() + 1).toString(),
          isBot: true,
          message: 'Disculpa, experimenté una dificultad técnica. Por favor, inténtalo nuevamente. Mi sistema está optimizado para brindarte la mejor experiencia.',
          timestamp: new Date().toISOString()
        }]);
        setIsTyping(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white/95 backdrop-blur-xl border border-white/20 relative z-10">
        
        {/* Header Premium */}
        <header className="bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 text-white px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  AI Assistant Pro
                </h1>
                <p className="text-sm text-purple-200 font-medium">Inteligencia Artificial Avanzada</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-purple-200">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gradient-to-b from-gray-50 to-white relative">
          {messages.map((msg, index) => (
            <div
              key={msg._id}
              className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                msg.isBot
                  ? 'bg-white/90 text-gray-800 border border-purple-100 shadow-purple-100/50'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-purple-500/30'
              }`}>
                <div className="flex items-center text-xs mb-3 gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    msg.isBot 
                      ? 'bg-purple-50 text-purple-600' 
                      : 'bg-white/20 text-white/80'
                  }`}>
                    {msg.isBot ? (
                      <>
                        <Sparkles size={12} />
                        <span className="font-bold">AI Assistant</span>
                      </>
                    ) : (
                      <>
                        <User size={12} />
                        <span className="font-bold">Tú</span>
                      </>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 ${
                    msg.isBot ? 'text-gray-500' : 'text-white/60'
                  }`}>
                    <Clock size={10} />
                    <span className="text-xs">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed font-medium">{msg.message}</p>
              </div>
            </div>
          ))}
          
          {/* Indicador de escritura mejorado */}
          {(isLoading || isTyping) && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-2xl px-6 py-4 rounded-2xl shadow-lg bg-white/90 text-gray-800 border border-purple-100 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Loader size={16} className="animate-spin text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-purple-600">AI Assistant está procesando...</span>
                    <div className="flex gap-1 mt-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </main>

        {/* Input Premium */}
        <footer className="bg-white/95 backdrop-blur-xl px-8 py-6 border-t border-gray-200/50">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta aquí... (Presiona Enter para enviar)"
                disabled={isLoading}
                rows={1}
                className="w-full px-6 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 resize-none font-medium text-gray-700 placeholder-gray-400 shadow-inner"
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
              <div className="absolute right-4 top-4 text-gray-400">
                <MessageCircle size={20} />
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span>Enviando</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Enviar</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
         
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}