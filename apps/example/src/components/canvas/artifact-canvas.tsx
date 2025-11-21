"use client";

import { useArtifacts } from "ai-sdk-tools/client";
import { parseAsString, useQueryState } from "nuqs";
import { ArtifactTypeTabs } from "./artifact-type-tabs";
import { BalanceSheetCanvas } from "./balance-sheet-canvas";
import { RevenueCanvas } from "./revenue-canvas";

export function ArtifactCanvas() {
  const [selectedType, setSelectedType] = useQueryState(
    "artifact-type",
    parseAsString,
  );

  const [data] = useArtifacts({
    // Pass the query param value directly:
    // - null = query param removed (explicitly closed or never set)
    // - undefined = not possible with nuqs parseAsString
    // - string = open to specific type
    value: selectedType,
    onChange: (v) => setSelectedType(v ?? null),
  });

  // Only render if there are available artifacts
  if (data.available.length === 0) {
    return null;
  }

  const renderCanvas = () => {
    if (data.activeType === null) {
      return null;
    }

    switch (data.activeType) {
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
    <div className="relative h-full bg-background border-l font-mono flex flex-col">
      <ArtifactTypeTabs />
      {renderCanvas()}
    </div>
  );
}
