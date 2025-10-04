# @ai-sdk-tools/workflow

> **Human-in-the-loop workflows that scale with your AI application**

Workflows that integrate seamlessly with AI SDK. Add smart confirmation workflows to your AI applications with a single hook - type-safe, performant, and production-ready.

## Features

- 🚀 **Zero-config**: Works out of the box with sensible defaults
- ⚡ **Scales with Zustand**: Eliminates prop drilling, built for performance
- 🔄 **Smart Flows**: Auto-approval, conditional confirmation, timeout handling
- 🎯 **Priority-aware**: Critical flows get immediate attention
- 📊 **Rich Events**: Comprehensive lifecycle event handlers
- 🛡️ **Type-safe**: Full input/output validation with Zod schemas
- 🎨 **UI Agnostic**: Backend handles logic, frontend owns presentation
- 🔧 **AI SDK Native**: Follows AI SDK patterns and conventions

## Installation

```bash
npm install @ai-sdk-tools/workflow
```

## Quick Start

### Backend Setup

```typescript
// app/api/chat/route.ts
import { workflow, createTypedWorkflowContext } from "@ai-sdk-tools/workflow";
import { streamText, tool } from "ai";
import { z } from "zod";

const { setContext } = createTypedFlowContext();

 // Define your flow - AI SDK style configuration
const deleteFileFlow = flow({
  id: "delete-file",
  inputSchema: z.object({
    fileName: z.string(),
    path: z.string(),
    size: z.number(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    deletedFile: z.string().optional(),
  }),
  priority: "high",
  timeout: 30000, // 30 seconds
  autoApprove: (data) => data.size < 1024, // Auto-approve small files
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      setContext({ writer });

      const result = streamText({
        model: openai("gpt-4o"),
        messages: convertToModelMessages(messages),
        tools: {
          deleteFile: tool({
            description: "Delete a file",
            inputSchema: deleteFileFlow.inputSchema,
            outputSchema: deleteFileFlow.outputSchema,
            execute: async (input) => {
              // Backend only handles flow logic, no UI text
              const flowStream = deleteFileFlow.stream(input);
              const response = await flowStream.waitForResponse();
              
              if (response === "approved") {
                return deleteFileFlow.validateOutput({
                  success: true,
                  message: `File ${input.fileName} deleted successfully.`,
                  deletedFile: input.fileName,
                });
              } else {
                return deleteFileFlow.validateOutput({
                  success: false,
                  message: "File deletion cancelled.",
                });
              }
            },
          }),
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
```

### Frontend Usage

```typescript
// components/FlowPanel.tsx
import { useFlow, usePendingFlows } from "@ai-sdk-tools/flow/client";

function FlowPanel() {
  const pendingFlows = usePendingFlows();
  
  return (
    <div className="flow-panel">
      {pendingFlows.map((flow) => (
        <FlowCard key={flow.id} flowId={flow.id} />
      ))}
    </div>
  );
}

function FlowCard({ flowId }: { flowId: string }) {
  const deleteFlow = useFlow(deleteFileFlow, {
    onApproved: (data) => console.log('Approved!', data),
    onRejected: (data) => console.log('Rejected!', data),
  });

  if (!deleteFlow.isPending) return null;

  return (
    <div className="flow-card">
      <h3>{deleteFlow.action}</h3>
      <p>{deleteFlow.description}</p>
      
      {deleteFlow.data && (
        <div className="flow-data">
          <p>File: {deleteFlow.data.fileName}</p>
          <p>Size: {deleteFlow.data.size} bytes</p>
        </div>
      )}
      
      {deleteFlow.timeRemaining && (
        <div className="timeout-indicator">
          {Math.ceil(deleteFlow.timeRemaining / 1000)}s remaining
        </div>
      )}
      
      <div className="flow-actions">
        <button 
          onClick={() => deleteFlow.approve("User confirmed")}
          disabled={!deleteFlow.canApprove}
        >
          Approve
        </button>
        <button 
          onClick={() => deleteFlow.reject("Too risky")}
          disabled={!deleteFlow.canReject}
        </button>
      </div>
    </div>
  );
}
```

## API Reference

### `flow(config)`

Creates a flow definition using AI SDK-style configuration.

```typescript
const myFlow = flow({
  id: string;                           // Unique identifier
  inputSchema: z.ZodSchema<T>;          // Input validation schema
  outputSchema?: z.ZodSchema<O>;        // Output validation schema
  priority?: "low" | "medium" | "high" | "critical";
  timeout?: number;                     // Timeout in milliseconds
  autoApprove?: (data: T) => boolean;   // Auto-approval function
});
```

### `useFlow(flowDef, options?)`

Hook for managing a single flow.

Returns:
- `data`: The flow payload data
- `status`: Current flow status
- `isPending`: Whether flow is waiting for user action
- `approve(reason?)`: Approve the flow
- `reject(reason?)`: Reject the flow
- `cancel()`: Cancel the flow
- `timeRemaining`: Time left before timeout

### `useFlows(options?)`

Hook for managing multiple flows.

Returns:
- `pending`: Array of pending flows
- `hasPending`: Whether there are pending flows
- `pendingCount`: Number of pending flows
- `approveAll(reason?)`: Approve all pending flows
- `rejectAll(reason?)`: Reject all pending flows

## Examples

### Flow with Output Schema

```typescript
const sendEmailFlow = flow({
  id: "send-email",
  inputSchema: z.object({
    to: z.array(z.string().email()),
    subject: z.string(),
    body: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    messageId: z.string().optional(),
    recipients: z.array(z.string()),
    error: z.string().optional(),
  }),
  priority: "medium",
  autoApprove: (data) => {
    // Auto-approve internal emails
    return data.to.every(email => email.endsWith("@company.com"));
  },
});

// In your tool
execute: async (input) => {
  const flowStream = sendEmailFlow.stream(input);
  const response = await flowStream.waitForResponse();
  
  if (response === "approved") {
    const result = {
      success: true,
      messageId: "msg_123",
      recipients: input.to,
    };
    // Validates output against schema
    return sendEmailFlow.validateOutput(result);
  }
}
```

### Multiple Flow Management

```typescript
function FlowDashboard() {
  const flows = useFlows({
    priorityFilter: ["high", "critical"],
    onFlow: (type, flow) => {
      if (flow.priority === "critical") {
        showNotification(`Critical action required: ${flow.action}`);
      }
    },
  });

  return (
    <div>
      <div className="flow-summary">
        Pending: {flows.pendingCount}
        {flows.hasPending && (
          <button onClick={() => flows.approveAll()}>
            Approve All
          </button>
        )}
      </div>
      
      {flows.pending.map(flow => (
        <FlowCard key={flow.id} flow={flow} />
      ))}
    </div>
  );
}
```

## License

MIT
