# Getting Started Guide

Quick start guide to using AI SDK Tools components and creating dashboards.

## Installation

The components are already included in the example app. To use them in a new project:

```bash
# Install AI SDK Tools
npm install ai-sdk-tools

# Install dependencies
npm install @radix-ui/react-* recharts lucide-react framer-motion
npm install zod next-themes
```

## Basic Usage

### 1. Setup Theme Provider

**File**: `app/layout.tsx`

```tsx
import { ThemeProvider } from "next-themes"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Copy Design Tokens

Copy `apps/example/src/app/globals.css` to your project for the complete theme system.

### 3. Copy Components

Copy the components you need from `apps/example/src/components/` to your project:

```bash
# Copy UI components
cp -r apps/example/src/components/ui ./src/components/

# Copy specific components
cp apps/example/src/components/logo.tsx ./src/components/
cp apps/example/src/components/theme-toggle.tsx ./src/components/
```

## Using UI Components

### Simple Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a card component</p>
      </CardContent>
    </Card>
  )
}
```

### Button with Variants

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Charts

```tsx
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
]

const chartConfig = {
  value: {
    label: "Value",
    theme: {
      light: "hsl(0 0% 0%)",
      dark: "hsl(0 0% 100%)"
    }
  }
}

<ChartContainer config={chartConfig} className="h-[300px]">
  <BarChart data={data}>
    <XAxis dataKey="month" />
    <YAxis />
    <Bar dataKey="value" fill="var(--color-value)" />
  </BarChart>
</ChartContainer>
```

## Creating a Dashboard

### Step 1: Define Artifact Schema

```typescript
// src/ai/artifacts/sales-dashboard.ts
import { artifact } from "ai-sdk-tools"
import { z } from "zod"

export const SalesDashboard = artifact(
  "sales-dashboard",
  z.object({
    title: z.string(),
    stage: z.enum(["loading", "complete"]),
    data: z.object({
      totalSales: z.number(),
      salesData: z.array(z.object({
        date: z.string(),
        amount: z.number(),
      }))
    })
  })
)
```

### Step 2: Create Canvas

```tsx
// src/components/canvas/sales-dashboard-canvas.tsx
"use client"

import { useArtifact } from "ai-sdk-tools/client"
import { SalesDashboard } from "@/ai/artifacts/sales-dashboard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function SalesDashboardCanvas() {
  const artifact = useArtifact(SalesDashboard)

  if (!artifact.data) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-mono">{artifact.data.title}</h2>

      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-semibold">
            ${artifact.data.data.totalSales.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 3: Use in App

```tsx
import { Provider as ChatProvider } from "@ai-sdk-tools/store"
import { ChatInterface } from "@/components/chat"

export default function Page() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  )
}
```

## Using Branding

### Logo

```tsx
import { Logo } from "@/components/logo"

<Logo className="h-8 w-8" />
```

### Theme Toggle

```tsx
import { ThemeToggle } from "@/components/theme-toggle"

<ThemeToggle />
```

### Header

```tsx
import { Header } from "@/components/header"

<Header /> {/* Includes logo + theme toggle */}
```

## Styling Tips

### Using Theme Colors

```tsx
// Background and foreground
<div className="bg-background text-foreground">

// Primary colors
<div className="bg-primary text-primary-foreground">

// Borders
<div className="border border-border">

// Muted text
<span className="text-muted-foreground">
```

### Typography

```tsx
// Headings
<h1 className="text-2xl font-semibold">

// Code/numbers
<span className="font-mono">

// Small text
<p className="text-xs text-muted-foreground">
```

## Next Steps

1. **Explore Examples** - Check `apps/example/src/components/canvas/` for complete dashboards
2. **Read Component Docs** - See detailed reference for each component
3. **Build Custom Dashboard** - Follow the [Custom Dashboards Guide](./custom-dashboards.md)
4. **Learn Artifacts** - Read the [Artifact System Guide](./artifact-system.md)

## Common Issues

### Theme Not Working
- Ensure ThemeProvider is in layout
- Check globals.css is imported
- Verify `suppressHydrationWarning` on html tag

### Components Not Styled
- Import globals.css in layout
- Check Tailwind config includes component paths
- Verify CSS variables are defined

### TypeScript Errors
- Install @types packages
- Check tsconfig.json paths
- Ensure proper imports

## See Also

- [File Structure](./file-structure.md) - Project organization
- [UI Components](../component-reference/ui-components.md) - Component API
- [Branding Guide](../component-reference/branding-theme.md) - Design system
