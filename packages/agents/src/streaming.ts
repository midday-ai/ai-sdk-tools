/**
 * Type-safe streaming utilities for agent orchestration
 *
 * This module provides helper functions for writing custom data parts
 * to the UI message stream following the AI SDK's streaming data pattern.
 */

import type { UIMessageStreamWriter } from "ai";
import type { AgentDataParts } from "./types.js";

/**
 * Write a typed data part to the stream.
 *
 * This helper provides type-safe access to agent data parts while handling
 * the necessary type assertions for AI SDK's internal types.
 *
 * @template K - Key of the data part type
 * @param writer - The UI message stream writer
 * @param type - The data part type (e.g., 'data-agent-status')
 * @param data - The data payload
 * @param options - Additional options (transient, id for reconciliation)
 *
 * @example
 * ```typescript
 * writeDataPart(writer, 'data-agent-status', {
 *   status: 'executing',
 *   agent: 'analytics'
 * }, { transient: true });
 * ```
 */
export function writeDataPart<K extends keyof AgentDataParts>(
  writer: UIMessageStreamWriter,
  type: `data-${K}`,
  data: AgentDataParts[K],
  options?: { transient?: boolean; id?: string },
): void {
  writer.write({
    type,
    data,
    ...options,
  } as never);
}

/**
 * Write a transient agent status update.
 *
 * Status updates are ephemeral and won't be added to message history.
 * They're only available via the onData callback in useChat.
 *
 * @param writer - The UI message stream writer
 * @param status - The status update data
 *
 * @example
 * ```typescript
 * writeAgentStatus(writer, {
 *   status: 'routing',
 *   agent: 'orchestrator'
 * });
 * ```
 */
export function writeAgentStatus(
  writer: UIMessageStreamWriter,
  status: AgentDataParts["agent-status"],
): void {
  writeDataPart(writer, "data-agent-status", status, { transient: true });
}

/**
 * Write a transient rate limit update.
 *
 * Rate limit updates are ephemeral and won't be added to message history.
 * They're only available via the onData callback in useChat.
 *
 * @param writer - The UI message stream writer
 * @param rateLimit - The rate limit data
 *
 * @example
 * ```typescript
 * writeRateLimit(writer, {
 *   limit: 100,
 *   remaining: 95,
 *   reset: '2024-01-01T00:00:00Z'
 * });
 * ```
 */
export function writeRateLimit(
  writer: UIMessageStreamWriter,
  rateLimit: AgentDataParts["rate-limit"],
): void {
  writeDataPart(writer, "data-rate-limit", rateLimit, { transient: true });
}

/**
 * Write transient suggested prompts.
 *
 * Suggested prompts are ephemeral and won't be added to message history.
 * They're only available via the onData callback in useChat.
 *
 * @param writer - The UI message stream writer
 * @param prompts - Array of suggested prompt strings
 *
 * @example
 * ```typescript
 * writeSuggestions(writer, [
 *   'Show me the balance sheet',
 *   'What is our burn rate?',
 *   'Analyze revenue trends'
 * ]);
 * ```
 */
export function writeSuggestions(
  writer: UIMessageStreamWriter,
  prompts: string[],
): void {
  writeDataPart(writer, "data-suggestions", { prompts }, { transient: true });
}
