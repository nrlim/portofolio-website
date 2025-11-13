'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, MessageCircle, X, Sparkles, Trash2 } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const STORAGE_KEY = 'nuralim_chat_state_v2';
const STORAGE_VERSION = '2';

export function ChatWidgetModern() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      // Clear old cache keys on version change
      const oldKey = 'nuralim_chat_state';
      if (localStorage.getItem(oldKey)) {
        localStorage.removeItem(oldKey);
      }
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { isOpen: savedOpen, messages: savedMessages } = JSON.parse(saved);
        setIsOpen(savedOpen);
        setMessages(savedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat state:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('nuralim_chat_state');
      } catch (e) {
        // Ignore error
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isOpen, messages }));
      } catch (error) {
        console.error('Failed to save chat state:', error);
      }
    }
  }, [isOpen, messages, isHydrated]);

  // Handle outside click to close chat
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestBody = { messages: [...messages, userMessage] };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith('0:"')) {
            const match = trimmedLine.match(/0:"(.*)"$/);
            if (match) {
              const text = match[1].replace(/\\"/g, '"').replace(/\\\//g, '/');
              assistantMessage += text;
            }
          } else if (trimmedLine.startsWith('d:')) {
            try {
              const jsonStr = trimmedLine.substring(2);
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === 'text' && parsed.value) {
                assistantMessage += parsed.value;
              }
            } catch {
              assistantMessage += trimmedLine;
            }
          } else {
            assistantMessage += trimmedLine + '\n';
          }
        }

        if (assistantMessage.trim()) {
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg?.role === 'assistant') {
              return [...prev.slice(0, -1), { role: 'assistant', content: assistantMessage.trim() }];
            }
            return [...prev, { role: 'assistant', content: assistantMessage.trim() }];
          });
        }
      }

      if (buffer.trim()) {
        if (buffer.startsWith('0:"')) {
          const match = buffer.match(/0:"(.*)"$/);
          if (match) {
            const text = match[1].replace(/\\"/g, '"');
            assistantMessage += text;
          }
        } else {
          assistantMessage += buffer;
        }
      }

      const finalMessage = assistantMessage.trim();
      if (finalMessage) {
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.role === 'assistant') {
            return [...prev.slice(0, -1), { role: 'assistant', content: finalMessage }];
          }
          return [...prev, { role: 'assistant', content: finalMessage }];
        });
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, saya tidak menerima respons dari AI.' }]);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const confirmClearChatHistory = () => {
    setShowClearConfirm(true);
  };

  const clearChatHistory = () => {
    setMessages([]);
    setInput('');
    setShowClearConfirm(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('nuralim_chat_state'); // Also clear old key
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  const cancelClearChatHistory = () => {
    setShowClearConfirm(false);
  };

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative"
          aria-label="Open AI Chat"
        >
          {/* Animated background rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-50 blur-md group-hover:opacity-75 transition-opacity duration-300"></div>
          
          {/* Main button */}
          <div className="relative p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 text-white rounded-full shadow-2xl hover:shadow-2xl hover:from-blue-600 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-110 cursor-pointer border border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={24} className="animate-spin-slow" />
              <MessageCircle size={24} />
            </div>
          </div>

          {/* Floating label */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Tanya LimAI
          </div>
        </button>
      </div>
    );
  }

  return (
    <div ref={chatContainerRef} className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-1.5rem)]">
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-2xl flex flex-col h-[650px] rounded-2xl overflow-hidden border border-slate-700/50 backdrop-blur-xl">
        
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 opacity-50"></div>
          
          <div className="relative px-6 py-5 flex justify-between items-center border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg">
                  <Sparkles size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  LimAI
                </h3>
                <p className="text-xs text-slate-400">Rekomendasi profesional</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showClearConfirm ? (
                <>
                  <button
                    onClick={cancelClearChatHistory}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition-all duration-200 text-xs font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={clearChatHistory}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-200 text-xs font-medium shadow-lg"
                  >
                    Hapus
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={confirmClearChatHistory}
                    className="hover:bg-slate-700/50 p-2 rounded-lg transition-all duration-200 hover:scale-110 text-slate-400 hover:text-slate-200"
                    aria-label="Clear chat history"
                    title="Hapus riwayat chat"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-slate-700/50 p-2 rounded-lg transition-all duration-200 hover:scale-110 text-slate-400 hover:text-slate-200"
                    aria-label="Close chat"
                  >
                    <X size={22} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-950/50 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center py-8 px-4">
              <div className="mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-full border border-blue-500/20 backdrop-blur-sm">
                  <Sparkles size={40} className="text-cyan-400" />
                </div>
              </div>
              <h4 className="text-slate-200 font-semibold mb-2 text-lg">Halo! 👋</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Saya adalah AI assistant Nuralim - LimAI. Tanya saya tentang background, keahlian, atau pengalaman profesionalnya!
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setInput('Siapa Nuralim?')}
                  className="text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-full transition-all duration-200 hover:border-cyan-500/60"
                >
                  Siapa Nuralim?
                </button>
                <button
                  onClick={() => setInput('Apa keahlian Nuralim?')}
                  className="text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-full transition-all duration-200 hover:border-cyan-500/60"
                >
                  Keahlian?
                </button>
                <button
                  onClick={() => setInput('Apa proyek terbaik Nuralim?')}
                  className="text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-full transition-all duration-200 hover:border-cyan-500/60"
                >
                  Proyek Terbaik?
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg: Message, idx: number) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-xs px-5 py-3 rounded-xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-lg hover:shadow-blue-500/50'
                        : 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-100 rounded-bl-none border border-slate-600/50 hover:border-slate-500/50 shadow-lg'
                    } transition-all duration-200 hover:shadow-xl`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3 rounded-xl rounded-bl-none border border-slate-600/50">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-slate-700/50 p-4 bg-gradient-to-t from-slate-900 to-slate-800/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Tanya tentang Nuralim..."
              disabled={isLoading}
              className="text-sm bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 font-semibold flex items-center gap-2 px-4"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={18} />
                  <span className="hidden sm:inline">Kirim</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Footer accent */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 opacity-50"></div>
      </Card>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}
