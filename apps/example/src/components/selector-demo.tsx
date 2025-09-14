'use client';

import {
  useChatStatus,
   useChatError,
  useChatProperty,
 } from 'ai-sdk-zustand';
import type { CustomUIMessage } from '../types/custom-message';

interface SelectorDemoProps {}

export function SelectorDemo({}: SelectorDemoProps) {
  // Core selectors
   const status = useChatStatus();
   const error = useChatError();

  // Custom selectors using useChatProperty - this is the main pattern
  const messageCount = useChatProperty<CustomUIMessage, number>(
    (state) => state.messages.length
  );

  const latestMessage = useChatProperty<CustomUIMessage, CustomUIMessage | undefined>(
    (state) => state.messages.length > 0 ? state.messages[state.messages.length - 1] : undefined
  );

  const userMessages = useChatProperty<CustomUIMessage, CustomUIMessage[]>(
    (state) => state.messages.filter((msg) => msg.role === 'user')
  );

  const assistantMessages = useChatProperty<CustomUIMessage, CustomUIMessage[]>(
    (state) => state.messages.filter((msg) => msg.role === 'assistant')
  );

  const toolCallCount = useChatProperty<CustomUIMessage, number>(
    (state) => {
      return state.messages.reduce((count, message) => {
        const toolCalls = message.parts?.filter(part => part.type.startsWith('tool-')) || [];
        return count + toolCalls.length;
      }, 0);
    }
  );

  const messagesWithMetadata = useChatProperty<CustomUIMessage, CustomUIMessage[]>(
    (state) => state.messages.filter(message => 
      message.metadata && 
      typeof message.metadata === 'object' && 
      Object.keys(message.metadata).length > 0
    )
  );

  return (
    <div className="bg-black text-white font-mono text-sm rounded-lg overflow-hidden border border-gray-800">
      {/* Terminal Header */}
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-400 text-xs ml-2">ai-sdk-zustand@latest selector-demo</div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 space-y-4">
        <div>
          <span className="text-gray-500">$</span> <span className="text-white">npx ai-sdk-zustand@latest demo</span>
        </div>

        {/* Stats Output */}
        <div className="space-y-1">
          <div className="text-gray-400">◇ Chat Statistics</div>
          <div className="ml-2 space-y-0.5">
            <div>│ Status: <span className="text-green-400">{status}</span></div>
            <div>│ Messages: <span className="text-blue-400">{messageCount}</span></div>
            <div>│ User: <span className="text-cyan-400">{userMessages.length}</span></div>
            <div>│ Assistant: <span className="text-purple-400">{assistantMessages.length}</span></div>
            <div>│ Loading: <span className={status === "streaming" ? "text-yellow-400" : "text-gray-400"}>{status === "streaming" ? "●" : "○"}</span></div>
            <div>│ Tool Calls: <span className="text-orange-400">{toolCallCount}</span></div>
          </div>
          <div className="text-gray-400">└ Analysis complete</div>
        </div>

        {/* Latest Message */}
        {latestMessage && (
          <div className="space-y-1">
            <div className="text-gray-400">◇ Latest Message</div>
            <div className="ml-2 space-y-0.5">
              <div>│ Role: <span className="text-green-400">{latestMessage.role}</span></div>
              <div>│ Parts: <span className="text-blue-400">{latestMessage.parts?.length || 0}</span></div>
              <div>│ Metadata: <span className={latestMessage.metadata && typeof latestMessage.metadata === 'object' && Object.keys(latestMessage.metadata).length > 0 ? "text-green-400" : "text-gray-400"}>
                {latestMessage.metadata && typeof latestMessage.metadata === 'object' && Object.keys(latestMessage.metadata).length > 0 ? "✓" : "✗"}
              </span></div>
            </div>
            <div className="text-gray-400">└ Message analyzed</div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="space-y-1">
            <div className="text-red-400">✘ Error detected</div>
            <div className="ml-2 text-red-300">│ {error.message}</div>
            <div className="text-red-400">└ Check your configuration</div>
          </div>
        )}

        {/* Custom Metadata */}
        {messagesWithMetadata.length > 0 && (
          <div className="space-y-1">
            <div className="text-gray-400">◇ Messages with Metadata ({messagesWithMetadata.length})</div>
            <div className="ml-2 max-h-32 overflow-y-auto space-y-1">
              {messagesWithMetadata.slice(0, 3).map((message, index) => (
                <div key={message.id}>
                  <div>│ {index + 1}. <span className="text-cyan-400">{message.role}</span> message</div>
                  <div className="text-gray-500 text-xs ml-2">│   {Object.keys(message.metadata || {}).join(', ')}</div>
                </div>
              ))}
              {messagesWithMetadata.length > 3 && (
                <div className="text-gray-500">│ ... and {messagesWithMetadata.length - 3} more</div>
              )}
            </div>
            <div className="text-gray-400">└ Metadata indexed</div>
          </div>
        )}

        {/* Usage Examples */}
        <div className="space-y-1">
          <div className="text-gray-400">◇ Usage Examples</div>
          <div className="ml-2 space-y-1">
            <div className="text-gray-500">│ Core selectors:</div>
            <div className="ml-2 text-xs space-y-0.5 text-gray-300">
              <div>│ <span className="text-blue-400">const</span> messages = <span className="text-yellow-400">useChatMessages</span>()</div>
              <div>│ <span className="text-blue-400">const</span> status = <span className="text-yellow-400">useChatStatus</span>()</div>
              <div>│ <span className="text-blue-400">const</span> isLoading = <span className="text-yellow-400">useChatIsLoading</span>()</div>
            </div>
            <div className="text-gray-500">│ Custom selectors:</div>
            <div className="ml-2 text-xs text-gray-300">
              <div>│ <span className="text-blue-400">const</span> count = <span className="text-yellow-400">useChatProperty</span>(state =&gt; state.messages.length)</div>
            </div>
          </div>
          <div className="text-gray-400">└ Examples ready for copy-paste</div>
        </div>

        <div>
          <span className="text-gray-500">$</span> <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}
