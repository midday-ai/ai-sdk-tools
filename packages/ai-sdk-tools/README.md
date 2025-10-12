# ai-sdk-tools

Complete toolkit for building advanced AI applications with the [Vercel AI SDK](https://sdk.vercel.ai/). This package provides everything you need: multi-agent orchestration, state management, caching, artifact streaming, development tools, and persistent memory.

## Installation

```bash
npm install ai-sdk-tools
```

This installs all tools in a single package with namespaced exports.

### Peer Dependencies

Depending on which features you use, you may need to install:

```bash
npm install ai @ai-sdk/react react react-dom zod zustand
```

## What's Included

This package includes all AI SDK tools:

- **`agents`** - Multi-agent orchestration with handoffs and routing
- **`artifacts`** - Structured artifact streaming for React components  
- **`cache`** - Universal caching for AI tool executions
- **`devtools`** - Development and debugging tools
- **`memory`** - Persistent memory system for AI agents
- **`store`** - Zustand-based state management for AI applications

## Usage

Import tools directly from the package:

```typescript
import { Agent, artifact, cached, useChat, AIDevtools, InMemoryProvider } from 'ai-sdk-tools';
```

### Multi-Agent Orchestration

Build intelligent workflows with specialized agents:

```typescript
import { Agent } from 'ai-sdk-tools';
import { openai } from '@ai-sdk/openai';

const supportAgent = new Agent({
  model: openai('gpt-4'),
  name: 'SupportAgent',
  instructions: 'You handle customer support queries.',
});

const billingAgent = new Agent({
  model: openai('gpt-4'),
  name: 'BillingAgent',
  instructions: 'You handle billing and payment issues.',
  handoff: [supportAgent], // Can hand off back to support
});

// Support agent can route to billing
supportAgent.handoff = [billingAgent];

const result = await supportAgent.generateText({
  prompt: 'I need help with my invoice',
});
```

### State Management

Manage chat state globally with Zustand:

```typescript
import { useChat } from 'ai-sdk-tools';

export const useChatHook = useChat({
  api: '/api/chat',
});

// Access chat state from anywhere
function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChatHook();
  
  return (
    <form onSubmit={handleSubmit}>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
    </form>
  );
}
```

### Tool Caching

Cache expensive tool executions to reduce costs and improve performance:

```typescript
import { cached } from 'ai-sdk-tools';
import { tool } from 'ai';
import { z } from 'zod';

const weatherTool = cached(
  tool({
    description: 'Get weather for a location',
    parameters: z.object({
      location: z.string(),
    }),
    execute: async ({ location }) => {
      // Expensive API call
      const response = await fetch(`https://api.weather.com/${location}`);
      return response.json();
    },
  }),
  { ttl: 3600 } // Cache for 1 hour
);
```

### Artifact Streaming

Stream structured artifacts from AI tools to React components:

```typescript
import { artifact, useArtifact } from 'ai-sdk-tools';
import { z } from 'zod';

const chartArtifact = artifact({
  id: 'chart',
  description: 'Generate a chart visualization',
  schema: z.object({
    data: z.array(z.number()),
    title: z.string(),
  }),
  execute: async ({ data, title }, writer) => {
    // Stream progressive updates
    await writer.update({ status: 'processing', progress: 50 });
    
    const chartData = processData(data);
    
    return {
      type: 'chart',
      data: chartData,
      title,
    };
  },
});

// In your React component
const { data, status } = useArtifact(chartArtifact);
```

### Development Tools

Debug and monitor your AI applications in real-time:

```typescript
import { AIDevtools } from 'ai-sdk-tools';

function App() {
  return (
    <>
      <YourChatComponent />
      <AIDevtools />
    </>
  );
}
```

### Persistent Memory

Add long-term memory to your agents:

```typescript
import { Agent, InMemoryProvider } from 'ai-sdk-tools';
import { openai } from '@ai-sdk/openai';

const memoryProvider = new InMemoryProvider();

const agent = new Agent({
  model: openai('gpt-4'),
  name: 'AssistantAgent',
  instructions: 'You are a helpful assistant with memory.',
  memory: memoryProvider,
});

// Agent can now remember context across conversations
```

## Individual Packages

If you only need specific tools, you can install them individually:

```bash
npm install @ai-sdk-tools/agents
npm install @ai-sdk-tools/artifacts
npm install @ai-sdk-tools/cache
npm install @ai-sdk-tools/devtools
npm install @ai-sdk-tools/memory
npm install @ai-sdk-tools/store
```

Each package can be used independently with its own API. See individual package documentation for details.

## Documentation

- [Full Documentation](https://aisdk.tools)
- [API Reference](https://aisdk.tools/docs)
- [Examples](https://github.com/midday-ai/ai-sdk-tools/tree/main/apps/example)

## Features

✅ **Multi-agent orchestration** - Coordinate multiple specialized agents  
✅ **State management** - Global state for AI applications  
✅ **Universal caching** - Cache any tool execution  
✅ **Artifact streaming** - Structured real-time updates  
✅ **Development tools** - Debug and monitor AI apps  
✅ **Persistent memory** - Long-term agent memory  
✅ **TypeScript first** - Full type safety throughout  
✅ **Provider agnostic** - Works with any AI SDK provider  
✅ **Production ready** - Battle-tested in real applications  

## Requirements

- Node.js 18+
- AI SDK v5.0.0 or higher
- React 18+ (for React-specific features)

## License

MIT © [Midday](https://midday.ai)

## Links

- [GitHub](https://github.com/midday-ai/ai-sdk-tools)
- [Issues](https://github.com/midday-ai/ai-sdk-tools/issues)
- [Discussions](https://github.com/midday-ai/ai-sdk-tools/discussions)

