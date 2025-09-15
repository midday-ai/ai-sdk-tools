'use client';

import { useChatStatus, useChatError, useChatMessageCount } from '@ai-sdk-tools/store';

interface StatusIndicatorProps {
  showMessageCount?: boolean;
}

export function StatusIndicator({ showMessageCount = true }: StatusIndicatorProps) {
  const status = useChatStatus();
  const error = useChatError();
  const messageCount = useChatMessageCount();

  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return 'bg-green-500';
      case 'submitted':
        return 'bg-yellow-500';
      case 'streaming':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'submitted':
        return 'Processing...';
      case 'streaming':
        return 'Streaming...';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span>{getStatusText()}</span>
      </div>
      
      {showMessageCount && (
        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
          {messageCount} messages
        </div>
      )}
      
      {error && (
        <div className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded border border-red-200">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
