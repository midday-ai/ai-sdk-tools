import type { UIMessageStreamWriter } from "ai";
import type { BaseContext } from "./types";
import { ArtifactError } from "./types";

class ArtifactSystem<TContext extends BaseContext = BaseContext> {
  private context: TContext | null = null;

  setContext<T extends BaseContext>(context: T): void {
    this.context = context as unknown as TContext;
  }

  getWriter(): UIMessageStreamWriter {
    if (!this.context?.writer) {
      throw new ArtifactError(
        "WRITER_NOT_AVAILABLE",
        "No artifact writer available. Make sure to set context with writer in your route handler before using artifacts.",
      );
    }
    return this.context.writer;
  }

  getContext(): TContext {
    if (!this.context) {
      throw new ArtifactError(
        "CONTEXT_NOT_SET",
        "Artifact context not available. Make sure to call setContext() in your route handler before using artifacts.",
      );
    }
    return this.context;
  }

  clearContext(): void {
    this.context = null;
  }

  isActive(): boolean {
    return this.context !== null;
  }
}

// Global artifact system instance
export const artifacts = new ArtifactSystem();

// Typed context helper factory
export function createTypedContext<T extends BaseContext>(
  validator?: (context: T) => boolean | string,
) {
  return {
    setContext: (context: T) => {
      if (validator) {
        const result = validator(context);
        if (result === false) {
          throw new ArtifactError(
            "CONTEXT_VALIDATION_FAILED",
            "Context validation failed",
          );
        }
        if (typeof result === "string") {
          throw new ArtifactError("CONTEXT_VALIDATION_FAILED", result);
        }
      }
      artifacts.setContext(context);
    },
    getContext: (): T => artifacts.getContext() as T,
    getWriter: () => artifacts.getWriter(),
    clearContext: () => artifacts.clearContext(),
    isActive: () => artifacts.isActive(),
  };
}
