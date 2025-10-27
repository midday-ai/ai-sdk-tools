# Chat System Components

Complete reference for the AI SDK Tools chat interface system.

**Location**: `apps/example/src/components/chat/`

## Overview

The chat system provides a full-featured conversational interface with:
- Real-time message streaming
- File attachments
- Voice input
- Command palette
- Suggested prompts
- Artifact canvas integration
- Status indicators for agent/tool execution
- Rate limiting display

**Total Components**: 11 dedicated chat components

## Main Components

### ChatInterface

**File**: `chat/chat-interface.tsx`

Main container component that orchestrates the entire chat experience.

**Features**:
- Floating canvas for artifacts (slides in from right)
- Fixed header with navigation
- Scrollable conversation area
- Fixed input area at bottom
- Empty state with suggestions
- Responsive layout

**Structure**:
```tsx
<div className="flex h-screen">
  {/* Main chat area */}
  <div className="flex-1 flex flex-col">
    <ChatHeader />
    <ChatMessages />
    <ChatInput />
  </div>

  {/* Floating artifact canvas */}
  <ArtifactCanvas />
</div>
```

**Usage**:
```tsx
import { ChatInterface } from "@/components/chat"

<ChatProvider initialMessages={messages}>
  <ChatInterface />
</ChatProvider>
```

---

### ChatInput

**File**: `chat/chat-input.tsx`

Comprehensive input component with multiple input methods.

**Features**:
- **Text Input**: Multi-line textarea with auto-resize
- **File Attachments**: Drag-and-drop + file picker
- **Voice Input**: Real-time audio recording with waveform
- **Web Search Toggle**: Enable/disable web search
- **Command Palette**: Slash commands with autocomplete
- **Suggested Prompts**: Quick prompt pills
- **Rate Limiting**: Visual indicator when rate limited
- **Submit Button**: Disabled when empty or rate limited

**Components Used**:
- `Textarea` from ui/textarea
- `Button` from ui/button
- `VoiceInputButton` from ai-elements
- `LiveWaveform` from ui/live-waveform
- `RateLimitIndicator` from chat/rate-limit-indicator

**Key Features**:

**Attachment Handling**:
```tsx
<input
  type="file"
  multiple
  accept="image/*,.pdf,.doc,.docx"
  onChange={handleFileSelect}
/>

// Display attachments
{attachments.map((file) => (
  <div key={file.name}>
    <FileIcon />
    <span>{file.name}</span>
    <button onClick={() => removeFile(file)}>×</button>
  </div>
))}
```

**Voice Input Integration**:
```tsx
<VoiceInputButton
  onRecordingStart={handleStart}
  onRecordingStop={handleStop}
  onTranscript={handleTranscript}
/>

{isRecording && (
  <LiveWaveform stream={audioStream} />
)}
```

**Command Palette**:
```tsx
// Detect slash commands
if (input.startsWith('/')) {
  showCommandPalette = true
  filteredCommands = commands.filter(cmd =>
    cmd.startsWith(input.slice(1))
  )
}
```

---

### ChatMessages

**File**: `chat/chat-messages.tsx`

Message list display with streaming support.

**Features**:
- Auto-scroll to latest message
- Streaming message updates
- Message grouping (user/assistant)
- Rich content rendering (code, citations, tools)
- Loading indicators
- Empty state

**Message Rendering**:
```tsx
{messages.map((message) => (
  <Message
    key={message.id}
    message={message}
    isStreaming={isStreaming && isLastMessage}
  />
))}
```

**Components Used**:
- `Message` from ai-elements
- `ScrollArea` from ui
- `EmptyState` from chat/empty-state

**Auto-scroll Logic**:
```tsx
const scrollRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }
}, [messages])
```

---

### ChatHeader

**File**: `chat/chat-header.tsx`

Header component with navigation and controls.

**Features**:
- Chat title (editable)
- Navigation controls (back, new chat)
- Breadcrumbs
- Settings menu
- Agent/tool status indicators

**Structure**:
```tsx
<header className="border-b">
  <ChatNavigation />
  <ChatTitle />
  <ChatStatusIndicators />
</header>
```

**Usage**:
```tsx
import { ChatHeader } from "@/components/chat/chat-header"

<ChatHeader />
```

---

### ChatNavigation

**File**: `chat/chat-navigation.tsx`

Navigation controls for chat management.

**Features**:
- Back button (go to chat list)
- New chat button
- Chat history dropdown
- Quick actions

**Buttons**:
```tsx
<div className="flex items-center gap-2">
  <Button variant="ghost" onClick={handleBack}>
    <ArrowLeft className="h-4 w-4" />
  </Button>

  <Button variant="outline" onClick={handleNewChat}>
    New Chat
  </Button>
</div>
```

---

### ChatTitle

**File**: `chat/chat-title.tsx`

Editable chat title with auto-generation.

**Features**:
- Display mode (clickable)
- Edit mode (inline input)
- Auto-save on blur
- Character limit
- Keyboard shortcuts (Enter to save, Esc to cancel)

**Implementation**:
```tsx
const [isEditing, setIsEditing] = useState(false)
const [title, setTitle] = useState(initialTitle)

{isEditing ? (
  <Input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    onBlur={handleSave}
    onKeyDown={(e) => {
      if (e.key === 'Enter') handleSave()
      if (e.key === 'Escape') handleCancel()
    }}
    maxLength={100}
    autoFocus
  />
) : (
  <h1 onClick={() => setIsEditing(true)}>
    {title}
  </h1>
)}
```

---

### ChatStatusIndicators

**File**: `chat/chat-status-indicators.tsx`

Real-time status display for agent and tool execution.

**Features**:
- Agent execution status
- Tool call status
- Animated indicators
- Status badges
- Execution time

**Status Types**:
- `thinking` - Agent is reasoning
- `running` - Tool is executing
- `complete` - Execution finished
- `error` - Execution failed

**Example**:
```tsx
<div className="flex items-center gap-2">
  {agentStatus === 'thinking' && (
    <Badge variant="secondary">
      <AnimatedStatus status="loading" />
      <span>Thinking...</span>
    </Badge>
  )}

  {toolCalls.map((tool) => (
    <Badge key={tool.id} variant="outline">
      <span>{tool.name}</span>
      {tool.status === 'running' && <Loader />}
    </Badge>
  ))}
</div>
```

---

### EmptyState

**File**: `chat/empty-state.tsx`

Initial chat screen with suggested prompts.

**Features**:
- Welcome message
- App description
- Suggested prompts as clickable pills
- Categorized suggestions
- Smooth animation

**Structure**:
```tsx
<div className="flex flex-col items-center justify-center h-full">
  <div className="text-center space-y-4">
    <Logo className="h-16 w-16 mx-auto" />
    <h1 className="text-2xl font-semibold">
      Welcome to AI SDK Tools
    </h1>
    <p className="text-muted-foreground">
      Ask me anything or try one of these:
    </p>
  </div>

  <SuggestedPrompts onSelectPrompt={handlePromptClick} />
</div>
```

---

### SuggestedPrompts / SuggestionPills

**File**: `chat/suggested-prompts.tsx`, `chat/suggestion-pills.tsx`

Clickable prompt suggestions.

**Features**:
- Categorized prompts
- Hover effects
- Click to populate input
- Responsive grid layout

**Prompt Categories**:
```tsx
const promptCategories = [
  {
    title: "Data Analysis",
    prompts: [
      "Create a balance sheet dashboard",
      "Analyze revenue trends",
      "Generate financial report"
    ]
  },
  {
    title: "Visualization",
    prompts: [
      "Create a bar chart",
      "Build a dashboard",
      "Show data as table"
    ]
  }
]
```

**Pill Component**:
```tsx
<button
  onClick={() => onSelectPrompt(prompt)}
  className="px-4 py-2 rounded-full border hover:bg-secondary transition-colors"
>
  {prompt}
</button>
```

---

### RateLimitIndicator

**File**: `chat/rate-limit-indicator.tsx`

Visual indicator for rate limiting status.

**Features**:
- Remaining requests display
- Time until reset
- Progress bar
- Warning colors

**Display Logic**:
```tsx
const percentage = (remaining / limit) * 100

<div className="flex items-center gap-2">
  <Progress value={percentage} />
  <span className="text-xs">
    {remaining} / {limit} requests
  </span>
  {resetTime && (
    <span className="text-xs text-muted-foreground">
      Resets in {formatTime(resetTime)}
    </span>
  )}
</div>
```

**Colors by Status**:
- Green (>75%): Normal
- Yellow (25-75%): Caution
- Red (<25%): Warning

---

## Chat System Architecture

### 1. Provider Setup

```tsx
import { Provider as ChatProvider } from "@ai-sdk-tools/store"

<ChatProvider initialMessages={messages}>
  <ChatInterface />
</ChatProvider>
```

### 2. Message Flow

```
User Input → ChatInput → onSubmit → AI Processing → Stream → ChatMessages
```

### 3. State Management

Uses AI SDK Tools store for:
- Messages array
- Streaming state
- Loading indicators
- Error handling

### 4. Artifact Integration

```tsx
// Messages can trigger artifact creation
{message.artifacts?.map((artifact) => (
  <ArtifactCanvas artifact={artifact} />
))}
```

---

## Advanced Features

### File Upload

```tsx
// In ChatInput
const handleFileUpload = async (files: FileList) => {
  const formData = new FormData()
  Array.from(files).forEach(file => {
    formData.append('files', file)
  })

  // Process files
  const urls = await uploadFiles(formData)
  setAttachments(prev => [...prev, ...urls])
}
```

### Voice Input

```tsx
// In ChatInput
const {
  isRecording,
  startRecording,
  stopRecording,
  transcript
} = useVoiceInput()

<VoiceInputButton
  isRecording={isRecording}
  onStart={startRecording}
  onStop={stopRecording}
/>

{transcript && (
  <div>Transcript: {transcript}</div>
)}
```

### Command Palette

```tsx
// Slash command detection
const [showCommands, setShowCommands] = useState(false)

useEffect(() => {
  if (input.startsWith('/')) {
    setShowCommands(true)
  } else {
    setShowCommands(false)
  }
}, [input])

{showCommands && (
  <Command>
    <CommandList>
      {filteredCommands.map(cmd => (
        <CommandItem key={cmd.name} onSelect={handleCommandSelect}>
          {cmd.name} - {cmd.description}
        </CommandItem>
      ))}
    </CommandList>
  </Command>
)}
```

---

## Styling & Layout

### Chat Interface Layout

```tsx
// Full-height container
<div className="flex h-screen overflow-hidden">
  {/* Chat column */}
  <div className="flex-1 flex flex-col min-w-0">
    {/* Fixed header */}
    <div className="flex-none">
      <ChatHeader />
    </div>

    {/* Scrollable messages */}
    <div className="flex-1 overflow-auto">
      <ChatMessages />
    </div>

    {/* Fixed input */}
    <div className="flex-none border-t">
      <ChatInput />
    </div>
  </div>

  {/* Canvas overlay (slides from right) */}
  <AnimatePresence>
    {hasArtifact && (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-1/2 border-l"
      >
        <ArtifactCanvas />
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

### Message Styling

```tsx
// User message
<div className="flex justify-end">
  <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
    {message.content}
  </div>
</div>

// Assistant message
<div className="flex justify-start">
  <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
    {message.content}
  </div>
</div>
```

---

## Best Practices

### Message Handling

1. **Stream responses** - Use streaming API for real-time feel
2. **Optimistic updates** - Show user message immediately
3. **Error boundaries** - Catch and display errors gracefully
4. **Retry logic** - Allow users to retry failed messages
5. **Message persistence** - Save chat history

### Input Handling

1. **Debounce input** - For command palette and autocomplete
2. **Validate attachments** - Check file size and type
3. **Keyboard shortcuts** - Cmd+Enter to send, Esc to clear
4. **Auto-resize textarea** - Grow with content
5. **Focus management** - Return focus after actions

### Performance

1. **Virtualize long chats** - Use virtual scrolling for 100+ messages
2. **Lazy load attachments** - Only load visible attachments
3. **Memoize messages** - Prevent unnecessary re-renders
4. **Throttle scroll** - Optimize scroll event handlers
5. **Code splitting** - Lazy load voice/canvas features

---

## See Also

- [AI Elements](./ai-elements.md) - Message rendering components
- [UI Components](./ui-components.md) - Base components used
- [Artifact System](../guides/artifact-system.md) - Canvas integration
