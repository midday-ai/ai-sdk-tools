# AI SDK Tools

![AI SDK Tools](image.png)

> **⚠️ Active Development Notice**
> 
> This package is currently in **active development** and breaking changes may occur between versions. We recommend pinning to specific versions in production environments and staying updated with our changelog.

Essential utilities for building production-ready AI applications with Vercel AI SDK. State management, debugging, structured streaming, intelligent agents, caching, and persistent memory.

## Installation

### Unified Package (Recommended)

Install everything in one package:

```bash
npm install ai-sdk-tools
```

Import what you need:

```typescript
// Server-side
import { Agent, artifact, cached } from 'ai-sdk-tools';

// Client-side
import { useChat, useArtifact, AIDevtools } from 'ai-sdk-tools/client';
```

### Individual Packages

Or install only what you need:

### [@ai-sdk-tools/store](./packages/store)
AI chat state management that eliminates prop drilling. Clean architecture and better performance for chat components.

```bash
npm i @ai-sdk-tools/store
```

### [@ai-sdk-tools/devtools](./packages/devtools)
Development tools for debugging AI applications. Inspect tool calls, messages, and execution flow directly in your app.

```bash
npm i @ai-sdk-tools/devtools
```

### [@ai-sdk-tools/artifacts](./packages/artifacts)
Stream structured, type-safe artifacts from AI tools to React components. Build dashboards, analytics, and interactive experiences beyond chat.

```bash
npm i @ai-sdk-tools/artifacts @ai-sdk-tools/store
```

### [@ai-sdk-tools/agents](./packages/agents)
Multi-agent orchestration with automatic handoffs and routing. Build intelligent workflows with specialized agents for any AI provider.

```bash
npm i @ai-sdk-tools/agents ai zod
```

### [@ai-sdk-tools/cache](./packages/cache)
Universal caching for AI SDK tools. Cache expensive operations with zero configuration - works with regular tools, streaming, and artifacts.

```bash
npm i @ai-sdk-tools/cache
```

### [@ai-sdk-tools/memory](./packages/memory)
Persistent memory system for AI agents. Add long-term memory with support for multiple storage backends (In-Memory, Upstash Redis, Drizzle).

```bash
npm i @ai-sdk-tools/memory
```

## Getting Started

Visit our [website](https://ai-sdk-tools.dev) to explore interactive demos and detailed documentation for each package.

## Used by

<a href="https://midday.ai">
  <img src="https://pbs.twimg.com/profile_images/1930607581971501057/vz4YyNOV_400x400.png" alt="Midday" width="48" height="48" style="vertical-align:middle; border-radius:8px;" />
</a>

## License

MIT
