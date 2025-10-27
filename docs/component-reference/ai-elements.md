# AI Elements Reference

AI-specific UI components for rendering AI responses, tools, reasoning, and interactive elements.

**Location**: `apps/example/src/components/ai-elements/`
**Total Components**: 30+ specialized components

## Core Display Components

### Message
**File**: `ai-elements/message.tsx`

Main component for rendering AI messages with rich content support.

**Features**:
- Text content with markdown
- Code blocks with syntax highlighting
- Citations and sources
- Tool call display
- Reasoning chains
- Streaming support

**Usage**:
```tsx
import { Message } from "@/components/ai-elements/message"

<Message
  message={message}
  isStreaming={isStreaming}
/>
```

### Response
**File**: `ai-elements/response.tsx`

Container for AI assistant responses.

### Actions
**File**: `ai-elements/actions.tsx`

Action buttons for messages (copy, regenerate, share).

### Tool
**File**: `ai-elements/tool.tsx`

Display component for tool executions with results.

### Task
**File**: `ai-elements/task.tsx`

Display for long-running task execution and progress.

## Reasoning & Analysis

### Chain of Thought
**File**: `ai-elements/chain-of-thought.tsx`

Visualize AI reasoning steps in expandable format.

### Reasoning
**File**: `ai-elements/reasoning.tsx`

Display detailed reasoning process.

### Branch
**File**: `ai-elements/branch.tsx`

Show alternative reasoning branches or options.

## Interactive Components

### Prompt Input
**File**: `ai-elements/prompt-input.tsx`

Enhanced input for AI prompts with autocomplete.

### Prompt Commands
**File**: `ai-elements/prompt-commands.tsx`

Command palette for slash commands.

### Code Block
**File**: `ai-elements/code-block.tsx`

Syntax-highlighted code with copy button and language detection.

**Features**:
- Syntax highlighting (multiple languages)
- Line numbers
- Copy button
- Language badge
- Theme support

### Voice Input Button
**File**: `ai-elements/voice-input-button.tsx`

Button component for voice recording.

**States**:
- Idle (microphone icon)
- Recording (pulsing red)
- Processing (spinner)

## Media & Content

### Image
**File**: `ai-elements/image.tsx`

Image display with loading states and captions.

### Web Preview
**File**: `ai-elements/web-preview.tsx`

Preview card for web content (URLs, articles).

### Artifact
**File**: `ai-elements/artifact.tsx`

Container for artifacts (dashboards, visualizations).

## Context & Citations

### Context
**File**: `ai-elements/context.tsx`

Display relevant context used in AI response.

### Inline Citation
**File**: `ai-elements/inline-citation.tsx`

Inline citation markers with hover previews.

### Sources
**File**: `ai-elements/sources.tsx`

List of sources used in response.

### Favicon Stack
**File**: `ai-elements/favicon-stack.tsx`

Stacked favicons for multiple sources.

## UI Feedback

### Loader
**File**: `ai-elements/loader.tsx`

Animated loading indicator.

**Usage**:
```tsx
<Loader size={16} className="text-primary" />
```

### Toolbar
**File**: `ai-elements/toolbar.tsx`

Action toolbar for messages and content.

## Graph Visualization

### Canvas
**File**: `ai-elements/canvas.tsx`

Base canvas for graph visualizations.

### Node
**File**: `ai-elements/node.tsx`

Node component for graph visualizations.

### Edge
**File**: `ai-elements/edge.tsx`

Edge/connection component for graphs.

### Connection
**File**: `ai-elements/connection.tsx`

Connection lines between nodes.

### Panel
**File**: `ai-elements/panel.tsx`

Control panel for graph interactions.

### Controls
**File**: `ai-elements/controls.tsx`

Zoom, pan, and fit controls for graphs.

### Conversation
**File**: `ai-elements/conversation.tsx`

Conversation tree visualization.

## Utility Components

### Open in Chat
**File**: `ai-elements/open-in-chat.tsx`

Button to open content in new chat.

### Suggestion
**File**: `ai-elements/suggestion.tsx`

Suggested action or prompt bubble.

---

## Usage Patterns

### Message Rendering

```tsx
import { Message } from "@/components/ai-elements/message"
import { CodeBlock } from "@/components/ai-elements/code-block"
import { Tool } from "@/components/ai-elements/tool"

function ChatMessage({ message }) {
  return (
    <Message message={message}>
      {/* Text content */}
      <div>{message.content}</div>

      {/* Code blocks */}
      {message.code && (
        <CodeBlock
          code={message.code}
          language={message.language}
        />
      )}

      {/* Tool calls */}
      {message.tools?.map(tool => (
        <Tool key={tool.id} tool={tool} />
      ))}
    </Message>
  )
}
```

### Code Block with Copy

```tsx
<CodeBlock
  code={`
    function example() {
      return "Hello World"
    }
  `}
  language="javascript"
  showLineNumbers
/>
```

### Reasoning Display

```tsx
<ChainOfThought>
  {reasoningSteps.map((step, i) => (
    <Reasoning key={i} step={step} />
  ))}
</ChainOfThought>
```

---

## See Also

- [Chat Components](./chat-components.md) - Chat system integration
- [UI Components](./ui-components.md) - Base UI components
