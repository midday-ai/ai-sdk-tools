# @ai-sdk-tools/agents

[![npm version](https://badge.fury.io/js/@ai-sdk-tools%2Fagents.svg)](https://badge.fury.io/js/@ai-sdk-tools%2Fagents)

Multi-agent orchestration for AI SDK v5. Build intelligent workflows with specialized agents, automatic handoffs, and seamless coordination. Works with any AI provider.

```bash
npm install @ai-sdk-tools/agents ai zod
```

## Why Multi-Agent Systems?

Complex tasks benefit from specialized expertise. Instead of a single model handling everything, break work into focused agents:

**Customer Support**: Triage → Technical Support → Billing  
**Content Pipeline**: Research → Writing → Editing → Publishing  
**Code Development**: Planning → Implementation → Testing → Documentation  
**Data Analysis**: Collection → Processing → Visualization → Insights

### Benefits

- **Specialization** - Each agent focuses on its domain with optimized instructions and tools
- **Context Preservation** - Full conversation history maintained across handoffs
- **Provider Flexibility** - Use different models for different tasks (GPT-4 for analysis, Claude for writing)
- **Programmatic Routing** - Pattern matching and automatic agent selection
- **Production Ready** - Built on AI SDK v5 with streaming, error handling, and observability

### When to Use Agents

**Use multi-agent systems when:**
- Tasks require distinct expertise (technical vs. creative vs. analytical)
- Workflow has clear stages that could be handled independently
- Different models excel at different parts of the task
- You need better control over specialized behavior

**Use single model when:**
- Task is straightforward and can be handled by general instructions
- No clear separation of concerns
- Response time is critical (multi-agent adds orchestration overhead)

## Core Concepts

### Agent
An AI with specialized instructions, tools, and optional context. Each agent is configured with a language model and system prompt tailored to its role.

### Memory & Conversation History
Agents automatically load conversation history from storage when memory is enabled. This creates a clean separation of concerns:
- **Frontend**: Sends only the new user message
- **Backend**: Loads conversation history from storage
- **Storage**: Single source of truth for all conversations

This approach:
- Reduces network payload (no need to send full history)
- Provides consistent context across requests
- Enables server-side control of context window size via `lastMessages` config
- Integrates seamlessly with `@ai-sdk-tools/memory` providers

### Handoffs
Agents can transfer control to other agents while preserving conversation context. Handoffs include the reason for transfer and any relevant context.

**Enhanced Context Management**: The system now supports OpenAI-style context filtering during handoffs, allowing you to control exactly what information is passed between agents using `HandoffInputFilter` functions.

### Orchestration
Automatic routing between agents based on:
- **Programmatic matching**: Pattern-based routing with `matchOn`
- **LLM-based routing**: The orchestrator agent decides which specialist to invoke
- **Hybrid**: Combine both for optimal performance

## Enhanced Features (v0.3.0+)

### Context Management & Handoff Filtering

The package now includes OpenAI-style context management with `AgentRunContext` and `HandoffInputFilter` support:

```typescript
import { Agent, handoff, removeAllTools, keepLastNMessages } from '@ai-sdk-tools/agents';

// Configure handoffs with context filtering
const specialist = new Agent({
  name: 'Specialist',
  model: openai('gpt-4o'),
  instructions: 'Specialized instructions...',
});

const orchestrator = new Agent({
  name: 'Orchestrator',
  model: openai('gpt-4o'),
  instructions: 'Route to specialists...',
  handoffs: [
    // Remove all tool calls when handing off
    handoff(specialist, {
      inputFilter: removeAllTools,
      onHandoff: async (runContext) => {
        console.log('Handing off to specialist');
      },
    }),
    // Keep only last 10 messages for context windowing
    handoff(anotherSpecialist, {
      inputFilter: keepLastNMessages(10),
    }),
  ],
});
```

### Agent Communication During Handoffs

Agents automatically share context through conversationMessages during handoffs. No separate tools needed.

### Working Memory

Working memory automatically loads and provides update capability when enabled:

```typescript
const agent = createAgent({
  memory: {
    workingMemory: { 
      enabled: true,
      scope: 'user', // Persists across all chats for this user
      template: 'Custom template...'
    }
  }
});
```

When enabled:
- Working memory loads automatically into system instructions
- Agent gets `updateWorkingMemory` tool to update preferences/context
- Updates persist in storage via the memory provider

### Pre-built Handoff Filters

- `removeAllTools()` - Remove all tool-related messages
- `keepLastNMessages(n)` - Keep only the last N messages for context windowing

## Quick Start

### Basic: Single Agent

```typescript
import { Agent } from '@ai-sdk-tools/agents';
import { openai } from '@ai-sdk/openai';

const agent = new Agent({
  name: 'Assistant',
  model: openai('gpt-4o'),
  instructions: 'You are a helpful assistant.',
});

// Generate response
const result = await agent.generate({
  prompt: 'What is 2+2?',
});

console.log(result.text); // "4"
```

### Handoffs: Two Specialists

```typescript
import { Agent } from '@ai-sdk-tools/agents';
import { openai } from '@ai-sdk/openai';

// Create specialized agents
const mathAgent = new Agent({
  name: 'Math Tutor',
  model: openai('gpt-4o'),
  instructions: 'You help with math problems. Show step-by-step solutions.',
});

const historyAgent = new Agent({
  name: 'History Tutor',
  model: openai('gpt-4o'),
  instructions: 'You help with history questions. Provide context and dates.',
});

// Create orchestrator with handoff capability
const orchestrator = new Agent({
  name: 'Triage',
  model: openai('gpt-4o'),
  instructions: 'Route questions to the appropriate specialist.',
  handoffs: [mathAgent, historyAgent],
});

// LLM decides which specialist to use
const result = await orchestrator.generate({
  prompt: 'What is the quadratic formula?',
});

console.log(`Handled by: ${result.finalAgent}`); // "Math Tutor"
console.log(`Handoffs: ${result.handoffs.length}`); // 1
```

### Orchestration: Auto-Routing

Use programmatic routing for instant agent selection without LLM overhead:

```typescript
const mathAgent = new Agent({
  name: 'Math Tutor',
  model: openai('gpt-4o'),
  instructions: 'You help with math problems.',
  matchOn: ['calculate', 'math', 'equation', /\d+\s*[\+\-\*\/]\s*\d+/],
});

const historyAgent = new Agent({
  name: 'History Tutor',
  model: openai('gpt-4o'),
  instructions: 'You help with history questions.',
  matchOn: ['history', 'war', 'civilization', /\d{4}/], // Years
});

const orchestrator = new Agent({
  name: 'Smart Router',
  model: openai('gpt-4o-mini'), // Efficient for routing
  instructions: 'Route to specialists. Fall back to handling general questions.',
  handoffs: [mathAgent, historyAgent],
});

// Automatically routes to mathAgent based on pattern match
const result = await orchestrator.generate({
  prompt: 'What is 15 * 23?',
});
```

## Advanced Patterns

### Streaming with UI

For Next.js route handlers and real-time UI updates:

```typescript
// app/api/chat/route.ts
import { Agent } from '@ai-sdk-tools/agents';
import { openai } from '@ai-sdk/openai';

const supportAgent = new Agent({
  name: 'Support',
  model: openai('gpt-4o'),
  instructions: 'Handle customer support inquiries.',
  handoffs: [technicalAgent, billingAgent],
});

export async function POST(req: Request) {
  const { message, chatId } = await req.json();

  return supportAgent.toUIMessageStream({
    message, // Only pass the new user message
    context: { chatId }, // Storage will provide conversation history
    maxRounds: 5, // Max handoffs
    maxSteps: 10, // Max tool calls per agent
    onEvent: async (event) => {
      if (event.type === 'agent-handoff') {
        console.log(`Handoff: ${event.from} → ${event.to}`);
      }
    },
  });
}
```

### Tools and Context

```typescript
import { tool } from 'ai';
import { z } from 'zod';

const calculatorTool = tool({
  description: 'Perform calculations',
  parameters: z.object({
    expression: z.string(),
  }),
  execute: async ({ expression }) => {
    return eval(expression); // Use safe-eval in production
  },
});

const agent = new Agent({
  name: 'Calculator Agent',
  model: openai('gpt-4o'),
  instructions: 'Help with math using the calculator tool.',
  tools: {
    calculator: calculatorTool,
  },
  maxTurns: 20, // Max tool call iterations
});
```

### Context-Aware Agents

Use typed context for team/user-specific behavior:

```typescript
interface TeamContext {
  teamId: string;
  userId: string;
  preferences: Record<string, string>;
}

const agent = new Agent<TeamContext>({
  name: 'Team Assistant',
  model: openai('gpt-4o'),
  instructions: (context) => {
    return `You are helping team ${context.teamId}. 
    User preferences: ${JSON.stringify(context.preferences)}`;
  },
});

// Pass context when streaming
agent.toUIMessageStream({
  message: userMessage, // New user message
  context: {
    teamId: 'team-123',
    userId: 'user-456',
    chatId: 'chat-789', // For conversation history
    preferences: { theme: 'dark', language: 'en' },
  },
});
```

### Custom Routing Function

```typescript
const expertAgent = new Agent({
  name: 'Expert',
  model: openai('gpt-4o'),
  instructions: 'Handle complex technical questions.',
  matchOn: (message) => {
    const complexity = calculateComplexity(message);
    return complexity > 0.7;
  },
});
```

### Multi-Provider Setup

Use the best model for each task:

```typescript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

const researchAgent = new Agent({
  name: 'Researcher',
  model: anthropic('claude-3-5-sonnet-20241022'), // Excellent reasoning
  instructions: 'Research topics thoroughly.',
});

const writerAgent = new Agent({
  name: 'Writer',
  model: openai('gpt-4o'), // Great at creative writing
  instructions: 'Create engaging content.',
});

const editorAgent = new Agent({
  name: 'Editor',
  model: google('gemini-1.5-pro'), // Strong at review
  instructions: 'Review and improve content.',
  handoffs: [writerAgent], // Can send back for rewrites
});

const pipeline = new Agent({
  name: 'Content Manager',
  model: openai('gpt-4o-mini'), // Efficient orchestrator
  instructions: 'Coordinate content creation.',
  handoffs: [researchAgent, writerAgent, editorAgent],
});
```

### Guardrails

Control agent behavior with input/output validation:

```typescript
const agent = new Agent({
  name: 'Moderated Agent',
  model: openai('gpt-4o'),
  instructions: 'Answer questions helpfully.',
  inputGuardrails: [
    async (input) => {
      if (containsProfanity(input)) {
        return { 
          pass: false, 
          action: 'block',
          message: 'Input violates content policy',
        };
      }
      return { pass: true };
    },
  ],
  outputGuardrails: [
    async (output) => {
      if (containsSensitiveInfo(output)) {
        return { 
          pass: false, 
          action: 'modify',
          modifiedOutput: redactSensitiveInfo(output),
        };
      }
      return { pass: true };
    },
  ],
});
```

### Tool Permissions

Control which tools agents can access:

```typescript
const agent = new Agent({
  name: 'Restricted Agent',
  model: openai('gpt-4o'),
  instructions: 'Help with tasks.',
  tools: {
    readData: readDataTool,
    writeData: writeDataTool,
    deleteData: deleteDataTool,
  },
  permissions: {
    allowed: ['readData', 'writeData'], // deleteData blocked
    maxCallsPerTool: {
      writeData: 5, // Limit writes
    },
  },
});
```

## Complex Multi-Agent Example

Here's a real-world example: determining if a user can afford a Tesla Model Y by combining web research and financial analysis:

```typescript
import { Agent, handoff, removeAllTools, keepLastNMessages } from '@ai-sdk-tools/agents';
import { openai } from '@ai-sdk/openai';

// Research Specialist - gathers current product information
const researchSpecialist = new Agent({
  name: 'Research Specialist',
  model: openai('gpt-4o-mini'),
  instructions: `You research current product information and pricing.
Provide detailed findings for other agents.`,
  tools: {
    webSearch: webSearchTool,
  },
});

// Financial Analyst - evaluates affordability
const financialAnalyst = new Agent({
  name: 'Financial Analyst', 
  model: openai('gpt-4o-mini'),
  instructions: `You analyze financial affordability based on user data and research.
Use previous conversation context to provide comprehensive analysis.`,
  tools: {
    getFinancialData: getFinancialDataTool,
  },
});

// Main Assistant with configured handoffs
const assistant = new Agent({
  name: 'Assistant',
  model: openai('gpt-4o-mini'),
  instructions: `Help users determine if they can afford major purchases.
Coordinate research and financial analysis for comprehensive answers.`,
  handoffs: [
    // Research first, remove tool calls to keep context clean
    handoff(researchSpecialist, {
      inputFilter: removeAllTools,
    }),
    // Then financial analysis, keep recent context
    handoff(financialAnalyst, {
      inputFilter: keepLastNMessages(10),
    }),
  ],
});

// Usage: "Can I afford a Tesla Model Y?"
// 1. Assistant → Research Specialist (searches for Tesla pricing)
// 2. Research Specialist → Financial Analyst (reads pricing, gets user's financial data)
// 3. Financial Analyst provides comprehensive affordability analysis
```

## API Reference

### Agent Class

```typescript
class Agent<TContext extends Record<string, unknown> = Record<string, unknown>>
```

**Constructor Options:**
- `name: string` - Unique agent identifier
- `model: LanguageModel` - AI SDK language model
- `instructions: string | ((context: TContext) => string)` - System prompt
- `tools?: Record<string, Tool>` - Available tools
- `handoffs?: Agent[]` - Agents this agent can hand off to
- `maxTurns?: number` - Maximum tool call iterations (default: 10)
- `temperature?: number` - Model temperature
- `matchOn?: (string | RegExp)[] | ((message: string) => boolean)` - Routing patterns
- `onEvent?: (event: AgentEvent) => void` - Lifecycle event handler
- `inputGuardrails?: InputGuardrail[]` - Pre-execution validation
- `outputGuardrails?: OutputGuardrail[]` - Post-execution validation
- `permissions?: ToolPermissions` - Tool access control

**Methods:**

```typescript
// Generate response (non-streaming)
async generate(options: {
  prompt: string;
  messages?: ModelMessage[];
}): Promise<AgentGenerateResult>

// Stream response (AI SDK stream)
stream(options: {
  prompt?: string;
  messages?: ModelMessage[];
}): AgentStreamResult

// Stream as UI messages (Next.js route handler)
toUIMessageStream(options: {
  message: UIMessage; // New user message - history loaded from storage
  strategy?: 'auto' | 'manual';
  maxRounds?: number;
  maxSteps?: number;
  context?: TContext;
  onEvent?: (event: AgentEvent) => void;
  beforeStream?: (ctx: { writer: UIMessageStreamWriter }) => boolean | Promise<boolean>;
  // ... AI SDK stream options
}): Response

// Get handoff agents
getHandoffs(): Agent[]
```

### Utility Functions

```typescript
// Create handoff instruction
createHandoff(
  targetAgent: string,
  context?: string,
  reason?: string
): HandoffInstruction

// Check if result is handoff
isHandoffResult(result: unknown): result is HandoffInstruction

// Create handoff tool for AI SDK
createHandoffTool(agents: Agent[]): Tool

// Create configured handoff with filtering
handoff<TContext>(agent: Agent<TContext>, config?: HandoffConfig<TContext>): ConfiguredHandoff<TContext>

// Get transfer message for handoff
getTransferMessage<TContext>(agent: Agent<TContext>): string
```

### Handoff Filters

```typescript
// Remove all tool-related messages
removeAllTools(data: HandoffInputData): HandoffInputData

// Keep only last N messages
keepLastNMessages(n: number): HandoffInputFilter
```

### Context Management

```typescript
// Run context for workflow state
class AgentRunContext<TContext = Record<string, unknown>> {
  context: TContext;
  metadata: Record<string, unknown>;
  constructor(context?: TContext);
  toJSON(): object;
}

// Execution context
createExecutionContext<T>(options: {
  context?: T;
  writer?: UIMessageStreamWriter;
  metadata?: Record<string, unknown>;
}): ExecutionContext<T>

// Routing utilities
matchAgent(message: string, agents: Agent[]): Agent | null
findBestMatch(message: string, agents: Agent[]): Agent | null

// Streaming utilities
writeAgentStatus(writer: UIMessageStreamWriter, status: {
  status: 'executing' | 'routing' | 'completing';
  agent: string;
}): void
```

### Event Types

```typescript
type AgentEvent =
  | { type: 'agent-start'; agent: string; round: number }
  | { type: 'agent-step'; agent: string; step: StepResult }
  | { type: 'agent-finish'; agent: string; round: number }
  | { type: 'agent-handoff'; from: string; to: string; reason?: string }
  | { type: 'agent-complete'; totalRounds: number }
  | { type: 'agent-error'; error: Error }
```

## Integration with Other Packages

### With @ai-sdk-tools/cache

Cache expensive tool calls across agents:

```typescript
import { createCached } from '@ai-sdk-tools/cache';
import { Redis } from '@upstash/redis';

const cached = createCached({ cache: Redis.fromEnv() });

const agent = new Agent({
  name: 'Data Agent',
  model: openai('gpt-4o'),
  instructions: 'Analyze data.',
  tools: {
    analyze: cached(expensiveAnalysisTool),
  },
});
```

### With @ai-sdk-tools/artifacts

Stream structured artifacts from agents:

```typescript
import { artifact } from '@ai-sdk-tools/artifacts';
import { tool } from 'ai';
import { z } from 'zod';

const ReportArtifact = artifact('report', z.object({
  title: z.string(),
  sections: z.array(z.object({
    heading: z.string(),
    content: z.string(),
  })),
}));

const reportAgent = new Agent({
  name: 'Report Generator',
  model: openai('gpt-4o'),
  instructions: 'Generate structured reports.',
  tools: {
    createReport: tool({
      description: 'Create a report',
      parameters: z.object({
        title: z.string(),
      }),
      execute: async function* ({ title }) {
        const report = ReportArtifact.stream({ title, sections: [] });
        
        yield { text: 'Generating report...' };
        
        await report.update({ 
          sections: [{ heading: 'Introduction', content: '...' }],
        });
        
        yield { text: 'Report complete', forceStop: true };
      },
    }),
  },
});
```

### With @ai-sdk-tools/devtools

Debug agent execution in development:

```typescript
import { AIDevTools } from '@ai-sdk-tools/devtools';

const agent = new Agent({
  name: 'Debug Agent',
  model: openai('gpt-4o'),
  instructions: 'Test agent.',
  onEvent: (event) => {
    console.log('[Agent Event]', event);
  },
});

// In your app
export default function App() {
  return (
    <>
      <YourChatInterface />
      <AIDevTools />
    </>
  );
}
```

## Examples

Real-world implementations in `/apps/example/src/ai/agents/`:

- **Triage Agent** - Route customer questions to specialists
- **Financial Agent** - Multi-step analysis with artifacts
- **Code Review** - Analyze → Test → Document workflow
- **Multi-Provider** - Use different models for different tasks

## Contributing

Contributions are welcome! See the [contributing guide](../../CONTRIBUTING.md) for details.

## License

MIT
