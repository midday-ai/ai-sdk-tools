# @ai-sdk-tools/artifacts

Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts that stream real-time updates from AI tools to React components.

## ✨ Features

- 🎯 **Type-Safe Streaming** - Full TypeScript support with Zod schema validation
- 🔄 **Real-time Updates** - Stream partial updates with progress tracking
- 🎨 **Clean API** - Minimal boilerplate, maximum flexibility
- 🏪 **State Management** - Built on @ai-sdk-tools/store for efficient message handling
- ⚡ **Performance Optimized** - Efficient state management and updates

## 📦 Installation

```bash
npm install @ai-sdk-tools/artifacts @ai-sdk-tools/store
```

**Why do you need both packages?**

- `@ai-sdk-tools/artifacts` - Provides the artifact streaming and management APIs
- `@ai-sdk-tools/store` - Required for message state management and React hooks

The artifacts package uses the store package's `useChatMessages` hook to efficiently extract and track artifact data from AI SDK message streams, ensuring optimal performance and avoiding unnecessary re-renders.

## 🔧 Setup

### 1. Initialize Chat with Store

```tsx
import { useChat } from '@ai-sdk-tools/store'; // Drop-in replacement for @ai-sdk/react
import { DefaultChatTransport } from 'ai';

function ChatComponent() {
  // Initialize chat (same API as @ai-sdk/react)
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    })
  });

  return (
    <div>
      {/* Your chat UI */}
      <ArtifactDisplay /> {/* Artifacts work from any component */}
    </div>
  );
}
```

### 2. Use Artifacts from Any Component

The `useArtifact` hook automatically connects to the global chat store to extract artifact data from message streams - no prop drilling needed!

## 🚀 Quick Start

### 1. Define an Artifact

```typescript
import { artifact } from '@ai-sdk-tools/artifacts';
import { z } from 'zod';

const BurnRate = artifact('burn-rate', z.object({
  title: z.string(),
  stage: z.enum(['loading', 'processing', 'complete']).default('loading'),
  data: z.array(z.object({
    month: z.string(),
    burnRate: z.number()
  })).default([])
}));
```

### 2. Create a Tool with Context

```typescript
// Use direct AI SDK tool format
const analyzeBurnRate = {
  description: 'Analyze company burn rate',
  inputSchema: z.object({
    company: z.string()
  }),
  execute: async ({ company }: { company: string }) => {
    // Access typed context in tools
    const context = getContext(); // Fully typed as MyContext
    
    console.log('Processing for user:', context.userId);
    console.log('Theme:', context.config.theme);
    
    const analysis = BurnRate.stream({
      title: `${company} Analysis for ${context.userId}`,
      stage: 'loading'
    });

    // Stream updates
    analysis.progress = 0.5;
    await analysis.update({ stage: 'processing' });
    
    // Complete
    await analysis.complete({
      title: `${company} Analysis`,
      stage: 'complete',
      data: [{ month: '2024-01', burnRate: 50000 }]
    });

    return 'Analysis complete';
  }
};
```

### 3. Set Up Route with Context

```typescript
import { createTypedContext, BaseContext } from '@ai-sdk-tools/artifacts';
import { createUIMessageStream, createUIMessageStreamResponse, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Define your context type
interface MyContext extends BaseContext {
  userId: string;
  permissions: string[];
  config: { theme: 'light' | 'dark' };
}

// Create typed context helpers
const { setContext, getContext } = createTypedContext<MyContext>();

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // Set typed context
      setContext({
        writer,
        userId: req.headers.get('user-id') || 'anonymous',
        permissions: ['read', 'write'],
        config: { theme: 'dark' }
      });

      const result = streamText({
        model: openai('gpt-4'),
        messages,
        tools: { analyzeBurnRate }
      });

      writer.merge(result.toUIMessageStream());
    }
  });

  return createUIMessageStreamResponse({ stream });
};
```

### 4. Consume in React

```tsx
import { useArtifact } from '@ai-sdk-tools/artifacts';

function Analysis() {
  const { data, status, progress } = useArtifact(BurnRate, {
    onComplete: (data) => console.log('Done!', data),
    onError: (error) => console.error('Failed:', error)
  });

  if (!data) return null;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>Stage: {data.stage}</p>
      {progress && <div>Progress: {progress * 100}%</div>}
      {data.data.map(item => (
        <div key={item.month}>
          {item.month}: ${item.burnRate.toLocaleString()}
        </div>
      ))}
    </div>
  );
}
```

## 📚 API Reference

### `artifact(id, schema)`
Creates an artifact definition with Zod schema validation.

### `useArtifact(artifact, callbacks?)`
React hook for consuming streaming artifacts.

**Returns:**
- `data` - Current artifact payload
- `status` - Current status ('idle' | 'loading' | 'streaming' | 'complete' | 'error')
- `progress` - Progress value (0-1)
- `error` - Error message if failed
- `isActive` - Whether artifact is currently processing
- `hasData` - Whether artifact has any data

**Callbacks:**
- `onUpdate(data, prevData)` - Called when data updates
- `onComplete(data)` - Called when artifact completes
- `onError(error, data)` - Called on error
- `onProgress(progress, data)` - Called on progress updates
- `onStatusChange(status, prevStatus)` - Called when status changes



## 🔧 Examples

See the `src/examples/` directory for complete examples including:
- Burn rate analysis with progress tracking
- React component integration
- Route setup and tool implementation

## 📄 License

MIT
