# Custom Dashboards Guide

Step-by-step tutorial for building custom dashboards from scratch.

## Tutorial: Building a Customer Analytics Dashboard

We'll build a dashboard showing customer metrics, charts, and insights.

### Step 1: Plan Your Data Structure

Decide what data your dashboard needs:

```typescript
interface CustomerAnalytics {
  // Summary metrics
  totalCustomers: number
  activeCustomers: number
  churnRate: number
  avgLifetimeValue: number

  // Time series data
  customerGrowth: Array<{
    month: string
    new: number
    churned: number
    total: number
  }>

  // Segments
  customerSegments: Array<{
    segment: string
    count: number
    percentage: number
  }>

  // Top customers
  topCustomers: Array<{
    name: string
    revenue: number
    since: string
  }>
}
```

### Step 2: Create Artifact Schema

**File**: `src/ai/artifacts/customer-analytics.ts`

```typescript
import { artifact } from "ai-sdk-tools"
import { z } from "zod"

export const CustomerAnalytics = artifact(
  "customer-analytics",
  z.object({
    // Metadata
    title: z.string(),
    asOfDate: z.string(),
    stage: z.enum(["loading", "analyzing", "complete"]),

    // Data
    data: z.object({
      // Summary KPIs
      totalCustomers: z.number(),
      activeCustomers: z.number(),
      churnRate: z.number(),
      avgLifetimeValue: z.number(),

      // Charts
      customerGrowth: z.array(z.object({
        month: z.string(),
        new: z.number(),
        churned: z.number(),
        total: z.number(),
      })),

      // Segments
      customerSegments: z.array(z.object({
        segment: z.string(),
        count: z.number(),
        percentage: z.number(),
      })),

      // Top customers
      topCustomers: z.array(z.object({
        name: z.string(),
        revenue: z.number(),
        since: z.string(),
      })),
    })
  })
)

export type CustomerAnalytics = z.infer<typeof CustomerAnalytics>
```

### Step 3: Create Canvas Component

**File**: `src/components/canvas/customer-analytics-canvas.tsx`

```typescript
"use client"

import { useArtifact } from "ai-sdk-tools/client"
import { CustomerAnalytics } from "@/ai/artifacts/customer-analytics"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ProgressToast } from "@/components/ui/progress-toast"
import { LineChart, Line, XAxis, YAxis } from "recharts"
import { Users, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export function CustomerAnalyticsCanvas() {
  const artifact = useArtifact(CustomerAnalytics)

  // Loading state
  if (!artifact.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">
          Loading customer analytics...
        </p>
      </div>
    )
  }

  const data = artifact.data
  const isLoading = data.stage !== "complete"

  // Chart config
  const chartConfig = {
    total: {
      label: "Total Customers",
      theme: {
        light: "hsl(0 0% 0%)",
        dark: "hsl(0 0% 100%)"
      }
    }
  }

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b">
        <h2 className="text-2xl tracking-tight font-mono">
          {data.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          As of {data.asOfDate}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Customers
                </p>
                <p className="text-2xl font-semibold">
                  {data.data.totalCustomers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Active Customers
                </p>
                <p className="text-2xl font-semibold">
                  {data.data.activeCustomers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Churn Rate
                </p>
                <p className="text-2xl font-semibold">
                  {data.data.churnRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Avg Lifetime Value
                </p>
                <p className="text-2xl font-semibold">
                  ${data.data.avgLifetimeValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Customer Growth Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={data.data.customerGrowth}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="total"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Customer Segments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.data.customerSegments.map((segment) => (
            <div key={segment.segment} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  {segment.segment}
                </span>
                <span className="text-xs text-muted-foreground">
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted h-2">
                <div
                  className="bg-foreground h-2 transition-all"
                  style={{ width: `${segment.percentage}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {segment.count.toLocaleString()} customers
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Top Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.data.topCustomers.map((customer) => (
              <div
                key={customer.name}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div>
                  <p className="text-xs font-medium">
                    {customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Customer since {customer.since}
                  </p>
                </div>
                <span className="text-xs font-semibold">
                  ${customer.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Toast */}
      <ProgressToast
        isVisible={isLoading}
        stage={data.stage}
        message={isLoading ? `${data.stage}...` : undefined}
      />
    </div>
  )
}
```

### Step 4: Register Canvas

**File**: `src/components/canvas/index.ts`

```typescript
export { CustomerAnalyticsCanvas } from "./customer-analytics-canvas"
```

### Step 5: Test Your Dashboard

Create test data to verify the dashboard:

```typescript
const testData: CustomerAnalytics = {
  title: "Customer Analytics Dashboard",
  asOfDate: "2024-10-27",
  stage: "complete",
  data: {
    totalCustomers: 1250,
    activeCustomers: 980,
    churnRate: 5.2,
    avgLifetimeValue: 4500,
    customerGrowth: [
      { month: "Jan", new: 50, churned: 10, total: 1100 },
      { month: "Feb", new: 60, churned: 15, total: 1145 },
      // ... more months
    ],
    customerSegments: [
      { segment: "Enterprise", count: 150, percentage: 12 },
      { segment: "SMB", count: 500, percentage: 40 },
      { segment: "Startup", count: 600, percentage: 48 },
    ],
    topCustomers: [
      { name: "Acme Corp", revenue: 125000, since: "2022-01" },
      { name: "TechStart Inc", revenue: 98000, since: "2022-03" },
      // ... more customers
    ]
  }
}
```

## Best Practices

### Layout
- Use `p-6` padding for main container
- `space-y-6` for section spacing
- Grid layouts for KPIs (2 or 4 columns)

### Typography
- `font-mono` for numbers
- `text-xs` for labels
- `text-2xl` for main title
- `text-muted-foreground` for secondary text

### Cards
- Minimal styling: `border-0 shadow-none`
- Consistent padding: `p-4` or `p-6`
- Use CardHeader/CardContent for structure

### Charts
- Height: `h-[300px]` or `h-[400px]`
- Remove axis lines: `tickLine={false}`, `axisLine={false}`
- Use theme-aware colors via chartConfig

### Loading States
- Always check `!artifact.data`
- Show meaningful loading message
- Use ProgressToast for stages

## See Also

- [Dashboard Components](../component-reference/dashboard-components.md)
- [Artifact System](./artifact-system.md)
- [UI Components](../component-reference/ui-components.md)
