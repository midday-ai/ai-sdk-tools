// Client-side exports (includes React hooks)

// Re-export all other exports from main index
export { artifact } from "./artifact";
export {
  artifacts,
  createTypedContext,
} from "./context";
export { useArtifact } from "./hooks";
export { StreamingArtifact } from "./streaming";

// Type exports
export type {
  ArtifactCallbacks,
  ArtifactConfig,
  ArtifactData,
  ArtifactStatus,
  BaseContext,
  UseArtifactReturn,
} from "./types";

// Error exports
export { ArtifactError } from "./types";
