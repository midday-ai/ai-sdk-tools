"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useChat } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { ArrowLeft, MoreHorizontal, Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BurnRateArtifact } from "@/ai/artifacts/burn-rate";
import { BurnRateAnalysisPanel } from "./burn-rate-analysis-panel";
import { BurnRateChart } from "./burn-rate-chart";
import { BurnRateLoading } from "./burn-rate-loading";

export default function Chat() {
  const { messages, sendMessage, status } = useChat({
    enableBatching: true,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [input, setInput] = useState("");
  const [showBurnRateChart, setShowBurnRateChart] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Use the burn rate artifact with event listeners
  const burnRateData = useArtifact(BurnRateArtifact, {
    onStatusChange: (newStatus, oldStatus) => {
      if (newStatus === "loading" && oldStatus === "idle") {
        toast.loading("Starting burn rate analysis...", {
          id: "burn-rate-analysis",
        });
      } else if (newStatus === "complete" && oldStatus === "streaming") {
        const alerts = burnRateData?.data?.summary?.alerts?.length || 0;
        const recommendations =
          burnRateData?.data?.summary?.recommendations?.length || 0;
        toast.success(
          `Analysis complete! Found ${alerts} alerts and ${recommendations} recommendations.`,
          { id: "burn-rate-analysis" },
        );
      }
    },
    onUpdate: (newData, oldData) => {
      // Show different toasts based on stage changes
      if (newData.stage === "processing" && oldData?.stage === "loading") {
        toast.loading("Processing financial data...", {
          id: "burn-rate-analysis",
        });
      } else if (
        newData.stage === "analyzing" &&
        oldData?.stage === "processing"
      ) {
        toast.loading("Analyzing trends and generating insights...", {
          id: "burn-rate-analysis",
        });
      }
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error}`, {
        id: "burn-rate-analysis",
      });
    },
  });

  // Track when we have data to trigger animation
  useEffect(() => {
    if (burnRateData?.data && !hasData) {
      setHasData(true);
    }
  }, [burnRateData?.data, hasData]);

  const hasAnalysisData =
    burnRateData?.data && burnRateData.data.stage === "complete";

  return (
    <>
      <div
        className={`h-screen flex transition-all duration-700 ease-in-out ${
          hasData ? "flex-row" : "flex-col items-center justify-center"
        }`}
      >
        {/* Left Panel - Chat */}
        <div
          className={`${hasData ? "w-1/2" : "w-full max-w-2xl"} transition-all duration-700 ease-in-out flex flex-col h-full`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {hasData && (
                <button
                  type="button"
                  onClick={() => setHasData(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {hasData ? "Burn Rate Analysis" : "AI Burn Rate Analyzer"}
              </h1>
            </div>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !hasData && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Burn Rate Analyzer
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Ask me to analyze burn rate data and I'll create interactive
                  charts and insights
                </p>

                {/* Example prompts */}
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      setInput(
                        "Analyze burn rate for TechCorp with 6 months of data: Jan 2024: $50k revenue, $80k expenses, $200k cash. Feb: $55k revenue, $85k expenses, $170k cash. Mar: $60k revenue, $90k expenses, $140k cash. Apr: $65k revenue, $88k expenses, $117k cash. May: $70k revenue, $92k expenses, $95k cash. Jun: $75k revenue, $95k expenses, $75k cash.",
                      )
                    }
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    📊 Analyze TechCorp Burn Rate
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setInput(
                        "Create a burn rate analysis for StartupXYZ with monthly data showing declining runway",
                      )
                    }
                    className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    🚀 Startup Analysis
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setInput(
                        "Show me burn rate trends for a company with improving financial health",
                      )
                    }
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                  >
                    📈 Trend Analysis
                  </button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-50 dark:bg-blue-900/20 ml-8"
                    : "bg-gray-50 dark:bg-gray-800 mr-8"
                }`}
              >
                <div className="font-medium text-sm mb-2">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </div>
                <div className="space-y-2">
                  {message.parts.map((part, partIndex) => {
                    if (part.type === "text") {
                      return (
                        <span key={`${message.id}-part-${partIndex}`}>
                          {part.text}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}

            {/* Status indicator */}
            {status !== "ready" && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                {status === "streaming" && "AI is thinking..."}
                {status === "submitted" && "Processing..."}
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage({ text: input });
                  setInput("");
                }
              }}
              className="flex space-x-2"
            >
              <div className="flex-1 relative">
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <Plus className="h-4 w-4 text-gray-400" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status !== "ready"}
                  placeholder="Ask anything"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={status !== "ready" || !input.trim()}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel - Analysis */}
        {hasData && (
          <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
            {/* Analysis Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Analysis
              </h2>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Analysis Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {hasAnalysisData ? (
                <BurnRateAnalysisPanel />
              ) : (
                <BurnRateLoading />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Burn Rate Chart Modal */}
      {burnRateData?.data && (
        <BurnRateChart
          isOpen={showBurnRateChart}
          onClose={() => setShowBurnRateChart(false)}
        />
      )}

      <AIDevtools />
    </>
  );
}
