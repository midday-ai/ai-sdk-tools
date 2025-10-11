"use client";

import { useEffect, useState } from "react";

interface ToolCall {
  id: string;
  name: string;
  parameters: any;
  timestamp: string;
  duration: number;
  status: "pending" | "success" | "error";
}

interface PerformanceMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
}

export function DevtoolsDemo() {
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);
  const [selectedTab, setSelectedTab] = useState<"tools" | "metrics" | "logs">(
    "tools",
  );

  const mockToolCalls = [
    {
      name: "generateText",
      parameters: { prompt: "Hello world", model: "gpt-4" },
    },
    {
      name: "searchWeb",
      parameters: { query: "AI development tools", limit: 5 },
    },
    {
      name: "analyzeCode",
      parameters: { language: "typescript", file: "components.tsx" },
    },
    {
      name: "translateText",
      parameters: { text: "Hello", from: "en", to: "es" },
    },
    {
      name: "generateImage",
      parameters: { prompt: "A futuristic AI interface", style: "modern" },
    },
  ];

  const mockMetrics: PerformanceMetric[] = [
    { label: "Response Time", value: "245ms", trend: "down" },
    { label: "Token Usage", value: "1,234", trend: "up" },
    { label: "API Calls", value: "67", trend: "stable" },
    { label: "Cache Hit Rate", value: "89%", trend: "up" },
    { label: "Error Rate", value: "0.2%", trend: "down" },
  ];

  const simulateToolCall = () => {
    const randomTool =
      mockToolCalls[Math.floor(Math.random() * mockToolCalls.length)];
    const newCall: ToolCall = {
      id: Date.now().toString(),
      name: randomTool.name,
      parameters: randomTool.parameters,
      timestamp: new Date().toLocaleTimeString(),
      duration: Math.random() * 1000 + 100,
      status: "pending",
    };

    setToolCalls((prev) => [newCall, ...prev.slice(0, 9)]);

    // Simulate completion
    setTimeout(() => {
      setToolCalls((prev) =>
        prev.map((call) =>
          call.id === newCall.id
            ? {
                ...call,
                status: Math.random() > 0.1 ? "success" : ("error" as const),
              }
            : call,
        ),
      );
    }, newCall.duration);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to call simulateToolCall on mount
  useEffect(() => {
    // Start immediately with first call
    simulateToolCall();

    const interval = setInterval(
      () => {
        simulateToolCall();
      },
      Math.random() * 2000 + 500,
    );

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ToolCall["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getTrendIcon = (trend: PerformanceMetric["trend"]) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      case "stable":
        return "→";
    }
  };

  const getTrendColor = (trend: PerformanceMetric["trend"]) => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      case "stable":
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-[#0c0c0c] border border-[#2a2a2a] p-6 space-y-4 min-h-[420px]">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] pb-4 mb-4">
        <div className="text-xs text-secondary mb-4">◇ AI SDK Devtools</div>

        {/* Tabs */}
        <div className="flex space-x-4">
          {(["tools", "metrics", "logs"] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`text-xs px-3 py-1 border-b-2 transition-colors ${
                selectedTab === tab
                  ? "border-[#d4d4d4] text-[#d4d4d4]"
                  : "border-transparent text-secondary hover:text-[#d4d4d4]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {selectedTab === "tools" && (
          <div className="space-y-3">
            <div className="space-y-2 h-64 overflow-y-auto">
              {toolCalls.length === 0 ? (
                <div className="text-xs text-secondary py-8 text-center">
                  Monitoring for tool calls...
                </div>
              ) : (
                toolCalls.map((call) => (
                  <div
                    key={call.id}
                    className="bg-[#0c0c0c] border border-[#2a2a2a] p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{call.name}</span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs ${getStatusColor(call.status)}`}
                        >
                          {call.status}
                        </span>
                        <span className="text-xs text-secondary">
                          {call.timestamp}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-secondary">
                      Duration: {Math.round(call.duration)}ms
                    </div>
                    <div className="text-xs text-secondary">
                      Parameters:{" "}
                      {JSON.stringify(call.parameters, null, 2).slice(0, 60)}...
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedTab === "metrics" && (
          <div className="space-y-3">
            <div className="text-xs text-secondary">Performance Metrics</div>
            <div className="grid grid-cols-1 gap-3">
              {mockMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-[#0c0c0c] border border-[#2a2a2a] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary">
                      {metric.label}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#d4d4d4]">
                        {metric.value}
                      </span>
                      <span
                        className={`text-xs ${getTrendColor(metric.trend)}`}
                      >
                        {getTrendIcon(metric.trend)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "logs" && (
          <div className="space-y-3">
            <div className="text-xs text-secondary">Application Logs</div>
            <div className="bg-[#0c0c0c] border border-[#2a2a2a] p-3 h-64 overflow-y-auto font-mono">
              <div className="space-y-1 text-xs">
                <div className="text-green-400">
                  [INFO] AI SDK Devtools initialized
                </div>
                <div className="text-blue-400">
                  [DEBUG] Connecting to AI service...
                </div>
                <div className="text-green-400">
                  [INFO] Connection established
                </div>
                <div className="text-yellow-400">
                  [WARN] Rate limit approaching (80% used)
                </div>
                <div className="text-green-400">
                  [INFO] Tool call completed successfully
                </div>
                <div className="text-blue-400">
                  [DEBUG] Response cached for future use
                </div>
                <div className="text-green-400">
                  [INFO] State updated in store
                </div>
                <div className="text-green-400 animate-pulse">
                  [INFO] Monitoring active...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#2a2a2a] pt-4">
        <div className="text-xs text-secondary">
          └ Real-time debugging interface for AI SDK applications
        </div>
      </div>
    </div>
  );
}
