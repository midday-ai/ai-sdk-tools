"use client";

import type { UIMessage } from "ai";
import { useArtifacts } from "ai-sdk-tools/client";
import { BarChart3 } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import {
  extractArtifactIdFromMessage,
  extractArtifactTypeFromMessage,
} from "@/lib/extract-artifact-info";

const ARTIFACT_TYPE_LABELS: Record<string, string> = {
  revenue: "Revenue",
  "balance-sheet": "Balance Sheet",
};

interface MessageArtifactButtonProps {
  message: UIMessage;
}

export function MessageArtifactButton({ message }: MessageArtifactButtonProps) {
  const [data, actions] = useArtifacts();
  const [selectedType, setSelectedType] = useQueryState(
    "artifact-type",
    parseAsString,
  );
  const [selectedVersion, setSelectedVersion] = useQueryState(
    "version",
    parseAsInteger.withDefault(0),
  );

  const artifactType = extractArtifactTypeFromMessage(message);
  const artifactId = extractArtifactIdFromMessage(message);

  if (!artifactType || !artifactId) {
    return null;
  }

  const label = ARTIFACT_TYPE_LABELS[artifactType] || artifactType;

  // Find the artifact's index in the versions array
  const artifactsOfType = data.byType[artifactType] || [];
  const artifactIndex = artifactsOfType.findIndex(
    (artifact) => artifact.id === artifactId,
  );

  // Check if this exact artifact is active (both type and version match)
  const isActive =
    selectedType === artifactType &&
    artifactIndex >= 0 &&
    selectedVersion === artifactIndex;

  const handleClick = () => {
    actions.setValue(artifactType);
    setSelectedType(artifactType);
    // Navigate to the specific artifact version
    if (artifactIndex >= 0) {
      setSelectedVersion(artifactIndex);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
        isActive
          ? "text-primary hover:text-primary/80"
          : "text-muted-foreground hover:text-foreground"
      }`}
      aria-label={`Open ${label} canvas`}
      title={`Open ${label} canvas`}
    >
      <BarChart3 className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
