"use client";

import { useArtifacts } from "ai-sdk-tools/client";
import { BalanceSheetCanvas } from "./balance-sheet-canvas";
import { RevenueCanvas } from "./revenue-canvas";

export function ArtifactCanvas() {
  const { current } = useArtifacts();

  if (!current) {
    return null;
  }

  // Determine which canvas component to render based on artifact kind
  const renderCanvas = () => {
    switch (current.type) {
      case "balance-sheet":
        return <BalanceSheetCanvas />;
      case "revenue":
        return <RevenueCanvas />;
      // Add more artifact types here
      default:
        return null;
    }
  };

  return (
    <div className="relative h-full bg-background border-l font-mono">
      {renderCanvas()}
    </div>
  );
}
