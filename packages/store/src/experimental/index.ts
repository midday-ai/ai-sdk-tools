// Experimental ultra-performant implementation
// This provides the same API as the standard hooks but with maximum performance optimizations

export type { UIMessage, UseChatHelpers } from "@ai-sdk/react";
// Provider (required)
// Standard hooks (same API as @ai-sdk/react)
// Performance hooks (experimental features)
// Advanced (for direct store access)
export { Provider, 
  type StoreState,
  useChatActions,
  useChatError,
  useChatId,
  useChatMessages,
  useChatStatus,
  useChatStore,
  useMessageById,      // O(1) message lookup
  useMessageCount,     // Optimized count
  useMessageIds,       // All message IDs
  useSelector,         // Memoized expensive computations
  useVirtualMessages,  // Message virtualization for large lists} from "./hooks";
// Enhanced useChat hook (drop-in replacement for @ai-sdk/react)
export {
  type UseChatOptionsWithPerformance as UseChatOptions,
  useChat,
} from "./use-chat";