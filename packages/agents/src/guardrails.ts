import type { InputGuardrail, OutputGuardrail } from "./types.js";

/**
 * Base error class for all agent errors
 */
export class AgentsError extends Error {
  constructor(
    message: string,
    public readonly state?: unknown,
  ) {
    super(message);
    this.name = "AgentsError";
  }
}

/**
 * Error thrown when input guardrail tripwire is triggered
 */
export class InputGuardrailTripwireTriggered extends AgentsError {
  constructor(
    public readonly guardrailName: string,
    public readonly outputInfo?: unknown,
    state?: unknown,
  ) {
    super(`Input guardrail tripwire triggered: ${guardrailName}`, state);
    this.name = "InputGuardrailTripwireTriggered";
  }
}

/**
 * Error thrown when output guardrail tripwire is triggered
 */
export class OutputGuardrailTripwireTriggered extends AgentsError {
  constructor(
    public readonly guardrailName: string,
    public readonly outputInfo?: unknown,
    state?: unknown,
  ) {
    super(`Output guardrail tripwire triggered: ${guardrailName}`, state);
    this.name = "OutputGuardrailTripwireTriggered";
  }
}

/**
 * Error thrown when a guardrail fails to execute
 */
export class GuardrailExecutionError extends AgentsError {
  constructor(
    public readonly guardrailName: string,
    public readonly originalError: Error,
    state?: unknown,
  ) {
    super(
      `Guardrail execution failed: ${guardrailName} - ${originalError.message}`,
      state,
    );
    this.name = "GuardrailExecutionError";
  }
}

/**
 * Error thrown when maximum turns are exceeded
 */
export class MaxTurnsExceededError extends AgentsError {
  constructor(
    public readonly currentTurns: number,
    public readonly maxTurns: number,
    state?: unknown,
  ) {
    super(`Maximum turns exceeded: ${currentTurns}/${maxTurns}`, state);
    this.name = "MaxTurnsExceededError";
  }
}

/**
 * Error thrown when a tool call fails
 */
export class ToolCallError extends AgentsError {
  constructor(
    public readonly toolName: string,
    public readonly originalError: Error,
    state?: unknown,
  ) {
    super(`Tool call failed: ${toolName} - ${originalError.message}`, state);
    this.name = "ToolCallError";
  }
}

/**
 * Error thrown for tool permission denial
 */
export class ToolPermissionDeniedError extends AgentsError {
  constructor(
    public readonly toolName: string,
    public readonly reason: string,
    state?: unknown,
  ) {
    super(`Tool permission denied: ${toolName} - ${reason}`, state);
    this.name = "ToolPermissionDeniedError";
  }
}

/**
 * Run input guardrails in parallel
 */
export async function runInputGuardrails(
  guardrails: InputGuardrail[],
  input: string,
  context?: unknown,
): Promise<void> {
  if (!guardrails || guardrails.length === 0) return;

  const results = await Promise.allSettled(
    guardrails.map(async (guardrail) => {
      try {
        const result = await guardrail.execute({ input, context });
        if (result.tripwireTriggered) {
          throw new InputGuardrailTripwireTriggered(
            guardrail.name,
            result.outputInfo,
          );
        }
        return result;
      } catch (error) {
        if (error instanceof InputGuardrailTripwireTriggered) {
          throw error;
        }
        throw new GuardrailExecutionError(
          guardrail.name,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  // Check for failures
  for (const result of results) {
    if (result.status === "rejected") {
      throw result.reason;
    }
  }
}

/**
 * Run output guardrails in parallel
 */
export async function runOutputGuardrails<TOutput = unknown>(
  guardrails: OutputGuardrail<TOutput>[],
  agentOutput: TOutput,
  context?: unknown,
): Promise<void> {
  if (!guardrails || guardrails.length === 0) return;

  const results = await Promise.allSettled(
    guardrails.map(async (guardrail) => {
      try {
        const result = await guardrail.execute({ agentOutput, context });
        if (result.tripwireTriggered) {
          throw new OutputGuardrailTripwireTriggered(
            guardrail.name,
            result.outputInfo,
          );
        }
        return result;
      } catch (error) {
        if (error instanceof OutputGuardrailTripwireTriggered) {
          throw error;
        }
        throw new GuardrailExecutionError(
          guardrail.name,
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    }),
  );

  // Check for failures
  for (const result of results) {
    if (result.status === "rejected") {
      throw result.reason;
    }
  }
}
