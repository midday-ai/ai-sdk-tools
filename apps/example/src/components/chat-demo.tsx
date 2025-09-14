'use client';

import { useChat } from 'ai-sdk-zustand';
import { DefaultChatTransport } from 'ai';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { StatusIndicator } from './status-indicator';
import type { CustomUIMessage } from '../types/custom-message';

export default function Chat() {
  // Initialize chat with custom message type
  useChat<CustomUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const handleSend = (message: string) => {
    console.log('Sending message:', message);
    // Add any custom logic here before sending
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            AI SDK Zustand Demo
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            This demo shows split components with custom types, tool calls, and data parts.
            Try asking about weather, calculations, or search queries!
          </p>
          <StatusIndicator />
        </div>
        
        <div className="space-y-4">
          <MessageList />
          <MessageInput 
            placeholder="Ask about weather, calculations, or search for something..."
            onSend={handleSend}
          />
        </div>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Try these examples:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>"What's the weather in New York?"</li>
          <li>"Calculate 15 * 23 + 7"</li>
          <li>"Search for React hooks"</li>
          <li>"What's the weather in Tokyo and calculate the temperature in Fahrenheit?"</li>
        </ul>
      </div>
    </div>
  );
}