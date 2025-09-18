// Core exports (server-safe - no React hooks)
export { artifact } from "./artifact";
export {
  artifacts,
  createTypedContext,
} from "./context";
export { StreamingArtifact } from "./streaming";

// Type exports
export type {
  ArtifactCallbacks,
  ArtifactConfig,
  ArtifactData,
  ArtifactStatus,
  BaseContext,
  UseArtifactReturn,
  UseArtifactsOptions,
  UseArtifactsReturn,
} from "./types";

// Error exports
export { ArtifactError } from "./types";
