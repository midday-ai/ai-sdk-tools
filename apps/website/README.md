# AI SDK Zustand Example

This example demonstrates the full capabilities of `@ai-sdk-tools/store`, showing how to:

- ✅ **Split components** for better organization and performance
- ✅ **Use custom message types** with tool calls, data parts, and metadata
- ✅ **Handle multiple chat instances** with different configurations
- ✅ **Leverage selective selectors** for optimized re-renders
- ✅ **Implement tool calls** with weather, calculator, and search tools
- ✅ **Work with custom data** and metadata in messages

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # API route with tool calls
│   ├── layout.tsx             # App layout
│   └── page.tsx               # Main demo page
├── components/
│   ├── chat.tsx               # Main chat component
│   ├── message-list.tsx       # Message display component
│   ├── message-input.tsx      # Message input component
│   ├── status-indicator.tsx   # Status display component
│   ├── multi-chat-demo.tsx    # Multiple chat instances demo
│   └── selector-demo.tsx      # Selector usage demo
└── types/
    ├── custom-message.ts      # Custom message type definitions
    └── type-tests.ts          # TypeScript compilation tests
```

## 🎯 Key Features Demonstrated

### 1. Split Components

The chat functionality is split into focused, reusable components:

```tsx
// Main chat component orchestrates everything
<Chat />

// Individual components handle specific concerns
<MessageList />        // Display messages with custom types
<MessageInput />       // Input with metadata support
<StatusIndicator />    // Real-time status display
```

**Benefits:**
- Better performance (selective re-renders)
- Easier testing and maintenance
- Reusable across different chat instances

### 2. Custom Message Types

Full TypeScript support for custom message structures:

```tsx
// Define custom types
interface CustomUIMessage extends UIMessage<
  UserMetadata,  // metadata type
  AnalyticsData, // data type  
  AllTools       // tools type
> {}

// Use with hooks
const chat = useChat<CustomUIMessage>({ api: '/api/chat' });
const messages = useChatMessages<CustomUIMessage>();
```

**Supported Custom Types:**
- **Metadata**: User info, session data, timestamps
- **Data**: Analytics, custom payloads, structured data
- **Tools**: Weather API, calculator, search functionality

### 3. Tool Calls Implementation

Three working tools demonstrate different patterns:

```tsx
// Weather Tool
getWeather: tool({
  description: 'Get current weather information',
  parameters: z.object({
    location: z.string().describe('The location to get weather for'),
  }),
  execute: async ({ location }) => {
    // Mock weather API call
    return mockWeatherData[location.toLowerCase()];
  },
})

// Calculator Tool  
calculate: tool({
  description: 'Perform mathematical calculations',
  parameters: z.object({
    expression: z.string().describe('Mathematical expression to evaluate'),
  }),
  execute: async ({ expression }) => {
    // Safe expression evaluation
    return { result: eval(sanitizedExpression), expression };
  },
})

// Search Tool
search: tool({
  description: 'Search for information',
  parameters: z.object({
    query: z.string().describe('Search query'),
    limit: z.number().optional().describe('Max results (default: 3)'),
  }),
  execute: async ({ query, limit = 3 }) => {
    // Mock search results
    return { results: mockResults.slice(0, limit) };
  },
})
```

### 4. Multiple Chat Instances

Different chat instances with specialized types:

```tsx
// Weather-focused chat
useChat<WeatherMessage>({
  api: '/api/chat',
  storeId: 'weather-chat',
});

// Calculator-focused chat  
useChat<CalculatorMessage>({
  api: '/api/chat',
  storeId: 'calculator-chat',
});

// Access from any component
const weatherMessages = useChatMessages<WeatherMessage>('weather-chat');
const calculatorMessages = useChatMessages<CalculatorMessage>('calculator-chat');
```

### 5. Selective Selectors

Optimized selectors prevent unnecessary re-renders:

```tsx
// Only re-renders when message count changes
const messageCount = useChatMessageCount();

// Only re-renders when loading state changes
const isLoading = useChatIsLoading();

// Custom selector - only re-renders when tool calls change
const toolCallCount = useChatProperty(
  (state) => state.messages.reduce((count, message) => {
    const toolCalls = message.parts?.filter(part => part.type.startsWith('tool-')) || [];
    return count + toolCalls.length;
  }, 0)
);
```

## 🧪 Type Safety Verification

The `type-tests.ts` file contains compilation tests that verify:

- ✅ Custom message types extend UIMessage correctly
- ✅ Hook types are compatible with custom message types  
- ✅ Tool call types are properly defined
- ✅ Data and metadata types are enforced
- ✅ Message part types work with type guards
- ✅ All generic type parameters flow through correctly

If the TypeScript compilation succeeds, all types are working correctly!

## 🎨 UI Features

- **Modern, responsive design** with Tailwind CSS
- **Real-time status indicators** showing chat state
- **Tool call visualization** with different colors for different tools
- **Metadata display** with collapsible details
- **Error handling** with user-friendly messages
- **Loading states** and disabled states during processing

## 📝 Try These Examples

1. **Weather queries**: "What's the weather in New York?"
2. **Calculations**: "Calculate 15 * 23 + 7"
3. **Search**: "Search for React hooks"
4. **Complex**: "What's the weather in Tokyo and calculate the temperature in Fahrenheit?"

## 🔧 Migration from @ai-sdk/react

To use this in your own project, simply:

```tsx
// Before
import { useChat } from '@ai-sdk/react'

// After - ONLY CHANGE NEEDED
import { useChat } from '@ai-sdk-tools/store'
```

Everything else works exactly the same, but now you get:
- Global state access from any component
- Better performance with selective re-renders
- Multiple chat instance support
- Custom store integration capabilities

## 📚 API Reference

### Hooks
- `useChat<T>()` - Main chat hook with custom types
- `useChatMessages<T>(storeId?)` - Get messages array
- `useChatSendMessage(storeId?)` - Get send function
- `useChatStatus(storeId?)` - Get chat status
- `useChatIsLoading(storeId?)` - Get loading state
- `useChatError(storeId?)` - Get error state
- `useChatProperty<T, R>(selector, storeId?)` - Custom selector

### Types
- `CustomUIMessage` - Main custom message type
- `WeatherMessage` - Weather-specific message type  
- `CalculatorMessage` - Calculator-specific message type
- `UserMetadata` - User metadata type
- `AnalyticsData` - Analytics data type
- `AllTools` - Combined tool definitions

### Components
- `<MessageList />` - Display messages with custom rendering
- `<MessageInput />` - Input with metadata support
- `<StatusIndicator />` - Real-time status display
- `<MultiChatDemo />` - Multiple chat instances
- `<SelectorDemo />` - Selector usage examples

## 🚀 Performance Benefits

- **Selective subscriptions**: Components only re-render when their specific data changes
- **Split components**: Smaller, focused components with optimized renders
- **Global state**: No prop drilling, direct access from any component
- **Multiple instances**: Efficient handling of multiple chat sessions
- **Custom selectors**: Fine-grained control over what triggers re-renders

This example shows the full power of `@ai-sdk-tools/store` - a drop-in replacement for `@ai-sdk/react` that gives you global state management with zero breaking changes!