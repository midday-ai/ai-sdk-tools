/**
 * Context Management using AI SDK's experimental_context
 *
 * This provides type-safe context that flows through tools via AI SDK's
 * built-in experimental_context parameter.
 *
 * Key features:
 * - Uses AI SDK's official context mechanism
 * - Fully flexible user context - pass ANY type you want (object, string, class instance, etc.)
 * - Stream writer for artifacts and real-time updates
 * - Type-safe with full TypeScript support
 * - Available in all tools via executionOptions.experimental_context
 */

import type { UIMessageStreamWriter } from "ai";

/**
 * Core execution context that flows through tools via AI SDK
 *
 * This merges your custom context with required system fields.
 * Your context fields are available at the top level alongside writer and metadata.
 *
 * @template TContext - Your custom context type (must be an object)
 */
export type ExecutionContext<
  TContext extends Record<string, any> = Record<string, unknown>,
> = TContext & {
  /** Stream writer for real-time updates and artifacts */
  writer: UIMessageStreamWriter;

  /** Metadata about the current execution */
  metadata?: {
    /** Current agent name */
    agent?: string;
    /** Execution start time */
    startTime?: Date;
    /** Request ID for tracing */
    requestId?: string;
    /** Any custom metadata */
    [key: string]: unknown;
  };
};

/**
 * Type-safe context creator options
 *
 * @template TContext - Your custom context type (must be an object)
 */
export interface ContextOptions<
  TContext extends Record<string, any> = Record<string, unknown>,
> {
  /** Your custom application context - spread at the top level */
  context: TContext;

  /** Stream writer (required in streaming mode) */
  writer: UIMessageStreamWriter;

  /** Metadata */
  metadata?: ExecutionContext<TContext>["metadata"];
}

/**
 * Create an execution context to pass to AI SDK's experimental_context
 *
 * Your context object is spread at the top level, merged with writer and metadata.
 * This means you can access your fields directly without a wrapper.
 *
 * @template TContext - Your custom context type (must be an object)
 *
 * @example Basic usage
 * ```typescript
 * const context = createExecutionContext({
 *   context: { userId: '123', db: database, permissions: ['read', 'write'] },
 *   writer: streamWriter
 * });
 * // Access in tools: executionOptions.experimental_context.userId
 * ```
 *
 * @example With typed context
 * ```typescript
 * interface MyAppContext {
 *   tenant: string;
 *   workspace: string;
 *   features: string[];
 * }
 *
 * const context = createExecutionContext<MyAppContext>({
 *   context: { tenant: 'acme', workspace: 'main', features: ['analytics'] },
 *   writer: streamWriter
 * });
 * // Access in tools: executionOptions.experimental_context.tenant
 * ```
 *
 * @example With metadata
 * ```typescript
 * const context = createExecutionContext({
 *   context: { userId: '123', tenantId: 'acme' },
 *   writer: streamWriter,
 *   metadata: { agent: 'reports', requestId: 'req_123' }
 * });
 * ```
 */
export function createExecutionContext<
  TContext extends Record<string, any> = Record<string, unknown>,
>(options: ContextOptions<TContext>): ExecutionContext<TContext> {
  return {
    ...options.context,
    writer: options.writer,
    metadata: {
      startTime: new Date(),
      ...options.metadata,
    },
  } as ExecutionContext<TContext>;
}

/**
 * Get your custom context from execution options
 *
 * Your context fields are available directly in experimental_context (no wrapper).
 * This helper provides type-safe access.
 *
 * @template T - Your custom context type (object)
 * @param executionOptions - Tool execution options from AI SDK
 * @returns Your custom context
 *
 * @example Direct access (no helper needed)
 * ```typescript
 * export const myTool = tool({
 *   execute: async (params, executionOptions) => {
 *     // Access fields directly
 *     const userId = executionOptions.experimental_context.userId;
 *     const db = executionOptions.experimental_context.db;
 *   }
 * });
 * ```
 *
 * @example With typed helper
 * ```typescript
 * interface AppContext {
 *   userId: string;
 *   tenantId: string;
 *   db: Database;
 * }
 *
 * export const myTool = tool({
 *   execute: async (params, executionOptions) => {
 *     const { userId, tenantId, db } = getContext<AppContext>(executionOptions);
 *     const user = await db.users.findOne(userId);
 *   }
 * });
 * ```
 */
export function getContext<T extends Record<string, any> = Record<string, any>>(
  executionOptions?: any,
): T {
  // AI SDK passes context via experimental_context
  return executionOptions?.experimental_context as T;
}
