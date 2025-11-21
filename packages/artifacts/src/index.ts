// Core exports (server-safe - no React hooks)
export { artifact } from "./artifact";
export { getWriter } from "./context";
export { StreamingArtifact } from "./streaming";

// Type exports
export type {
  ArtifactCallbacks,
  ArtifactConfig,
  ArtifactData,
  ArtifactStatus,
  UseArtifactActions,
  UseArtifactReturn,
  UseArtifactsActions,
  UseArtifactsOptions,
  UseArtifactsReturn,
} from "./types";

// Error exports
export { ArtifactError } from "./types";
