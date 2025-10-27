# AI SDK Tools - Component & Branding Documentation

Complete guide to all components, branding elements, and architecture in the AI SDK Tools project.

## Table of Contents

### Component Reference
- [UI Components Library](./component-reference/ui-components.md) - Complete reference of all 25+ reusable UI components
- [Branding & Theme System](./component-reference/branding-theme.md) - Logo, icons, colors, and theme configuration
- [Dashboard Components](./component-reference/dashboard-components.md) - Financial dashboards and canvas components
- [Chat System Components](./component-reference/chat-components.md) - Complete chat interface system
- [AI Elements](./component-reference/ai-elements.md) - AI-specific UI elements (messages, tools, reasoning)

### Guides
- [Getting Started](./guides/getting-started.md) - Quick start guide to using components
- [Artifact System](./guides/artifact-system.md) - How to create and use artifacts for data visualization
- [File Structure](./guides/file-structure.md) - Complete project structure reference
- [Creating Custom Dashboards](./guides/custom-dashboards.md) - Step-by-step guide to building dashboards
- [Custom Chat Streaming](./guides/custom-chat-streaming.md) - Implementing real-time streaming chat
- [Animations](./guides/animations.md) - Complete guide to Framer Motion animations

## Quick Reference

### Key Directories

```
ai-sdk-tools/
├── apps/
│   ├── example/                 # Main demo application
│   │   └── src/
│   │       ├── components/      # All React components
│   │       │   ├── ui/          # 25 base UI components
│   │       │   ├── chat/        # 11 chat components
│   │       │   ├── ai-elements/ # 30+ AI-specific components
│   │       │   ├── canvas/      # Dashboard canvas components
│   │       │   ├── logo.tsx     # Brand logo
│   │       │   ├── icons.tsx    # Icon library
│   │       │   └── header.tsx   # App header with branding
│   │       ├── ai/
│   │       │   └── artifacts/   # Data schemas for dashboards
│   │       └── app/
│   │           └── globals.css  # Theme system & design tokens
│   └── website/                 # Documentation website
└── packages/
    └── devtools/                # Developer tools with branded UI
        └── src/components/      # 11 devtools components
```

### Component Count Summary

| Category | Count | Location |
|----------|-------|----------|
| UI Components | 25 | `apps/example/src/components/ui/` |
| Chat Components | 11 | `apps/example/src/components/chat/` |
| AI Elements | 30+ | `apps/example/src/components/ai-elements/` |
| Canvas Components | 4 | `apps/example/src/components/canvas/` |
| Devtools Components | 11 | `packages/devtools/src/components/` |
| Branding Elements | 4 | Root of components (logo, icons, theme-toggle, header) |

### Branding Assets

| Asset | Location | Description |
|-------|----------|-------------|
| Main Logo | `apps/example/src/components/logo.tsx` | Geometric SVG (95x83) with gradient |
| Icon Library | `apps/example/src/components/icons.tsx` | Custom SVG icons with wrapper |
| Theme System | `apps/example/src/app/globals.css` | OKLCH color system, light/dark modes |
| Theme Toggle | `apps/example/src/components/theme-toggle.tsx` | Dark/light mode switcher |
| Devtools Logo | `packages/devtools/src/components/devtools-button.tsx` | Branded floating button |

### Pre-built Dashboards

| Dashboard | Canvas Component | Schema | Description |
|-----------|-----------------|--------|-------------|
| Balance Sheet | `balance-sheet-canvas.tsx` | `balance-sheet.ts` | Complete financial balance sheet with ratios |
| Revenue Dashboard | `revenue-canvas.tsx` | `revenue.ts` | Revenue analytics with charts and KPIs |

## Design System

### Colors (OKLCH)
- **Light Mode**: White background, dark text
- **Dark Mode**: Dark background, light text
- **5 Chart Colors**: Pre-configured for data visualization

### Typography
- **Sans Serif**: Geist Sans
- **Monospace**: Departure Mono
- **Default**: Geist Sans

### Spacing & Borders
- **Border Radius**: Base 0.625rem (10px) with variants (sm, md, lg, xl)
- **Custom Properties**: Extensive CSS variables for all design tokens

## Technology Stack

### UI Framework
- **React 19** (RC)
- **Next.js 15.1**
- **TypeScript**

### UI Libraries
- **Radix UI** - Accessible primitives
- **Recharts** - Chart library
- **Lucide React** - Icon library
- **Framer Motion** - Animations
- **next-themes** - Theme management

### Data & Validation
- **Zod** - Schema validation for artifacts
- **ai-sdk-tools** - Artifact and state management

## Getting Started

### Using Existing Components

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  )
}
```

### Creating a Dashboard

```tsx
import { useArtifact } from "ai-sdk-tools/client"
import { MyArtifact } from "@/ai/artifacts/my-artifact"
import { Card } from "@/components/ui/card"

export function MyDashboard() {
  const artifact = useArtifact(MyArtifact)

  return (
    <div className="p-6 space-y-6">
      <Card>{/* Your dashboard content */}</Card>
    </div>
  )
}
```

## Next Steps

1. **Browse Component Reference** - See detailed documentation for each component
2. **Review Branding Guide** - Understand the design system and how to use it
3. **Follow Getting Started** - Build your first component or dashboard
4. **Read Artifact System** - Learn how to create data-driven visualizations

## Need Help?

- Check the [File Structure Guide](./guides/file-structure.md) to navigate the codebase
- See [Custom Dashboards](./guides/custom-dashboards.md) for step-by-step examples
- Review existing implementations in `apps/example/src/components/canvas/`

---

**Last Updated**: October 2025
**Version**: Based on commit ef65e6d
