import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import { useChat as useOriginalChat, type UseChatOptions, type UseChatHelpers, type UIMessage } from '@ai-sdk/react'
import { getChatStore, type ChatStore } from './store'

export type { UseChatOptions, UseChatHelpers }

// Type for a compatible Zustand store
export interface CompatibleChatStore<TMessage extends UIMessage = UIMessage> {
  <T>(selector: (state: ChatStore<TMessage>) => T): T
  setState?: (partial: Partial<ChatStore<TMessage>>) => void
  _syncState?: (partial: Partial<ChatStore<TMessage>>) => void
}

export type UseChatOptionsWithStore<TMessage extends UIMessage = UIMessage> = UseChatOptions<TMessage> & {
  storeId?: string
  store?: CompatibleChatStore<TMessage>
}

export function useChat<TMessage extends UIMessage = UIMessage>(
  options: UseChatOptionsWithStore<TMessage> = {} as UseChatOptionsWithStore<TMessage>
): UseChatHelpers<TMessage> {
  const { storeId = 'default', store: customStore, ...originalOptions } = options
  const chatHelpers = useOriginalChat<TMessage>(originalOptions)
  
  // Use custom store if provided, otherwise get/create default store
  const store = customStore || getChatStore(storeId)
  const storeRef = useRef<CompatibleChatStore<TMessage>>(store)
  
  useEffect(() => {
    if (!storeRef.current) return
    
    const chatState = {
      id: chatHelpers.id,
      messages: chatHelpers.messages,
      error: chatHelpers.error,
      status: chatHelpers.status,
      sendMessage: chatHelpers.sendMessage,
      regenerate: chatHelpers.regenerate,
      stop: chatHelpers.stop,
      resumeStream: chatHelpers.resumeStream,
      addToolResult: chatHelpers.addToolResult,
      setMessages: chatHelpers.setMessages,
      clearError: chatHelpers.clearError,
    }
    
    // Check if store has _syncState method (our internal stores)
    if (typeof storeRef.current._syncState === 'function') {
      storeRef.current._syncState(chatState)
    } else if (typeof storeRef.current.setState === 'function') {
      // For standard Zustand stores
      storeRef.current.setState(chatState)
    }
  }, [
    chatHelpers.id,
    chatHelpers.messages,
    chatHelpers.error,
    chatHelpers.status,
    chatHelpers.sendMessage,
    chatHelpers.regenerate,
    chatHelpers.stop,
    chatHelpers.resumeStream,
    chatHelpers.addToolResult,
    chatHelpers.setMessages,
    chatHelpers.clearError,
  ])
  
  return chatHelpers
}

export function useChatStore<TMessage extends UIMessage = UIMessage, T = any>(
  selector: (state: ChatStore<TMessage>) => T,
  storeId: string = 'default'
): T {
  const store = getChatStore(storeId)
 
  return store(useShallow(selector))
}

export function useChatStoreState<TMessage extends UIMessage = UIMessage>(
  storeId: string = 'default'
): ChatStore<TMessage> {
  return useChatStore<TMessage>((state) => state, storeId)
}

export function useChatActions<TMessage extends UIMessage = UIMessage>(storeId: string = 'default') {
  return useChatStore<TMessage>(
    (state) => ({
      sendMessage: state.sendMessage,
      regenerate: state.regenerate,
      stop: state.stop,
      resumeStream: state.resumeStream,
      addToolResult: state.addToolResult,
      setMessages: state.setMessages,
      clearError: state.clearError,
    }),
    storeId
  )
}
