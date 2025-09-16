"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { BarChart3 } from "lucide-react";
import { BurnRateArtifact } from "@/ai/artifacts/burn-rate";

export function BurnRateAnalysisPanel() {
  const burnRateData = useArtifact(BurnRateArtifact);

  const hasAnalysisData =
    burnRateData?.data && burnRateData.data.stage === "complete";

  if (!burnRateData?.data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Monthly Burn Rate Trend</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Interactive chart will appear here</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Current Monthly Burn
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            $
            {burnRateData.data.summary?.currentBurnRate?.toLocaleString() ||
              "0"}
          </div>
          <div className="text-sm text-green-600">+12.1% vs last month</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Runway</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {burnRateData.data.summary?.averageRunway || 0} months
          </div>
          <div className="text-sm text-orange-600">Below 6 month threshold</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Average Monthly Burn
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            $
            {burnRateData.data.summary?.currentBurnRate?.toLocaleString() ||
              "0"}
          </div>
          <div className="text-sm text-gray-500">Over last 6 months</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cash Position
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            $0
          </div>
          <div className="text-sm text-blue-600">Current balance</div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Summary</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {burnRateData.data.summary?.alerts?.join(". ") ||
            "Analysis summary will appear here..."}
        </p>
      </div>

      {/* Action Buttons */}
      {hasAnalysisData && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Show revenue breakdown
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Analyze profit margins
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Compare to last quarter
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Generate growth strategy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
