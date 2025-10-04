import type { UIMessageStreamWriter } from "ai";
import type { BaseFlowContext } from "./types";
import { FlowError } from "./types";

class FlowSystem<TContext extends BaseFlowContext = BaseFlowContext> {
  private context: TContext | null = null;

  setContext<T extends BaseFlowContext>(context: T): void {
    this.context = context as unknown as TContext;
  }

  getWriter(): UIMessageStreamWriter {
    if (!this.context?.writer) {
      throw new FlowError(
        "WRITER_NOT_AVAILABLE",
        "No flow writer available. Make sure to set context with writer in your route handler before using flows.",
      );
    }
    return this.context.writer;
  }

  getContext(): TContext {
    if (!this.context) {
      throw new FlowError(
        "CONTEXT_NOT_SET",
        "Flow context not available. Make sure to call setContext() in your route handler before using flows.",
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

// Global workflow system instance
export const workflows = new FlowSystem();

// Typed context helper factory
export function createTypedWorkflowContext<T extends BaseFlowContext>(
  validator?: (context: T) => boolean | string,
) {
  return {
    setContext: (context: T) => {
      if (validator) {
        const result = validator(context);
        if (result === false) {
          throw new FlowError(
            "CONTEXT_VALIDATION_FAILED",
            "Context validation failed",
          );
        }
        if (typeof result === "string") {
          throw new FlowError("CONTEXT_VALIDATION_FAILED", result);
        }
      }
      workflows.setContext(context);
    },
    getContext: (): T => workflows.getContext() as T,
    getWriter: () => workflows.getWriter(),
    clearContext: () => workflows.clearContext(),
    isActive: () => workflows.isActive(),
  };
}
