import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle, RotateCcw, Zap, Star } from 'lucide-react';
import { GeminiModel, Message } from '../types';
import { AVAILABLE_MODELS } from '../constants';
import { sendMessageToGemini, resetChatSession, checkApiKeyConfigured } from '../services/geminiService';
import MarkdownView from './MarkdownView';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>(GeminiModel.FLASH);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat on mount or model change
  useEffect(() => {
    if (!checkApiKeyConfigured()) {
      setError("API Key is missing. Please set process.env.API_KEY.");
      return;
    }
    try {
      resetChatSession();
      setMessages([]); // Reset messages on model switch
      setError(null);
    } catch (e) {
      setError("Failed to initialize chat session.");
    }
  }, [selectedModel]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(
          userMsg.text, 
          () => {}, 
          { name: null, subject: null, level: null, grade: null } // Dummy profile for this view
      );
      
      const modelMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text,
          timestamp: new Date(),
          analysis: response.analysis,
          mechanical: response.mechanical
      };
      
      setMessages(prev => [...prev, modelMsg]);

    } catch (e: any) {
      console.error(e);
      const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "**Error:** Failed to generate response.",
          timestamp: new Date(),
          isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-white mb-2">Configuration Error</h2>
        <p className="text-slate-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0f172a]">
      {/* Top Bar - Model Selector */}
      <div className="h-14 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-900/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-400">Model:</span>
          <div className="flex bg-slate-800 rounded-lg p-1">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-all ${
                  selectedModel === model.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {model.id === GeminiModel.FLASH ? <Zap size={12} /> : <Star size={12} />}
                {model.name}
              </button>
            ))}
          </div>
        </div>
        <button 
            onClick={() => {
                setMessages([]);
                resetChatSession();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset Chat"
        >
            <RotateCcw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
            <Bot size={64} className="mb-4" />
            <p className="text-lg font-medium">Start a conversation with Gemini</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 max-w-4xl mx-auto ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}
            
            <div
              className={`flex-1 min-w-0 max-w-3xl rounded-2xl p-5 ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white rounded-tr-sm'
                  : 'bg-transparent border border-slate-800 text-slate-100 rounded-tl-sm shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap">{msg.text}</div>
              ) : (
                <MarkdownView content={msg.text} />
              )}
              {msg.isError && (
                 <div className="mt-2 text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> Error generating response
                 </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto justify-start">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex items-center gap-1 p-4">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0f172a] border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative bg-slate-900 rounded-xl border border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-600/50 focus-within:border-blue-500 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="w-full bg-transparent text-white placeholder-slate-500 p-4 pr-12 rounded-xl resize-none outline-none min-h-[60px] max-h-[200px]"
            rows={1}
            style={{ minHeight: '60px' }}
          />
          <div className="absolute right-2 bottom-2">
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-lg transition-all ${
                input.trim() && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-2 text-center">
            <span className="text-xs text-slate-600">Gemini can make mistakes. Verify important information.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatView;