# @ai-sdk-tools/agents

[![npm version](https://badge.fury.io/js/@ai-sdk-tools%2Fagents.svg)](https://badge.fury.io/js/@ai-sdk-tools%2Fagents)

Multi-agent orchestration system built on AI SDK v5. Create intelligent agent workflows with handoffs, routing, and coordination - works with any AI provider.

## ⚡ Why Multi-Agent Systems?

Complex tasks often require specialized expertise:
- **Customer Support**: Triage → Technical Support → Billing
- **Content Creation**: Research → Writing → Editing → Review  
- **Data Analysis**: Collection → Processing → Visualization → Insights
- **Code Development**: Planning → Implementation → Testing → Documentation

Benefits:
- **🎯 Specialized Agents** - Each agent focuses on what it does best
- **🔄 Seamless Handoffs** - Intelligent transfer between agents with context preservation
- **🌐 Provider Agnostic** - Works with OpenAI, Anthropic, Google, Meta, xAI, and more
- **📊 Full Traceability** - Complete execution traces and debugging
- **⚡ Built on AI SDK v5** - Leverages the proven foundation with enhanced orchestration

## Installation

```bash
npm install @ai-sdk-tools/agents ai zod
# or
bun add @ai-sdk-tools/agents ai zod
```

## Quick Start

### Basic Multi-Agent Setup

```typescript
import { Agent, run } from '@ai-sdk-tools/agents';
import { openai } from 'ai';
import { z } from 'zod';

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

// Create triage agent with handoffs
const triageAgent = new Agent({
  name: 'Triage Agent',
  model: openai('gpt-4o'),
  instructions: 'Route student questions to the appropriate tutor specialist.',
  handoffs: [mathAgent, historyAgent],
});

// Run the conversation
const result = await run(triageAgent, 'What is 2+2 and when was the Civil War?');
console.log(result.response);
console.log(`Final agent: ${result.finalAgent}`);
console.log(`Handoffs: ${result.handoffs.length}`);
```

### Multi-Provider Example

```typescript
import { openai } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

// Use different models for different agents
const researchAgent = new Agent({
  name: 'Researcher',
  model: anthropic('claude-3-sonnet-20240229'), // Great for analysis
  instructions: 'Research topics thoroughly and gather comprehensive information.',
});

const writerAgent = new Agent({
  name: 'Writer',
  model: openai('gpt-4o'), // Great for creative writing
  instructions: 'Create engaging, well-structured content based on research.',
});

const editorAgent = new Agent({
  name: 'Editor',
  model: google('gemini-1.5-pro'), // Great for review and editing
  instructions: 'Review and improve content for clarity and accuracy.',
  handoffs: [writerAgent], // Can send back for rewrites
});

const contentPipeline = new Agent({
  name: 'Content Manager',
  model: openai('gpt-4o-mini'), // Efficient for routing
  instructions: 'Coordinate content creation from research to final publication.',
  handoffs: [researchAgent, writerAgent, editorAgent],
});
```

### With Tools and Context

```typescript
import { tool } from 'ai';

// Create tools for agents
const calculatorTool = tool({
  description: 'Perform mathematical calculations',
  parameters: z.object({
    expression: z.string(),
  }),
  execute: async ({ expression }) => {
    // Safe eval implementation
    return eval(expression);
  },
});

const searchTool = tool({
  description: 'Search for information',
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    // Your search implementation
    return `Search results for: ${query}`;
  },
});

// Agent with tools
const assistantAgent = new Agent({
  name: 'Assistant',
  model: openai('gpt-4o'),
  instructions: 'Help users with calculations and information lookup.',
  tools: {
    calculator: calculatorTool,
    search: searchTool,
  },
});

// Run with custom options
const result = await run(assistantAgent, 'Calculate 15% of 200 and search for tips', {
  maxTotalTurns: 20,
  onHandoff: (handoff) => console.log(`Handing off to: ${handoff.targetAgent}`),
  onToolCall: (toolCall) => console.log(`Tool called: ${toolCall.name}`),
});
```

## Advanced Usage

### Router-Based Agent Selection

```typescript
import { createTriageAgent, Runner } from '@ai-sdk-tools/agents';

// Create specialized agents
const agents = [mathAgent, historyAgent, scienceAgent];

// Create intelligent router
const router = createTriageAgent('Smart Router', agents, mathAgent);

// Use with runner for more control
const runner = new Runner({
  maxTotalTurns: 100,
  enableTracing: true,
});

runner.registerAgents(agents);
const result = await runner.run(router, 'Explain photosynthesis');
```

### Custom Handoff Logic

```typescript
import { createHandoff } from '@ai-sdk-tools/agents';

const supervisorAgent = new Agent({
  name: 'Supervisor',
  model: openai('gpt-4o'),
  instructions: 'Oversee task completion and quality.',
  tools: {
    escalate: tool({
      description: 'Escalate to human supervisor',
      parameters: z.object({
        reason: z.string(),
        priority: z.enum(['low', 'medium', 'high']),
      }),
      execute: async ({ reason, priority }) => {
        if (priority === 'high') {
          return createHandoff('human-supervisor', reason, 'High priority escalation');
        }
        return 'Handled internally';
      },
    }),
  },
});
```

## API Reference

### Agent Class

```typescript
class Agent {
  constructor(config: AgentConfig)
  async run(input: string, context?: AgentContext): Promise<AgentResult>
  static create(config: AgentConfig): Agent
}
```

### Runner Class

```typescript
class Runner {
  constructor(options?: RunOptions)
  registerAgent(agent: Agent): void
  registerAgents(agents: Agent[]): void
  async run(agent: Agent | string, input: string): Promise<AgentResult>
}
```

### Utility Functions

```typescript
// Simple execution
async function run(agent: Agent, input: string, options?: RunOptions): Promise<AgentResult>

// Handoff utilities
function createHandoff(targetAgent: Agent | string, context?: string, reason?: string): HandoffInstruction
function createHandoffTool(availableAgents: Agent[]): Tool
function isHandoffResult(result: unknown): result is HandoffInstruction

// Router creation
function createRouter(config: RouterConfig): RouterAgent
function createTriageAgent(name: string, agents: Agent[], defaultAgent?: Agent): RouterAgent
```

## Integration with Other Packages

### With @ai-sdk-tools/cache

```typescript
import { createCached } from '@ai-sdk-tools/cache';

const cached = createCached();
const expensiveAgent = new Agent({
  name: 'Data Analyst',
  model: openai('gpt-4o'),
  instructions: 'Perform complex data analysis.',
  tools: {
    analyze: cached(expensiveAnalysisTool), // Cache expensive operations
  },
});
```

### With @ai-sdk-tools/artifacts

```typescript
import { artifact } from '@ai-sdk-tools/artifacts';

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
  instructions: 'Generate structured reports with real-time updates.',
  tools: {
    updateReport: tool({
      description: 'Update report with new section',
      parameters: z.object({
        section: z.object({
          heading: z.string(),
          content: z.string(),
        }),
      }),
      execute: async ({ section }) => {
        const report = ReportArtifact.stream();
        await report.update({ sections: [section] });
        return 'Section added';
      },
    }),
  },
});
```

## Examples

Check out the `/examples` directory for complete implementations:
- **Customer Support Pipeline** - Triage → Technical → Billing
- **Content Creation Workflow** - Research → Write → Edit → Publish  
- **Code Review System** - Analyze → Test → Document → Deploy
- **Multi-Provider Setup** - Using different models for different tasks

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT
