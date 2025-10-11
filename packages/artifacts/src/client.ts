// Client-side exports (includes React hooks)

// Re-export all other exports from main index
export { artifact } from "./artifact";
export { getWriter } from "./context";
export { useArtifact, useArtifacts } from "./hooks";
export { StreamingArtifact } from "./streaming";

// Type exports
export type {
  ArtifactCallbacks,
  ArtifactConfig,
  ArtifactData,
  ArtifactStatus,
  UseArtifactReturn,
  UseArtifactsOptions,
  UseArtifactsReturn,
} from "./types";

// Error exports
export { ArtifactError } from "./types";
