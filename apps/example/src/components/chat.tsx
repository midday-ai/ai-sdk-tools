"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useChat, useChatActions } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BurnRateArtifact } from "@/ai/artifacts/burn-rate";
import { BurnRateChart } from "./burn-rate-chart";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { WelcomeScreen } from "./welcome-screen";
import { ChatInput } from "./chat-input";
import { AnalysisPanel } from "./analysis-panel";
import { FollowupQuestions } from "./followup-questions-panel";

export default function Chat() {
  // Initialize useChat to set up the transport and sync with store
  useChat({
    enableBatching: true,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  // Use store actions instead of direct useChat returns
  const { sendMessage } = useChatActions();
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

  const handlePromptClick = (prompt: string) => {
    sendMessage?.({ text: prompt });
  };

  const handleBackClick = () => {
    setHasData(false);
  };

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
          <ChatHeader hasData={hasData} onBackClick={handleBackClick} />
          
          <MessageList
            hasData={hasData}
            welcomeComponent={<WelcomeScreen onPromptClick={handlePromptClick} />}
          />
          
          {/* Follow-up Questions Pills */}
          <FollowupQuestions 
            onQuestionClick={(question) => {
              sendMessage?.({ text: question });
            }}
          />
          
          <ChatInput onSubmit={(input) => sendMessage?.({ text: input })} />
        </div>

        {/* Right Panel - Analysis */}
        {hasData && <AnalysisPanel />}
      </div>

      {/* Burn Rate Chart Modal */}
      {burnRateData?.data && (
        <BurnRateChart
          isOpen={showBurnRateChart}
          onClose={() => setShowBurnRateChart(false)}
        />
      )}

      <AIDevtools modelId="gpt-4o" />
    </>
  );
}
