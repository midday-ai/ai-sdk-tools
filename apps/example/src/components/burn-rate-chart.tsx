"use client";

import {
  AlertTriangle,
  CheckCircle,
  Minus,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  month: string;
  revenue: number;
  expenses: number;
  burnRate: number;
  runway: number;
}

interface Summary {
  currentBurnRate: number;
  averageRunway: number;
  trend: "improving" | "stable" | "declining";
  alerts: string[];
  recommendations: string[];
}

interface BurnRateChartProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  stage: "loading" | "processing" | "analyzing" | "complete";
  progress: number;
  chartData: ChartData[];
  summary?: Summary;
  currency: string;
}

export function BurnRateChart({
  isOpen,
  onClose,
  title,
  stage,
  progress,
  chartData,
  summary,
  currency,
}: BurnRateChartProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "insights">("chart");

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format month for display
  const formatMonth = (month: string) => {
    const date = new Date(`${month}-01`);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  // Get trend icon and color
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {stage === "complete" && summary && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(summary.trend)}
                <span
                  className={`text-sm font-medium ${getTrendColor(summary.trend)}`}
                >
                  {summary.trend}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {stage !== "complete" && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stage === "loading" && "Initializing..."}
                {stage === "processing" && "Processing data..."}
                {stage === "analyzing" && "Analyzing trends..."}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("chart")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "chart"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Charts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("insights")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "insights"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Insights
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === "chart" && (
              <div className="space-y-6">
                {/* Burn Rate Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Monthly Burn Rate
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          tickFormatter={formatMonth}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tickFormatter={(value) => formatCurrency(value)}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatCurrency(value),
                            name === "burnRate"
                              ? "Burn Rate"
                              : name === "revenue"
                                ? "Revenue"
                                : "Expenses",
                          ]}
                          labelFormatter={(month) => formatMonth(month)}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Revenue"
                        />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="Expenses"
                        />
                        <Line
                          type="monotone"
                          dataKey="burnRate"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="Burn Rate"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Runway Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Runway (Months)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          tickFormatter={formatMonth}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value: number) => [
                            `${value.toFixed(1)} months`,
                            "Runway",
                          ]}
                          labelFormatter={(month) => formatMonth(month)}
                        />
                        <Bar dataKey="runway" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "insights" && summary && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Current Burn Rate
                    </h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(summary.currentBurnRate)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Average Runway
                    </h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summary.averageRunway.toFixed(1)} months
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Trend
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(summary.trend)}
                      <span
                        className={`text-lg font-bold ${getTrendColor(summary.trend)}`}
                      >
                        {summary.trend}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {summary.alerts.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      Alerts
                    </h4>
                    <div className="space-y-2">
                      {summary.alerts.map((alert) => (
                        <div
                          key={`alert-${alert.slice(0, 20)}`}
                          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg"
                        >
                          <p className="text-red-800 dark:text-red-200 text-sm">
                            {alert}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {summary.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      {summary.recommendations.map((recommendation) => (
                        <div
                          key={`recommendation-${recommendation.slice(0, 20)}`}
                          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg"
                        >
                          <p className="text-green-800 dark:text-green-200 text-sm">
                            {recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
