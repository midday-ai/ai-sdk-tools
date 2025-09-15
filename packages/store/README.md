# @ai-sdk-tools/store

Drop-in replacement for `@ai-sdk/react` that gives you global state access to your AI chats. No prop drilling, better performance, simplified architecture.

## Why Use This?

**Problem**: Regular `useChat` traps state in one component. Need chat data elsewhere? Props everywhere.

**Solution**: Same `useChat` API + global Zustand store access from any component.

```bash
npm i @ai-sdk-tools/store
```

## Migration (30 seconds)

```tsx
// Before
import { useChat } from '@ai-sdk/react'

// After - ONLY CHANGE NEEDED
import { useChat } from '@ai-sdk-tools/store'
```

Everything else works exactly the same.

## Core Benefits

### 1. **Access Chat from Any Component**

```tsx
// ❌ Regular useChat - state trapped
function App() {
  const { messages, sendMessage } = useChat()
  return <Layout messages={messages} sendMessage={sendMessage} />
}

// ✅ @ai-sdk-tools/store - access anywhere
function App() {
  useChat({ api: '/api/chat' }) // Initialize once
  return <Layout />
}

function Layout() {
  const messages = useChatMessages() // Direct access!
  const sendMessage = useChatSendMessage()
  return <div>...</div>
}
```

### 2. **Optimized Re-renders**

```tsx
// ❌ Regular useChat - everything re-renders
function Chat() {
  const { messages, isLoading, error } = useChat()
  // Re-renders when ANY of these change
}

// ✅ @ai-sdk-tools/store - selective subscriptions  
function MessageCount() {
  const count = useChatMessageCount() // Only re-renders when count changes
}

function LoadingSpinner() {
  const status = useChatStatus() // Only re-renders when status changes
  return status === 'streaming' ? <Spinner /> : null
}
```

### 3. **Custom Types & Tool Calls**

```tsx
// Define custom message types
interface MyMessage extends UIMessage<
  { userId: string }, // metadata
  { weather: WeatherData }, // data  
  { getWeather: { input: { location: string }, output: WeatherData } } // tools
> {}

// Use with full typing
const chat = useChat<MyMessage>({ api: '/api/chat' })
const messages = useChatMessages<MyMessage>() // Fully typed!

// Custom selectors work too
const toolCallCount = useChatProperty(
  (state) => state.messages.filter(m => m.parts?.some(p => p.type.startsWith('tool-')))
)
```

### 4. **Custom Zustand Stores**

```tsx
import { createCustomChatStore } from '@ai-sdk-tools/store'
import { persist } from 'zustand/middleware'

// Custom store with persistence
const persistedStore = createCustomChatStore(
  persist(
    (set) => ({ /* your config */ }),
    { name: 'chat-storage' }
  )
)

function PersistentChat() {
  const chat = useChat({
    api: '/api/chat',
    store: persistedStore // Chat survives page refresh!
  })
}
```

## API

### Hooks

```tsx
// Main hook - same as @ai-sdk/react
const chat = useChat({ api: '/api/chat' })

// Store access - no parameters needed
const messages = useChatMessages()
const status = useChatStatus()
const sendMessage = useChatSendMessage()

// Custom store (advanced)
const chat = useChat({ store: myCustomStore })
```

### Selectors

```tsx
// Core selectors
useChatMessages()           // Message array
useChatStatus()             // Chat status ('ready' | 'streaming' | 'submitted' | 'error')
useChatError()              // Error state

// Additional
useChatSendMessage()        // Send function
useChatMessageCount()       // Message count
useChatId()                 // Chat ID
useChatActions()            // All actions object

// Custom selector (main pattern for advanced use)
useChatProperty(state => state.messages.filter(m => m.role === 'user'))
useChatProperty(state => state.status === 'streaming') // Use status instead of isLoading
```

### Custom Stores

```tsx
import { createCustomChatStore } from '@ai-sdk-tools/store'
import { devtools, persist } from 'zustand/middleware'

// With persistence
const persistedStore = createCustomChatStore(
  persist(
    (set) => ({ /* config */ }),
    { name: 'chat-history' }
  )
)

// With devtools
const debugStore = createCustomChatStore(
  devtools((set) => ({ /* config */ }))
)

// Use custom store
const chat = useChat({ store: persistedStore })
```

## Full TypeScript Support

```tsx
// Define custom message type with tools
interface MyMessage extends UIMessage<
  { userId: string }, // metadata
  { weather: WeatherData }, // data
  { getWeather: { input: { location: string }, output: WeatherData } } // tools
> {}

// Use with full typing
const chat = useChat<MyMessage>({ api: '/api/chat' })
const messages = useChatMessages<MyMessage>() // Fully typed!
```

## When to Use This vs Regular useChat

**Use @ai-sdk-tools/store when:**
- Multiple components need chat data
- Building complex chat UIs  
- Need performance optimization
- Want custom types with tool calls
- Want persistence or custom middleware

**Use regular useChat when:**
- Simple single-component chat
- No cross-component access needed

## Migration Benefits

- ✅ **Zero breaking changes** - same API
- ✅ **Better performance** - selective re-renders
- ✅ **No prop drilling** - access from anywhere
- ✅ **Simplified architecture** - single global store
- ✅ **Custom stores** - persistence, devtools, etc.
- ✅ **Full TypeScript** - same generic support
- ✅ **Tool call support** - custom types for AI tools

## License

MIT
