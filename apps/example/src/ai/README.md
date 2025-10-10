# AI Module

Centralized AI functionality for the financial assistant application.

## Structure

```
ai/
├── agents/           # Agent configurations
│   ├── analytics.ts    # Analytics & forecasting agent
│   ├── customers.ts    # Customer management agent
│   ├── general.ts      # General conversation agent
│   ├── invoices.ts     # Invoice management agent
│   ├── operations.ts   # Operations agent
│   ├── reports.ts      # Financial reports agent
│   ├── time-tracking.ts# Time tracking agent
│   ├── transactions.ts # Transactions agent
│   ├── triage.ts       # Triage/routing agent
│   ├── shared.ts       # Shared context and utilities
│   └── index.ts        # Export all agents
├── tools/           # Tool implementations
│   ├── analytics/   # Business intelligence tools
│   ├── customers/   # Customer management tools
│   ├── invoices/    # Invoice management tools
│   ├── operations/  # Operations tools (inbox, documents, etc.)
│   ├── reports/     # Financial reporting tools
│   ├── tracker/     # Time tracking tools
│   └── transactions/# Transaction tools
├── artifacts/       # Artifact definitions for UI components
├── types/           # Shared type definitions
├── utils/           # Utility functions
└── context.ts       # Global context management
```

## Agents

The application uses the `@ai-sdk-tools/agents` package for multi-agent orchestration.

### Specialist Agents

- **reports** - Financial metrics (revenue, P&L, burn rate, runway, etc.)
- **analytics** - Forecasting and business intelligence
- **transactions** - Transaction history and details
- **invoices** - Invoice management
- **timeTracking** - Time tracking and timers
- **customers** - Customer management and profitability
- **operations** - Inbox, documents, balances, data export
- **general** - General conversation and help

### Triage Agent

The triage agent routes user requests to the appropriate specialist using **hybrid routing**:
- **Programmatic routing** (90% faster) - Keyword/pattern matching via `matchOn`
- **LLM routing** (fallback) - For complex or ambiguous queries

## Usage

```typescript
import { triageAgent } from '@/ai/agents';

// Stream response with hybrid routing
return triageAgent.toUIMessageStream({
  input: userInput,
  messages: messageHistory,
  strategy: 'auto', // Hybrid routing
  maxRounds: 5,
  maxSteps: 10,
  preventDuplicates: true,
  onEvent: (event) => console.log(event),
});
```

## Features

- ✅ **Hybrid Routing** - Fast programmatic matching + LLM fallback
- ✅ **Lifecycle Hooks** - Monitor agent execution via `onEvent`
- ✅ **Safety Guards** - Max rounds, max steps, timeout, duplicate prevention
- ✅ **Guardrails** - Input/output validation (extensible)
- ✅ **Tool Permissions** - Runtime access control (extensible)
- ✅ **Streaming-First** - Designed for `useChat` integration
- ✅ **Type-Safe** - Full TypeScript support

## Adding New Agents

1. **Create agent file `agents/my-agent.ts`**:
   ```typescript
   import { Agent } from "@ai-sdk-tools/agents";
   import { openai } from "@ai-sdk/openai";
   import { myTool } from "../tools/my-category";
   import { getContextPrompt } from "./shared";

   export const myAgent = new Agent({
     name: "myAgent",
     model: openai("gpt-4o-mini"),
     instructions: `${getContextPrompt()}
     
     Your instructions here...`,
     tools: { myTool },
     matchOn: ["keyword1", "keyword2", /pattern/i],
     maxTurns: 5,
   });
   ```

2. **Export in `agents/index.ts`**:
   ```typescript
   export { myAgent } from "./my-agent";
   ```

3. **Add to triage agent handoffs in `agents/triage.ts`**:
   ```typescript
   import { myAgent } from "./my-agent";
   
   // In triageAgent.handoffs array:
   handoffs: [...existingAgents, myAgent],
   ```

## Adding New Tools

1. **Create tool in `tools/<category>/<tool-name>.ts`**:
   ```typescript
   import { tool } from "ai";
   import { z } from "zod";

   export const myTool = tool({
     description: "Tool description",
     parameters: z.object({
       param1: z.string().describe("Parameter description"),
     }),
     execute: async ({ param1 }) => {
       // Tool logic
       return { result: "..." };
     },
   });
   ```

2. **Export in `tools/<category>/index.ts`**:
   ```typescript
   export { myTool } from "./my-tool";
   ```

3. **Add to agent's tools**:
   ```typescript
   tools: {
     myTool,
     // ... other tools
   },
   ```

## Context Management

Global context is managed via `context.ts` and used by all tools:

```typescript
import { getContext, setContext } from '@/ai/context';

// In route handler
setContext({
  userId: "user-123",
  fullName: "John Doe",
  db: database,
  user: { teamId, baseCurrency, locale, fullName },
});

// In tools
const context = getContext();
const user = context.user;
```

## Notes

- **Message history** - Controlled by the application (route handler), not the package
- **Rate limiting** - Implemented at the route level
- **Authentication** - Handled by Next.js middleware (not shown here)
- **Research Agent** - Disabled due to type compatibility with OpenAI's web search tool
