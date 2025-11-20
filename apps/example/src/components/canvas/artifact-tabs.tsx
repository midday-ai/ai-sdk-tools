"use client";

import { X } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

// ArtifactData type from artifacts package
interface ArtifactData<T = unknown> {
  id: string;
  type: string;
  status: string;
  payload: T;
  version: number;
  progress?: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

interface ArtifactTabsProps<T = unknown> {
  versions: ArtifactData<T>[];
  paramName?: string;
  onDelete?: (artifactId: string) => void;
}

export function ArtifactTabs<T = unknown>({
  versions,
  paramName = "version",
  onDelete,
}: ArtifactTabsProps<T>) {
  const [currentIndex, setCurrentIndex] = useQueryState(
    paramName,
    parseAsInteger.withDefault(0),
  );

  // Clamp current index to valid range
  const clampedIndex = Math.max(0, Math.min(currentIndex, versions.length - 1));
  const activeIndex = versions.length > 0 ? clampedIndex : 0;

  const handleTabClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDelete = useCallback(
    (e: React.MouseEvent, artifactId: string, index: number) => {
      e.stopPropagation();

      // Call the delete function
      onDelete?.(artifactId);

      // Adjust current index if needed
      if (index === activeIndex && versions.length > 1) {
        // If deleting the active tab, switch to previous or next
        const newIndex = index > 0 ? index - 1 : 0;
        setCurrentIndex(newIndex);
      } else if (index < activeIndex) {
        // If deleting a tab before the active one, adjust index
        setCurrentIndex(activeIndex - 1);
      }
    },
    [onDelete, activeIndex, versions.length, setCurrentIndex],
  );

  if (versions.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 overflow-x-auto">
      {versions.map((version, index) => {
        const isActive = index === activeIndex;
        const title =
          (version.payload as { title?: string })?.title ||
          `Version ${index + 1}`;

        return (
          <div
            key={version.id}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap",
              isActive
                ? "bg-muted text-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <button
              type="button"
              onClick={() => handleTabClick(index)}
              className="flex-1 text-left"
              aria-label={`Go to ${title}`}
            >
              {title}
            </button>
            {isActive && (
              <button
                type="button"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive flex items-center justify-center"
                onClick={(e) => handleDelete(e, version.id, index)}
                aria-label={`Delete ${title}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
