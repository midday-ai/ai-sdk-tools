# File Structure Reference

Complete project structure and file organization.

## Root Structure

```
ai-sdk-tools/
├── apps/                    # Applications
│   ├── example/            # Demo app (main reference)
│   └── website/            # Documentation website
├── packages/               # NPM packages
│   ├── devtools/          # AI DevTools
│   ├── store/             # State management
│   ├── cache/             # Caching utilities
│   └── ...                # Other packages
├── docs/                  # Documentation (this folder)
├── scripts/               # Build scripts
└── package.json           # Workspace config
```

## Example App Structure

```
apps/example/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [[...chatId]]/       # Chat route
│   │   │   └── page.tsx         # Main chat page
│   │   ├── globals.css          # Theme & design tokens
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home redirect
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # 25 base UI components
│   │   │   ├── card.tsx
│   │   │   ├── button.tsx
│   │   │   ├── chart.tsx
│   │   │   └── ...
│   │   ├── chat/                # 11 chat components
│   │   │   ├── chat-interface.tsx
│   │   │   ├── chat-input.tsx
│   │   │   ├── chat-messages.tsx
│   │   │   └── ...
│   │   ├── ai-elements/         # 30+ AI components
│   │   │   ├── message.tsx
│   │   │   ├── code-block.tsx
│   │   │   ├── tool.tsx
│   │   │   └── ...
│   │   ├── canvas/              # Dashboard canvases
│   │   │   ├── balance-sheet-canvas.tsx
│   │   │   ├── revenue-canvas.tsx
│   │   │   └── index.ts
│   │   ├── logo.tsx             # Brand logo
│   │   ├── icons.tsx            # Icon library
│   │   ├── header.tsx           # App header
│   │   ├── theme-toggle.tsx     # Theme switcher
│   │   └── providers.tsx        # React providers
│   │
│   ├── ai/                      # AI-related code
│   │   ├── artifacts/           # Artifact schemas
│   │   │   ├── balance-sheet.ts
│   │   │   ├── revenue.ts
│   │   │   └── ...
│   │   └── agents/              # Agent definitions
│   │       └── memory-template.md
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── utils.ts            # Helper functions (cn)
│   │   └── data.ts             # Data loading
│   │
│   └── hooks/                   # Custom React hooks
│
├── public/                      # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   └── ...
│
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## Key File Locations

### Branding
- **Logo**: `apps/example/src/components/logo.tsx`
- **Icons**: `apps/example/src/components/icons.tsx`
- **Theme**: `apps/example/src/app/globals.css`
- **Header**: `apps/example/src/components/header.tsx`

### Components
- **UI**: `apps/example/src/components/ui/`
- **Chat**: `apps/example/src/components/chat/`
- **AI Elements**: `apps/example/src/components/ai-elements/`
- **Canvases**: `apps/example/src/components/canvas/`

### Artifacts
- **Schemas**: `apps/example/src/ai/artifacts/`
- **Canvases**: `apps/example/src/components/canvas/`

### Configuration
- **Tailwind**: `apps/example/tailwind.config.ts`
- **TypeScript**: `apps/example/tsconfig.json`
- **Next.js**: `apps/example/next.config.js`

## Package Structure

```
packages/devtools/
├── src/
│   ├── components/          # Devtools components
│   │   ├── ai-dev-tools.tsx
│   │   ├── devtools-button.tsx
│   │   └── ...
│   ├── styles.css          # Isolated styles
│   └── index.ts            # Package entry
├── package.json
└── tsconfig.json
```

## Import Patterns

### Component Imports
```typescript
// UI components
import { Card } from "@/components/ui/card"

// Chat components
import { ChatInterface } from "@/components/chat"

// AI elements
import { Message } from "@/components/ai-elements/message"

// Canvas components
import { BalanceSheetCanvas } from "@/components/canvas/balance-sheet-canvas"

// Branding
import { Logo } from "@/components/logo"
```

### Package Imports
```typescript
// AI SDK Tools packages
import { artifact } from "ai-sdk-tools"
import { useArtifact } from "ai-sdk-tools/client"
import { Provider } from "@ai-sdk-tools/store"
import { AIDevtools } from "@ai-sdk-tools/devtools"
```

### Library Imports
```typescript
// Utilities
import { cn } from "@/lib/utils"

// External
import { z } from "zod"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
```

## Naming Conventions

- **Components**: PascalCase (`ChatInterface`, `BalanceSheetCanvas`)
- **Files**: kebab-case (`chat-interface.tsx`, `balance-sheet-canvas.tsx`)
- **Utilities**: camelCase (`cn`, `formatDate`)
- **Types**: PascalCase (`type UserMessage = ...`)
- **Artifacts**: PascalCase (`BalanceSheetArtifact`)

## See Also

- [Getting Started](./getting-started.md)
- [Component Reference](../component-reference/ui-components.md)
