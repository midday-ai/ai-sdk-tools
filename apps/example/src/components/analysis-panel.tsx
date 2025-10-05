"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { MoreHorizontal } from "lucide-react";
import { BurnRateArtifact } from "@/ai/artifacts/burn-rate";
import { BurnRateAnalysisPanel } from "./burn-rate-analysis-panel";
import { BurnRateLoading } from "./burn-rate-loading";

interface AnalysisPanelProps {
  title?: string;
}

export function AnalysisPanel({ title = "Analysis" }: AnalysisPanelProps) {
  const burnRateData = useArtifact(BurnRateArtifact);
  const hasAnalysisData = burnRateData?.data && burnRateData.data.stage === "complete";

  return (
    <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Analysis Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
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
  );
}
