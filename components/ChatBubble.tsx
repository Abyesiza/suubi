// src/components/ChatBubble.tsx
'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Define the structure of a message
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

// --- Main Component ---
export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  // Hide the initial notification dot after 10 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Notification indicator */}
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
          />
        )}
        
        <Button
          onClick={() => {
            setIsOpen(true);
            setShowNotification(false);
          }}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="w-8 h-8 text-primary-foreground" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && <ChatWindow closeChat={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}


// --- Chat Window Component ---
function ChatWindow({ closeChat }: { closeChat: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial-message', text: "Hello! I'm Suubi's AI health advisor. How can I help you today? Remember, I am not a doctor.", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim() || isTyping) return;

    // Add user message to the list
    const newUserMessage: Message = { id: crypto.randomUUID(), text: userMessage, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    // Prepare history for the API call, excluding the initial bot greeting.
    const history = messages
      .filter(msg => msg.id !== 'initial-message') // <-- THE FIX IS HERE
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));


    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response.');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Add the bot response message
      const botMessage: Message = { 
        id: crypto.randomUUID(), 
        text: data.message || "I'm sorry, I couldn't generate a response.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Chat fetch error:", error);
      const errorBotMessage: Message = { 
        id: crypto.randomUUID(), 
        text: "Sorry, I'm having trouble connecting right now. Please try again later or contact Suubi Medical Centre directly.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm"
    >
      <Card className="shadow-2xl border-green-200 overflow-hidden flex flex-col h-[60vh] max-h-[500px]">
        {/* Header */}
        <div className="p-3 bg-primary text-primary-foreground flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse"></div>
            <h3 className="font-semibold text-sm">Suubi Health Advisor</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={closeChat} className="h-7 w-7" aria-label="Close chat">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <MessageView key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Form */}
        <ChatInput onSend={handleSend} isSending={isTyping} />
      </Card>
    </motion.div>
  );
}

// --- Message View Component ---
function MessageView({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] p-3 rounded-2xl text-sm ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none border'
        }`}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

// --- Typing Indicator ---
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-end gap-2 justify-start"
    >
      <div className="bg-white p-3 rounded-2xl rounded-bl-none border flex items-center gap-1.5">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
      </div>
    </motion.div>
  );
}

// --- Chat Input Component ---
function ChatInput({ onSend, isSending }: { onSend: (message: string) => void, isSending: boolean }) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="p-3 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a health question..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSending}
        />
        <Button
          type="submit"
          aria-label="Send message"
          disabled={isSending || !message.trim()}
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
      <p className="text-xs text-gray-400 mt-2 text-center">
        AI assistant. Not a substitute for medical advice.
      </p>
    </div>
  );
}