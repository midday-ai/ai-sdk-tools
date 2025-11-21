"use client";

import { useArtifacts } from "ai-sdk-tools/client";
import { X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const ARTIFACT_TYPE_LABELS: Record<string, string> = {
  revenue: "Revenue",
  "balance-sheet": "Balance Sheet",
};

export function ArtifactTypeTabs() {
  const [selectedType, setSelectedType] = useQueryState(
    "artifact-type",
    parseAsString,
  );

  const [data, actions] = useArtifacts({
    value: selectedType ?? undefined,
    onChange: (v: string | null) => setSelectedType(v ?? null),
  });

  const { available, activeType } = data;

  const handleTabClick = useCallback(
    (type: string) => {
      actions.setValue(type);
      setSelectedType(type);
    },
    [actions, setSelectedType],
  );

  const handleDismiss = useCallback(
    (e: React.MouseEvent, type: string) => {
      e.stopPropagation();

      // If dismissing the active type, switch to another available type or close
      if (type === activeType) {
        const otherTypes = available.filter((t) => t !== type);
        if (otherTypes.length > 0) {
          actions.setValue(otherTypes[0]);
          setSelectedType(otherTypes[0]);
        } else {
          // No other types available, close canvas
          actions.setValue(null);
          setSelectedType(null);
        }
      }

      actions.dismiss(type);
    },
    [activeType, available, actions, setSelectedType],
  );

  if (available.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 py-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 overflow-x-auto">
      {available.map((type) => {
        const isActive = type === activeType;
        const label = ARTIFACT_TYPE_LABELS[type] || type;

        return (
          <div
            key={type}
            className={cn(
              "group flex items-center gap-2 px-3 h-12 text-sm font-medium transition-all whitespace-nowrap",
              isActive
                ? "bg-muted text-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <button
              type="button"
              onClick={() => handleTabClick(type)}
              className="text-left h-full flex items-center"
              aria-label={`Switch to ${label}`}
            >
              {label}
            </button>
            <button
              type="button"
              className="h-4 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 focus:w-4 focus:opacity-100 transition-all overflow-hidden hover:bg-destructive/20 hover:text-destructive focus:bg-destructive/20 focus:text-destructive flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={(e) => handleDismiss(e, type)}
              aria-label={`Close ${label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
