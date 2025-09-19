"use client";

import { useChatActions, useChatStatus } from "@ai-sdk-tools/store";
import { Plus, Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  placeholder?: string;
  onSubmit?: (input: string) => void;
}

export function ChatInput({ placeholder = "Ask anything", onSubmit }: ChatInputProps) {
  const [input, setInput] = useState("");
  const status = useChatStatus();
  const { sendMessage } = useChatActions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      if (onSubmit) {
        onSubmit(input);
      } else {
        sendMessage({ text: input });
      }
      setInput("");
    }
  };

  const isDisabled = status !== "ready";

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-1 relative">
          <button
            type="button"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <Plus className="h-4 w-4 text-gray-400" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isDisabled}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isDisabled || !input.trim()}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
