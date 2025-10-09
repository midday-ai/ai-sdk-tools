"use client";

import { useArtifacts } from "@ai-sdk-tools/artifacts/client";
import { X } from "lucide-react";
import { BalanceSheetCanvas } from "./balance-sheet-canvas";
import { RevenueCanvas } from "./revenue-canvas";

interface ArtifactCanvasProps {
  onClose?: () => void;
}

export function ArtifactCanvas({ onClose }: ArtifactCanvasProps) {
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
    <div className="relative h-full bg-background border-l">
      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center rounded-md p-2 hover:bg-accent transition-colors"
          aria-label="Close canvas"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Canvas content */}
      {renderCanvas()}
    </div>
  );
}
