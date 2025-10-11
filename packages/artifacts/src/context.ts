/**
 * Artifacts Writer Access
 *
 * Provides access to the stream writer from tool executionOptions.
 * The writer is needed to stream artifact updates to the client.
 *
 */

import type { UIMessageStreamWriter } from "ai";

/**
 * Get writer from execution context
 *
 * @param executionOptions - Tool execution options from AI SDK
 * @returns The stream writer
 *
 * @example
 * ```typescript
 * export const myTool = tool({
 *   execute: async (params, executionOptions) => {
 *     const writer = getWriter(executionOptions);
 *     const artifact = MyArtifact.stream(data, writer);
 *   }
 * });
 * ```
 */
export function getWriter(executionOptions?: any): UIMessageStreamWriter {
  // AI SDK passes context via experimental_context
  const writer = executionOptions?.experimental_context?.writer;

  if (!writer) {
    throw new Error(
      "Writer not available. Make sure you're passing executionOptions: getWriter(executionOptions)",
    );
  }

  return writer;
}
