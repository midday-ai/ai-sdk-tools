"use client";

import { useArtifacts } from "ai-sdk-tools/client";
import { ChevronDown, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
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
  const [selectedVersion, setSelectedVersion] = useQueryState(
    "version",
    parseAsInteger.withDefault(0),
  );

  const [data, actions] = useArtifacts({
    value: selectedType ?? undefined,
    onChange: (v: string | null) => setSelectedType(v ?? null),
  });

  const { available, activeType, byType } = data;

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

      // If this is the last tab, close the canvas
      if (available.length === 1) {
        actions.setValue(null);
        setSelectedType(null);
      } else if (type === activeType) {
        // If dismissing the active type, switch to another available type
        const otherTypes = available.filter((t) => t !== type);
        if (otherTypes.length > 0) {
          actions.setValue(otherTypes[0]);
          setSelectedType(otherTypes[0]);
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
    <div className="flex items-center gap-1 h-10 min-h-10 max-h-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 overflow-x-auto overflow-y-hidden">
      {available.map((type) => {
        const isActive = type === activeType;
        const label = ARTIFACT_TYPE_LABELS[type] || type;
        const versions = byType[type] || [];
        const hasMultipleVersions = versions.length > 1;

        return (
          <div
            key={type}
            className={cn(
              "group flex items-center px-3 h-10 text-sm font-medium transition-all whitespace-nowrap",
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
            {hasMultipleVersions ? (
              <div className="relative flex items-center justify-center size-4 ml-2">
                <select
                  value={Math.min(selectedVersion, versions.length - 1)}
                  onChange={(e) => {
                    setSelectedVersion(parseInt(e.target.value, 10));
                    if (!isActive) {
                      handleTabClick(type);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isActive) {
                      handleTabClick(type);
                    }
                  }}
                  className="h-full w-full appearance-none bg-transparent border-0 cursor-pointer pr-0 focus:outline-none opacity-0 absolute inset-0 z-10"
                  aria-label="Select version"
                >
                  {versions.map((version, index) => {
                    const payload = version.payload as
                      | { description?: string }
                      | undefined;
                    const description =
                      payload?.description || `Version ${index + 1}`;
                    return (
                      <option key={version.id} value={index}>
                        {description}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 pointer-events-none",
                    isActive ? "opacity-50" : "opacity-30",
                  )}
                />
              </div>
            ) : null}
            <button
              type="button"
              className="h-4 w-0 opacity-0 ml-0 group-hover:w-4 group-hover:opacity-100 group-hover:ml-2 focus:w-4 focus:opacity-100 focus:ml-2 transition-all overflow-hidden hover:bg-destructive/20 hover:text-destructive focus:bg-destructive/20 focus:text-destructive flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
