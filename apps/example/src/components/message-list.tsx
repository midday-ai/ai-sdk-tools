'use client';

import { useChatMessages, useChatStatus } from '@ai-sdk-tools/store';
import type { UIMessage } from 'ai';

interface MessageListProps {}

export function MessageList({}: MessageListProps) {
  const messages = useChatMessages();
  const status = useChatStatus();

  if (messages.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No messages yet. Start a conversation!
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {status === 'streaming' && (
        <div className="text-gray-400 text-sm">AI is typing...</div>
      )}
    </div>
  );
}

interface MessageItemProps {
  message: UIMessage;
}

function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : isAssistant
            ? 'bg-gray-100 text-gray-900'
            : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
        }`}
      >
        <div className="text-xs font-medium mb-1 opacity-70">
          {isUser ? 'You' : isAssistant ? 'Assistant' : 'System'}
        </div>
        
        <div className="space-y-2">
          {message.parts?.map((part, index) => (
            <MessagePart key={index} part={part} />
          ))}
        </div>

        {/* Show custom metadata if present */}
        {message.metadata && typeof message.metadata === 'object' && message.metadata !== null && Object.keys(message.metadata).length > 0 ? (
          <div className="mt-2 text-xs opacity-70">
            <details>
              <summary className="cursor-pointer">Metadata</summary>
              <pre className="mt-1 text-xs bg-black/10 rounded p-2 overflow-x-auto">
                {JSON.stringify(message.metadata, null, 2)}
              </pre>
            </details>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface MessagePartProps {
  part: any; // Will be properly typed with custom types
}

function MessagePart({ part }: MessagePartProps) {
  switch (part.type) {
    case 'text':
      return <div className="whitespace-pre-wrap">{part.text}</div>;
    
    case 'tool-call':
      return (
        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
          <div className="font-medium text-blue-800">🛠️ Tool Call: {part.toolName}</div>
          <div className="text-blue-600 mt-1">
            <details>
              <summary className="cursor-pointer">Arguments</summary>
              <pre className="mt-1 text-xs bg-blue-100 rounded p-1 overflow-x-auto">
                {JSON.stringify(part.args, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      );
    
    case 'tool-result':
      return (
        <div className="bg-green-50 border border-green-200 rounded p-2 text-sm">
          <div className="font-medium text-green-800">✅ Tool Result: {part.toolName}</div>
          <div className="text-green-600 mt-1">
            <pre className="text-xs bg-green-100 rounded p-1 overflow-x-auto">
              {JSON.stringify(part.result, null, 2)}
            </pre>
          </div>
        </div>
      );
    
    case 'data':
      return (
        <div className="bg-purple-50 border border-purple-200 rounded p-2 text-sm">
          <div className="font-medium text-purple-800">📊 Data</div>
          <div className="text-purple-600 mt-1">
            <pre className="text-xs bg-purple-100 rounded p-1 overflow-x-auto">
              {JSON.stringify(part.data, null, 2)}
            </pre>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="bg-gray-50 border border-gray-200 rounded p-2 text-sm">
          <div className="font-medium text-gray-800">Unknown part type: {part.type}</div>
          <pre className="text-xs bg-gray-100 rounded p-1 overflow-x-auto mt-1">
            {JSON.stringify(part, null, 2)}
          </pre>
        </div>
      );
  }
}
