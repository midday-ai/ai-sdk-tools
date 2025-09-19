"use client";

import { useChatMessages, useChatStatus } from "@ai-sdk-tools/store";

interface MessageListProps {
  hasData: boolean;
  welcomeComponent?: React.ReactNode;
}

export function MessageList({ hasData, welcomeComponent }: MessageListProps) {
  const messages = useChatMessages();
  const status = useChatStatus();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !hasData && welcomeComponent}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.role === "user"
              ? "bg-blue-50 dark:bg-blue-900/20 ml-8"
              : "bg-gray-50 dark:bg-gray-800 mr-8"
          }`}
        >
          <div className="font-medium text-sm mb-2">
            {message.role === "user" ? "You" : "AI Assistant"}
          </div>
          <div className="space-y-2">
            {message.parts.map((part, partIndex) => {
              if (part.type === "text") {
                return (
                  <span key={`${message.id}-part-${partIndex}`}>
                    {part.text}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}

      {/* Status indicator */}
      {status !== "ready" && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {status === "streaming" && "AI is thinking..."}
          {status === "submitted" && "Processing..."}
        </div>
      )}
    </div>
  );
}
