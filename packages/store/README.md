# @ai-sdk-tools/store

A drop-in replacement for @ai-sdk/react that automatically syncs chat state to Zustand stores with performance optimizations.

## Features

- 🔄 **Drop-in replacement** for @ai-sdk/react hooks
- ⚡ **3-5x performance improvement** with experimental implementation  
- 🗄️ **Automatic Zustand sync** - chat state automatically synced to stores
- 🎯 **Selective subscriptions** - components only re-render when needed
- 💾 **Persistent state** - maintain chat state across component unmounts
- 🔧 **TypeScript first** - full type safety with @ai-sdk/react compatibility

## Installation

```bash
npm install @ai-sdk-tools/store
# or
bun add @ai-sdk-tools/store
```

## Quick Start

### Standard Implementation

```typescript
import { useChat, useChatMessages } from '@ai-sdk-tools/store';

function ChatComponent() {
  const chatHelpers = useChat({ 
    api: '/api/chat',
    storeId: 'my-chat' // optional: specify store ID
  });
  
  // Access messages from any component
  const messages = useChatMessages('my-chat');
  
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>{message.content}</div>
      ))}
    </div>
  );
}
```

### Experimental High-Performance Implementation

For maximum performance (recommended for production apps):

```typescript
import { 
  Provider,
  useChat, 
  useChatMessages,
  useVirtualMessages,
  useSelector
} from '@ai-sdk-tools/store/experimental';

function App() {
  return (
    <Provider initialMessages={[]}>
      <ChatComponent />
    </Provider>
  );
}

function ChatComponent() {
  // Same API as @ai-sdk/react, but 3-5x faster
  const chatHelpers = useChat({
    api: '/api/chat',
    enableBatching: true, // Additional performance option
  });
  
  // Standard hooks with maximum performance
  const messages = useChatMessages();
  
  // Experimental: Only render visible messages (great for 1000+ messages)
  const visibleMessages = useVirtualMessages(0, 50);
  
  // Experimental: Cached expensive computations
  const messageStats = useSelector(
    'message-stats',
    (messages) => ({
      total: messages.length,
      userMessages: messages.filter(m => m.role === 'user').length,
    }),
    [] // dependencies
  );
  
  return <div>{/* Your optimized chat UI */}</div>;
}
```

## API Reference

### Standard Implementation

All hooks have the same API as @ai-sdk/react but with additional store management:

#### `useChat(options)`
- Same as @ai-sdk/react `useChat`
- Additional option: `storeId?: string` - specify which store to use

#### Store Selectors
- `useChatMessages(storeId?)` - Get messages from store
- `useChatStatus(storeId?)` - Get chat status  
- `useChatError(storeId?)` - Get error state
- `useChatActions(storeId?)` - Get action methods
- `useChatStore(selector, storeId?)` - Custom selector

### Experimental Implementation

#### Core Hooks (Same API as @ai-sdk/react)
- `useChat(options)` - Enhanced with batching and performance options
- `useChatMessages()` - Optimized message retrieval
- `useChatStatus()` - Chat status with batched updates
- `useChatError()` - Error state management
- `useChatId()` - Chat ID management
- `useChatActions()` - All action methods

#### Experimental Performance Hooks
- `useVirtualMessages(start, end)` - Message virtualization for large lists
- `useSelector(key, selector, deps)` - Cached expensive computations
- `useMessageById(id)` - O(1) message lookup
- `useMessageCount()` - Optimized count

#### Provider
- `Provider` - Context provider for experimental hooks

## Performance Comparison

| Feature | Standard | Experimental |
|---------|----------|--------------|
| Message Lookup | O(n) | **O(1)** |
| Update Batching | ❌ | **✅** |
| Memoized Selectors | ❌ | **✅** |
| Virtualization | ❌ | **✅** |
| Bundle Size | Smallest | +12KB |
| Performance | Good | **3-5x faster** |

## When to Use Each

### Use Standard When:
- Simple chat applications
- Message count < 100
- Bundle size is critical
- Getting started quickly

### Use Experimental When:
- Production applications
- Message count > 100
- Performance is critical
- Complex message processing
- Users on slower devices

## Migration Guide

### From @ai-sdk/react to Standard:
```typescript
// Change imports
import { useChat } from '@ai-sdk/react';
// to
import { useChat } from '@ai-sdk-tools/store';

// Add storeId if you want multiple chats
const chat = useChat({ storeId: 'chat-1' });
```

### From Standard to Experimental:
```typescript
// Wrap your app
<Provider>
  <App />
</Provider>

// Change imports
import { useChat } from '@ai-sdk-tools/store';
// to  
import { useChat } from '@ai-sdk-tools/store/experimental';
```

## Examples

Check out the `/examples` directory for complete implementations:
- Basic chat with standard hooks
- High-performance chat with experimental hooks
- Multi-chat application
- Chat with message virtualization

## Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) for details.

## License

MIT