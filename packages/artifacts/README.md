# @ai-sdk-tools/artifacts

Advanced streaming interfaces for AI applications. Create structured, type-safe artifacts that stream real-time updates from AI tools to React components.

## Features

- **Type-Safe Streaming** - Full TypeScript support with Zod schema validation
- **Real-time Updates** - Stream partial updates with progress tracking
- **Clean API** - Minimal boilerplate, maximum flexibility
- **State Management** - Built on @ai-sdk-tools/store for efficient message handling
- **Performance Optimized** - Efficient state management and updates

## Installation

```bash
npm install @ai-sdk-tools/artifacts @ai-sdk-tools/store
```

**Why do you need both packages?**

- `@ai-sdk-tools/artifacts` - Provides the artifact streaming and management APIs
- `@ai-sdk-tools/store` - Required for message state management and React hooks

The artifacts package uses the store package's `useChatMessages` hook to efficiently extract and track artifact data from AI SDK message streams, ensuring optimal performance and avoiding unnecessary re-renders.

## Setup

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

## Quick Start

### 1. Define an Artifact

```typescript
import { artifact } from '@ai-sdk-tools/artifacts';
import { z } from 'zod';

const burnRateArtifact = artifact('burn-rate', z.object({
  title: z.string(),
  stage: z.enum(['loading', 'processing', 'complete']).default('loading'),
  monthlyBurn: z.number(),
  runway: z.number(),
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
    
    const analysis = burnRateArtifact.stream({
      title: `${company} Analysis for ${context.userId}`,
      stage: 'loading',
      monthlyBurn: 50000,
      runway: 12
    });

    // Stream updates
    analysis.progress = 0.5;
    await analysis.update({ stage: 'processing' });
    
    // Complete
    await analysis.complete({
      title: `${company} Analysis`,
      stage: 'complete',
      monthlyBurn: 45000,
      runway: 14,
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
import { useArtifact } from '@ai-sdk-tools/artifacts/client';

function Analysis() {
  const { data, status, progress, error } = useArtifact(burnRateArtifact, {
    onComplete: (data) => console.log('Done!', data),
    onError: (error) => console.error('Failed:', error)
  });

  if (!data) return null;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>Stage: {data.stage}</p>
      <p>Monthly Burn: ${data.monthlyBurn.toLocaleString()}</p>
      <p>Runway: {data.runway} months</p>
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

## API Reference

### `artifact(id, schema)`
Creates an artifact definition with Zod schema validation.

### `useArtifact(artifact, callbacks?)`
React hook for consuming a specific streaming artifact.

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

### `useArtifacts(options?)`
React hook for listening to all artifacts across all types. Perfect for implementing switch cases to render different artifact types.

**Options:**
- `onData(artifactType, data)` - Callback fired when any artifact updates
- `storeId` - Optional store ID (defaults to global store)

**Returns:**
- `byType` - All artifacts grouped by type: `Record<string, ArtifactData[]>`
- `latest` - Latest version of each artifact type: `Record<string, ArtifactData>`
- `artifacts` - All artifacts in chronological order: `ArtifactData[]`
- `current` - Most recent artifact across all types: `ArtifactData | null`

**Example:**
```tsx
import { useArtifacts } from '@ai-sdk-tools/artifacts/client';

function ArtifactRenderer() {
  const { latest } = useArtifacts({
    onData: (artifactType, data) => {
      console.log(`New ${artifactType} artifact:`, data);
    }
  });

  return (
    <div>
      {Object.entries(latest).map(([type, artifact]) => {
        switch (type) {
          case 'burn-rate':
            return <BurnRateComponent key={type} data={artifact} />;
          case 'financial-report':
            return <ReportComponent key={type} data={artifact} />;
          default:
            return <GenericComponent key={type} type={type} data={artifact} />;
        }
      })}
    </div>
  );
}

// Perfect for Canvas-style switching on current artifact
function Canvas() {
  const { current } = useArtifacts();

  switch (current?.type) {
    case "burn-rate-canvas":
      return <BurnRateCanvas />;
    case "revenue-canvas":
      return <RevenueCanvas />;
    default:
      return <DefaultCanvas />;
  }
}
```



## Advanced Usage

### Combining Both Hooks

You can use both hooks together for different purposes:

```tsx
import { useArtifact, useArtifacts } from '@ai-sdk-tools/artifacts/client';

function DashboardWithAnalysis() {
  // Listen to all artifacts for notifications/logging
  useArtifacts({
    onData: (artifactType, data) => {
      // Send to analytics
      analytics.track('artifact_updated', { type: artifactType, status: data.status });
      
      // Show notifications
      if (data.status === 'complete') {
        toast.success(`${artifactType} analysis complete!`);
      }
    }
  });

  // Use specific artifact for detailed display
  const { data: burnRateData, status } = useArtifact(burnRateArtifact);

  // Get latest of all types for overview
  const { latest } = useArtifacts();

  return (
    <div>
      {/* Overview of all artifacts */}
      <div className="overview">
        {Object.entries(latest).map(([type, artifact]) => (
          <div key={type} className="artifact-card">
            <h3>{type}</h3>
            <span className={`status ${artifact.status}`}>
              {artifact.status}
            </span>
          </div>
        ))}
      </div>

      {/* Detailed burn rate display */}
      {burnRateData && (
        <BurnRateChart data={burnRateData} status={status} />
      )}
    </div>
  );
}
```

### Hook Selection Guide

**Use `useArtifact`** when:
- You need to display/work with a specific artifact type
- You want detailed status, progress, and error handling
- You need type-safe access to the artifact's payload

**Use `useArtifacts`** when:
- You want to render different artifact types with switch cases
- You need to listen to all artifacts for logging/analytics
- You want to show an overview of all available artifacts
- You're building a generic artifact renderer

## Examples

See the `src/examples/` directory for complete examples including:
- Burn rate analysis with progress tracking
- React component integration  
- Route setup and tool implementation
- Using `useArtifacts` for multi-type artifact rendering

## Contributing

Contributions are welcome! See the [contributing guide](../../CONTRIBUTING.md) for details.

## License

MIT
