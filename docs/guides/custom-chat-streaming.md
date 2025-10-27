# Custom Chat Streaming Guide

Complete guide to implementing custom chat streaming with real-time updates.

## Overview

AI SDK Tools provides built-in streaming support for:
- Text responses (token-by-token)
- Structured data (object streaming)
- Tool calls (real-time execution)
- Artifacts (progressive updates)

## Basic Text Streaming

### Server-Side Streaming

**File**: `app/api/chat/route.ts`

```typescript
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4'),
    messages,
    // Streaming automatically enabled
  })

  return result.toAIStreamResponse()
}
```

### Client-Side Integration

**Using AI SDK Tools Store**:

```typescript
"use client"

import { useChat } from "@ai-sdk-tools/store"

export function ChatComponent() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      {/* Display messages with streaming */}
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}:</strong>
          <span>{message.content}</span>
        </div>
      ))}

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  )
}
```

## Streaming Structured Data

### Object Streaming

Stream complex objects with partial updates:

**Server**:
```typescript
import { streamObject } from 'ai'
import { z } from 'zod'

const schema = z.object({
  title: z.string(),
  items: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })),
  total: z.number(),
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await streamObject({
    model: openai('gpt-4'),
    schema,
    prompt,
    // Receives partial objects as they're generated
  })

  return result.toTextStreamResponse()
}
```

**Client**:
```typescript
"use client"

import { experimental_useObject as useObject } from 'ai/react'

export function ObjectStreamingComponent() {
  const { object, submit, isLoading } = useObject({
    api: '/api/generate-object',
    schema,
  })

  // `object` updates as partial data arrives
  return (
    <div>
      {object?.title && <h2>{object.title}</h2>}

      {object?.items?.map((item, i) => (
        <div key={i}>
          {item.name}: {item.value}
        </div>
      ))}

      {object?.total && (
        <div>Total: {object.total}</div>
      )}

      <button onClick={() => submit({ prompt: "Generate data" })}>
        Generate
      </button>
    </div>
  )
}
```

## Artifact Streaming

### Progressive Dashboard Updates

Stream dashboards that update as data is calculated:

**Server**:
```typescript
import { streamObject } from 'ai'
import { RevenueArtifact } from '@/ai/artifacts/revenue'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await streamObject({
    model: openai('gpt-4'),
    schema: RevenueArtifact,
    prompt,
    onUpdate: ({ partial }) => {
      // Log progress
      console.log('Stage:', partial.stage)
      console.log('Progress:', partial.progress)
    }
  })

  return result.toTextStreamResponse()
}
```

**Client**:
```typescript
"use client"

import { useArtifact } from "ai-sdk-tools/client"
import { RevenueArtifact } from "@/ai/artifacts/revenue"

export function RevenueCanvas() {
  const artifact = useArtifact(RevenueArtifact)

  // artifact.data updates progressively as stream arrives
  if (!artifact.data) {
    return <div>Initializing...</div>
  }

  const isStreaming = artifact.data.stage !== "complete"

  return (
    <div>
      {/* Show partial data immediately */}
      <h2>{artifact.data.title || "Loading..."}</h2>

      {/* Progress indicator */}
      {isStreaming && (
        <ProgressBar value={artifact.data.progress || 0} />
      )}

      {/* Display available data as it arrives */}
      {artifact.data.data?.totalRevenue && (
        <div>Revenue: ${artifact.data.data.totalRevenue}</div>
      )}
    </div>
  )
}
```

## Tool Call Streaming

### Real-time Tool Execution

Display tool calls as they execute:

**Server**:
```typescript
import { streamText, tool } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4'),
    messages,
    tools: {
      getWeather: tool({
        description: 'Get weather for location',
        parameters: z.object({
          location: z.string(),
        }),
        execute: async ({ location }) => {
          // Simulated API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          return {
            temperature: 72,
            condition: 'sunny',
            location,
          }
        },
      }),
    },
  })

  return result.toAIStreamResponse()
}
```

**Client**:
```typescript
"use client"

import { useChat } from "@ai-sdk-tools/store"
import { ToolCall } from "@/components/ai-elements/tool"

export function ChatWithTools() {
  const { messages } = useChat()

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {/* Regular text */}
          {message.content && <p>{message.content}</p>}

          {/* Tool calls */}
          {message.toolInvocations?.map((tool, i) => (
            <ToolCall
              key={i}
              name={tool.toolName}
              args={tool.args}
              result={tool.result}
              state={tool.state} // 'call' | 'result' | 'error'
            />
          ))}
        </div>
      ))}
    </div>
  )
}
```

## Advanced Streaming Patterns

### Multi-Step Streaming

Stream multiple stages with different content types:

```typescript
"use client"

export function MultiStageStreaming() {
  const [stage, setStage] = useState<'thinking' | 'generating' | 'complete'>('thinking')
  const [content, setContent] = useState('')

  const startStreaming = async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'Generate analysis' }),
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const text = decoder.decode(value)

      // Parse stage markers
      if (text.includes('[THINKING]')) {
        setStage('thinking')
      } else if (text.includes('[GENERATING]')) {
        setStage('generating')
      } else if (text.includes('[COMPLETE]')) {
        setStage('complete')
      } else {
        setContent(prev => prev + text)
      }
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        {stage === 'thinking' && (
          <>
            <Loader />
            <span>Thinking...</span>
          </>
        )}
        {stage === 'generating' && (
          <>
            <Loader />
            <span>Generating...</span>
          </>
        )}
      </div>

      <div>{content}</div>
    </div>
  )
}
```

### Optimistic Updates

Show user message immediately before server response:

```typescript
"use client"

import { useChat } from "@ai-sdk-tools/store"
import { useOptimistic } from "react"

export function OptimisticChat() {
  const { messages, input, handleSubmit } = useChat()

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  )

  const handleOptimisticSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Add message optimistically
    addOptimisticMessage({
      id: 'temp-' + Date.now(),
      role: 'user',
      content: input,
    })

    // Submit to server
    await handleSubmit(e)
  }

  return (
    <form onSubmit={handleOptimisticSubmit}>
      {optimisticMessages.map((message) => (
        <div
          key={message.id}
          className={message.id.startsWith('temp-') ? 'opacity-50' : ''}
        >
          {message.content}
        </div>
      ))}
      <input name="message" />
    </form>
  )
}
```

### Streaming with Rate Limiting

Handle rate limits gracefully:

```typescript
"use client"

import { useState } from "react"
import { RateLimitIndicator } from "@/components/chat/rate-limit-indicator"

export function RateLimitedChat() {
  const [rateLimit, setRateLimit] = useState({
    limit: 10,
    remaining: 10,
    reset: Date.now() + 60000, // 1 minute
  })

  const handleSubmit = async (message: string) => {
    if (rateLimit.remaining <= 0) {
      const timeUntilReset = rateLimit.reset - Date.now()
      if (timeUntilReset > 0) {
        alert(`Rate limit exceeded. Try again in ${Math.ceil(timeUntilReset / 1000)}s`)
        return
      }
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })

    // Update rate limit from headers
    setRateLimit({
      limit: parseInt(response.headers.get('X-RateLimit-Limit') || '10'),
      remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '10'),
      reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
    })

    // Process streaming response
    // ...
  }

  return (
    <div>
      <RateLimitIndicator
        limit={rateLimit.limit}
        remaining={rateLimit.remaining}
        resetTime={rateLimit.reset}
      />
      {/* Chat UI */}
    </div>
  )
}
```

## Error Handling

### Graceful Stream Failures

```typescript
"use client"

export function RobustStreaming() {
  const [error, setError] = useState<string | null>(null)

  const startStreaming = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()

      while (true) {
        try {
          const { done, value } = await reader!.read()
          if (done) break

          // Process chunk
          processChunk(value)
        } catch (err) {
          console.error('Error reading stream:', err)
          setError('Connection interrupted. Please retry.')
          break
        }
      }
    } catch (err) {
      console.error('Streaming error:', err)
      setError('Failed to connect. Please check your connection.')
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-destructive text-destructive-foreground p-4">
          {error}
          <button onClick={startStreaming}>Retry</button>
        </div>
      )}
      {/* Chat UI */}
    </div>
  )
}
```

### Retry Logic

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<Response> {
  try {
    return await fetch(url, options)
  } catch (error) {
    if (retries === 0) throw error

    await new Promise(resolve => setTimeout(resolve, delay))
    return fetchWithRetry(url, options, retries - 1, delay * 2)
  }
}
```

## Performance Optimization

### Throttling Updates

```typescript
import { useCallback } from "react"
import { throttle } from "lodash"

export function ThrottledStreaming() {
  const [content, setContent] = useState('')

  // Update at most once per 100ms
  const throttledUpdate = useCallback(
    throttle((text: string) => {
      setContent(prev => prev + text)
    }, 100),
    []
  )

  // In streaming loop
  const processChunk = (chunk: string) => {
    throttledUpdate(chunk)
  }

  return <div>{content}</div>
}
```

### Debouncing Renders

```typescript
import { useDeferredValue } from "react"

export function DeferredStreaming() {
  const [content, setContent] = useState('')

  // Defer rendering to avoid blocking
  const deferredContent = useDeferredValue(content)

  return (
    <div>
      {/* This renders with lower priority */}
      <MarkdownRenderer content={deferredContent} />
    </div>
  )
}
```

## Best Practices

1. **Always show loading states** - Users should know streaming is happening
2. **Handle errors gracefully** - Network issues are common
3. **Implement retry logic** - Auto-retry with exponential backoff
4. **Throttle updates** - Don't update UI too frequently
5. **Use optimistic updates** - Show user input immediately
6. **Show progress indicators** - For multi-stage operations
7. **Test error scenarios** - Disconnect, timeout, rate limits
8. **Clean up streams** - Always close readers when done

## See Also

- [Chat Components](../component-reference/chat-components.md)
- [Artifact System](./artifact-system.md)
- [Animations Guide](./animations.md)
