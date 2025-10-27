# Dashboard Components Reference

Complete guide to pre-built dashboard components and canvas system.

**Location**: `apps/example/src/components/canvas/`

## Overview

The AI SDK Tools project includes a complete dashboard system with:
- **Canvas Components** - Full-page dashboard visualizations
- **Artifact Schemas** - Type-safe data definitions
- **Real-time Updates** - Streaming data support
- **Loading States** - Progressive data loading
- **Theme Support** - Automatic light/dark mode

## Available Dashboards

### Balance Sheet Dashboard

**Files**:
- Canvas: `apps/example/src/components/canvas/balance-sheet-canvas.tsx`
- Schema: `apps/example/src/ai/artifacts/balance-sheet.ts`

#### Features

Complete financial balance sheet visualization with:
- **Assets Section**
  - Current Assets (Cash, Accounts Receivable, Inventory, Prepaid Expenses)
  - Non-Current Assets (PPE, Intangible Assets, Investments)
  - Total Assets calculation
- **Liabilities Section**
  - Current Liabilities (Accounts Payable, Short-term Debt, Accrued Expenses)
  - Non-Current Liabilities (Long-term Debt, Deferred Revenue, Other)
  - Total Liabilities calculation
- **Equity Section**
  - Common Stock
  - Retained Earnings
  - Additional Paid-in Capital
  - Total Equity
- **Financial Ratios**
  - Current Ratio
  - Quick Ratio
  - Debt-to-Equity
  - Working Capital
- **Loading States** with progress toast

#### Data Schema

```typescript
BalanceSheetArtifact = artifact(
  "balance-sheet",
  z.object({
    title: z.string(),
    stage: z.enum(["loading", "processing", "analyzing", "complete"]),
    currency: z.string().default("USD"),
    progress: z.number().min(0).max(1),
    asOfDate: z.string(),

    assets: z.object({
      currentAssets: z.object({
        cash: z.number(),
        accountsReceivable: z.number(),
        inventory: z.number(),
        prepaidExpenses: z.number(),
        total: z.number(),
      }),
      nonCurrentAssets: z.object({
        propertyPlantEquipment: z.number(),
        intangibleAssets: z.number(),
        investments: z.number(),
        total: z.number(),
      }),
      totalAssets: z.number(),
    }),

    liabilities: z.object({
      currentLiabilities: z.object({
        accountsPayable: z.number(),
        shortTermDebt: z.number(),
        accruedExpenses: z.number(),
        total: z.number(),
      }),
      nonCurrentLiabilities: z.object({
        longTermDebt: z.number(),
        deferredRevenue: z.number(),
        otherLiabilities: z.number(),
        total: z.number(),
      }),
      totalLiabilities: z.number(),
    }),

    equity: z.object({
      commonStock: z.number(),
      retainedEarnings: z.number(),
      additionalPaidInCapital: z.number(),
      totalEquity: z.number(),
    }),

    ratios: z.object({
      currentRatio: z.number(),
      quickRatio: z.number(),
      debtToEquity: z.number(),
      workingCapital: z.number(),
    }),
  })
)
```

#### Usage Example

```tsx
import { BalanceSheetCanvas } from "@/components/canvas/balance-sheet-canvas"

// In your artifact registry
<ArtifactCanvas>
  <BalanceSheetCanvas />
</ArtifactCanvas>
```

#### Component Structure

```tsx
export function BalanceSheetCanvas() {
  const artifact = useArtifact(BalanceSheetArtifact)

  // Loading state
  if (!artifact.data) {
    return <div>Loading balance sheet...</div>
  }

  const data = artifact.data
  const isLoading = data.stage !== "complete"

  return (
    <div className="h-full overflow-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1.5 pb-4 border-b">
        <h2>{data.title}</h2>
      </div>

      {/* Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Current Assets */}
          {/* Non-Current Assets */}
        </CardContent>
      </Card>

      {/* Liabilities */}
      {/* Equity */}
      {/* Financial Ratios */}

      {/* Progress Toast */}
      <ProgressToast isVisible={isLoading} stage={data.stage} />
    </div>
  )
}
```

#### Styling Details

- **Layout**: Full-height scrollable container with 1.5rem padding
- **Sections**: Separated by 2rem vertical spacing
- **Cards**: Transparent background, no borders/shadows for clean look
- **Typography**:
  - Headers: `text-2xl tracking-tight font-mono`
  - Labels: `text-xs text-muted-foreground`
  - Numbers: `font-mono` for tabular alignment
- **Hierarchy**: Border-top for totals, font-semibold for subtotals

---

### Revenue Dashboard

**Files**:
- Canvas: `apps/example/src/components/canvas/revenue-canvas.tsx`
- Schema: `apps/example/src/ai/artifacts/revenue.ts`

#### Features

Comprehensive revenue analytics dashboard with:
- **Monthly Revenue Bar Chart**
  - Bar chart visualization using Recharts
  - Tooltip with formatted values
  - Theme-aware colors (black/white)
- **KPI Cards** (4 metrics)
  - Total Revenue
  - Growth Rate (with +/- indicator)
  - Average Deal Size
  - Top Customers Count
- **Revenue by Category**
  - Progress bars with percentages
  - Category breakdown
  - Dollar amounts
- **Top Customers List**
  - Customer names
  - Number of deals
  - Revenue per customer
- **Loading States** with progress toast

#### Data Schema

```typescript
RevenueArtifact = artifact(
  "revenue",
  z.object({
    title: z.string(),
    asOfDate: z.string(),
    stage: z.enum(["generating", "complete"]),
    progress: z.number().min(0).max(1),

    data: z.object({
      totalRevenue: z.number(),
      growthRate: z.number(),
      averageDealSize: z.number(),

      monthlyRevenue: z.array(
        z.object({
          month: z.string(),
          revenue: z.number(),
          growth: z.number(),
        })
      ),

      revenueByCategory: z.array(
        z.object({
          category: z.string(),
          revenue: z.number(),
          percentage: z.number(),
        })
      ),

      quarterlyTrends: z.array(
        z.object({
          quarter: z.string(),
          revenue: z.number(),
          growth: z.number(),
        })
      ),

      topCustomers: z.array(
        z.object({
          name: z.string(),
          revenue: z.number(),
          deals: z.number(),
        })
      ),
    })
  })
)
```

#### Usage Example

```tsx
import { RevenueCanvas } from "@/components/canvas/revenue-canvas"

<ArtifactCanvas>
  <RevenueCanvas />
</ArtifactCanvas>
```

#### Chart Configuration

```typescript
const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "hsl(0 0% 0%)",   // Black for light theme
      dark: "hsl(0 0% 100%)",  // White for dark theme
    },
  },
}

// Chart data transformation
const chartData = data.data.monthlyRevenue.map((month) => ({
  month: month.month,
  revenue: month.revenue,
}))
```

#### Chart Components Used

```tsx
<ChartContainer config={chartConfig} className="h-[300px]">
  <BarChart data={chartData}>
    <XAxis
      dataKey="month"
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      className="text-xs"
    />
    <YAxis
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      className="text-xs"
      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
    />
    <ChartTooltip
      content={
        <ChartTooltipContent
          formatter={(value) => [
            `$${value.toLocaleString()}`,
            "Revenue",
          ]}
        />
      }
    />
    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={0} />
  </BarChart>
</ChartContainer>
```

#### KPI Card Structure

```tsx
<Card className="shadow-none">
  <CardContent className="p-4">
    <div className="flex items-center space-x-2">
      <DollarSign className="h-4 w-4" />
      <div>
        <p className="text-xs text-muted-foreground">Total Revenue</p>
        <p className="text-lg font-semibold">
          ${data.data.totalRevenue.toLocaleString()}
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

Icons used: `DollarSign`, `TrendingUp`, `BarChart3`, `Users` from lucide-react

#### Revenue Category Progress Bars

```tsx
{data.data.revenueByCategory.map((category) => (
  <div key={category.category} className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium">{category.category}</span>
      <span className="text-xs text-muted-foreground">
        {category.percentage.toFixed(1)}%
      </span>
    </div>
    <div className="w-full bg-muted h-2">
      <div
        className="bg-foreground h-2 transition-all duration-300"
        style={{ width: `${category.percentage}%` }}
      />
    </div>
    <div className="text-xs text-muted-foreground">
      ${category.revenue.toLocaleString()}
    </div>
  </div>
))}
```

---

### Artifact Canvas (Container)

**File**: `apps/example/src/components/canvas/artifact-canvas.tsx`

Base container for rendering artifacts as canvases.

**Purpose**:
- Provides consistent layout
- Handles artifact routing
- Manages canvas visibility
- Integrates with chat interface

---

## Canvas System Architecture

### 1. Artifact Definition

Define data schema using Zod:

```typescript
import { artifact } from "ai-sdk-tools"
import { z } from "zod"

export const MyArtifact = artifact(
  "my-dashboard",
  z.object({
    title: z.string(),
    stage: z.enum(["loading", "complete"]),
    data: z.object({
      // Your data structure
    })
  })
)
```

### 2. Canvas Component

Create visualization component:

```tsx
"use client"

import { useArtifact } from "ai-sdk-tools/client"
import { MyArtifact } from "@/ai/artifacts/my-artifact"
import { Card, CardContent } from "@/components/ui/card"

export function MyCanvas() {
  const artifact = useArtifact(MyArtifact)

  if (!artifact.data) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent>
          {/* Your visualization */}
        </CardContent>
      </Card>
    </div>
  )
}
```

### 3. Registration

Register in canvas index:

```tsx
// apps/example/src/components/canvas/index.ts
export { BalanceSheetCanvas } from "./balance-sheet-canvas"
export { RevenueCanvas } from "./revenue-canvas"
export { MyCanvas } from "./my-canvas"
```

---

## Loading States & Stages

### Stage Types

```typescript
type Stage = "loading" | "processing" | "analyzing" | "complete"
```

### Progress Toast Integration

```tsx
const isLoading = data.stage !== "complete"

<ProgressToast
  isVisible={isLoading}
  stage={data.stage}
  message={isLoading ? `${data.stage}...` : undefined}
/>
```

### Stage Messaging

- `loading` → "Initializing..."
- `processing` → "Processing data..."
- `analyzing` → "Analyzing..."
- `complete` → Hidden (no toast)

---

## Chart Integration

### Recharts Components

Available from `recharts`:
- `BarChart`, `LineChart`, `AreaChart`, `PieChart`
- `XAxis`, `YAxis`, `CartesianGrid`
- `Tooltip`, `Legend`
- `Bar`, `Line`, `Area`, `Pie`

### Theme-Aware Charts

Use ChartContainer for automatic theming:

```tsx
import { ChartContainer } from "@/components/ui/chart"

const chartConfig = {
  dataKey: {
    label: "Label",
    theme: {
      light: "hsl(0 0% 0%)",
      dark: "hsl(0 0% 100%)"
    }
  }
}

<ChartContainer config={chartConfig} className="h-[300px]">
  <BarChart data={data}>
    {/* Chart components */}
  </BarChart>
</ChartContainer>
```

### Formatting Tips

**Y-Axis Number Formatting**:
```tsx
<YAxis
  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
/>
```

**Tooltip Formatting**:
```tsx
<ChartTooltip
  content={
    <ChartTooltipContent
      formatter={(value) => [
        `$${value.toLocaleString()}`,
        "Label"
      ]}
    />
  }
/>
```

**Number Display**:
```tsx
{value.toLocaleString()} // 1,234,567
{value.toFixed(2)}        // 1234.56
```

---

## Styling Guidelines

### Layout Pattern

```tsx
<div className="h-full overflow-auto p-6 space-y-6">
  {/* Header */}
  <div className="space-y-1">
    <h2 className="text-2xl tracking-tight font-mono">{title}</h2>
  </div>

  {/* Content sections with vertical spacing */}
  <Card>{/* Section 1 */}</Card>
  <Card>{/* Section 2 */}</Card>

  {/* Progress toast */}
  <ProgressToast />
</div>
```

### Card Styling for Dashboards

```tsx
// Minimal card (no shadow, no border)
<Card className="border-0 shadow-none">

// Transparent card for section grouping
<Card className="gap-0 rounded-none bg-transparent border-0 shadow-none">
```

### Typography for Financial Data

```tsx
// Numbers
<span className="font-mono">
  {value.toLocaleString()}
</span>

// Labels
<span className="text-xs text-muted-foreground">
  Label
</span>

// Headers
<h4 className="text-xs font-medium text-muted-foreground">
  Section Title
</h4>
```

### Grid Layouts for KPIs

```tsx
<div className="grid grid-cols-2 gap-4">
  <Card>{/* KPI 1 */}</Card>
  <Card>{/* KPI 2 */}</Card>
  <Card>{/* KPI 3 */}</Card>
  <Card>{/* KPI 4 */}</Card>
</div>
```

---

## Best Practices

### Data Display

1. **Use font-mono for numbers** - Ensures alignment
2. **Format currency consistently** - `toLocaleString()` for readability
3. **Show loading states** - Never render incomplete data
4. **Handle missing data** - Graceful fallbacks
5. **Use progress indicators** - Let users know data is loading

### Chart Design

1. **Monochrome theme** - Black/white for professional look
2. **Remove unnecessary lines** - `tickLine={false}`, `axisLine={false}`
3. **Format axis labels** - Keep them concise (e.g., "50k" not "50000")
4. **Responsive sizing** - Use height classes like `h-[300px]`
5. **Accessible tooltips** - Clear labels and formatted values

### Performance

1. **Memoize calculations** - Use `useMemo` for derived data
2. **Lazy load charts** - Only render visible charts
3. **Optimize re-renders** - Use React.memo for static sections
4. **Stream data** - Support progressive loading
5. **Handle large datasets** - Paginate or virtualize when needed

---

## See Also

- [Artifact System Guide](../guides/artifact-system.md) - Creating artifact schemas
- [UI Components](./ui-components.md) - Available UI components
- [Custom Dashboards Guide](../guides/custom-dashboards.md) - Step-by-step tutorial
- [Branding & Theme](./branding-theme.md) - Design system
