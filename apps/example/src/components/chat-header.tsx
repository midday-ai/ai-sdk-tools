"use client";

import { ArrowLeft, MoreHorizontal } from "lucide-react";

interface ChatHeaderProps {
  hasData: boolean;
  onBackClick: () => void;
  title?: string;
}

export function ChatHeader({ hasData, onBackClick, title }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        {hasData && (
          <button
            type="button"
            onClick={onBackClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title || (hasData ? "Burn Rate Analysis" : "AI Burn Rate Analyzer")}
        </h1>
      </div>
      <button
        type="button"
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
}
