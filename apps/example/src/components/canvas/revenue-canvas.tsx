"use client";

import { useArtifact } from "ai-sdk-tools/client";
import { BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { memo, useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { RevenueArtifact } from "@/ai/artifacts/revenue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ProgressToast } from "@/components/ui/progress-toast";

// Chart configuration for monochrome theme - static, doesn't need to be recreated
const CHART_CONFIG = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "hsl(0 0% 0%)", // Black for light theme
      dark: "hsl(0 0% 100%)", // White for dark theme
    },
  },
};

function RevenueCanvasInner() {
  const [version] = useQueryState("version", parseAsInteger.withDefault(0));
  const [artifact] = useArtifact(RevenueArtifact, {
    version,
  });

  // Memoize chart data to prevent recalculation on every render
  const chartData = useMemo(() => {
    if (!artifact.data) return [];
    return artifact.data.data.monthlyRevenue.map(
      (month: { month: string; revenue: number }) => ({
        month: month.month,
        revenue: month.revenue,
      }),
    );
  }, [artifact.data]);

  if (!artifact.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Loading revenue data...
          </p>
        </div>
      </div>
    );
  }

  const data = artifact.data;
  const isLoading = data.stage !== "complete";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-2xl tracking-tight font-mono">
                Revenue trend
              </h2>
              {data.description && (
                <p className="text-sm text-muted-foreground">
                  {data.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <Card className="border-0 shadow-none">
          <CardContent>
            <ChartContainer config={CHART_CONFIG} className="h-[300px]">
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
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
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

          <Card className="shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <div>
                  <p className="text-xs text-muted-foreground">Growth Rate</p>
                  <p className="text-lg font-semibold">
                    {data.data.growthRate > 0 ? "+" : ""}
                    {data.data.growthRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <div>
                  <p className="text-xs text-muted-foreground">Avg Deal Size</p>
                  <p className="text-lg font-semibold">
                    ${data.data.averageDealSize.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <div>
                  <p className="text-xs text-muted-foreground">Top Customers</p>
                  <p className="text-lg font-semibold">
                    {data.data.topCustomers.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Category */}
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.data.revenueByCategory.map(
              (
                category: {
                  category: string;
                  revenue: number;
                  percentage: number;
                },
                _index: number,
              ) => (
                <div key={category.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {category.category}
                    </span>
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
              ),
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.data.topCustomers.map(
                (
                  customer: { name: string; revenue: number; deals: number },
                  _index: number,
                ) => (
                  <div
                    key={customer.name}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div>
                      <p className="text-xs font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.deals} deal{customer.deals !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-xs font-semibold">
                      ${customer.revenue.toLocaleString()}
                    </span>
                  </div>
                ),
              )}
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
    </div>
  );
}

export const RevenueCanvas = memo(RevenueCanvasInner);
