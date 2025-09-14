'use client';

import { useState } from 'react';
import { useChatSendMessage, useChatStatus } from 'ai-sdk-zustand';

interface MessageInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
}

export function MessageInput({ 
  placeholder = "Type your message...", 
  onSend 
}: MessageInputProps) {
  const [input, setInput] = useState('');
  const sendMessage = useChatSendMessage();
  const status = useChatStatus();
  
  const isDisabled = status !== 'ready';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isDisabled) return;
    
    // Custom onSend callback for additional logic
    onSend?.(input);
    
    // Send message with metadata
    sendMessage({ 
      text: input,
      metadata: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }
    });
    
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isDisabled}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={isDisabled || !input.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {status === 'streaming' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
