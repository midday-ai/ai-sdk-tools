"use client";

import type { ArtifactData } from "ai-sdk-tools/client";
import { parseAsInteger, useQueryState } from "nuqs";

interface ArtifactVersionSelectProps {
  versions: ArtifactData[];
  paramName?: string;
}

export function ArtifactVersionSelect({
  versions,
  paramName = "version",
}: ArtifactVersionSelectProps) {
  const [selectedVersion, setSelectedVersion] = useQueryState(
    paramName,
    parseAsInteger.withDefault(0),
  );

  if (versions.length <= 1) {
    return null;
  }

  return (
    <select
      value={selectedVersion}
      onChange={(e) => setSelectedVersion(parseInt(e.target.value, 10))}
      className="mt-1 text-xs bg-transparent border border-border rounded px-2 py-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {versions.map((version, index) => {
        const payload = version.payload as { description?: string } | undefined;
        const description = payload?.description;
        return (
          <option key={version.id} value={index}>
            {description || `Version ${index + 1}`}
          </option>
        );
      })}
    </select>
  );
}
