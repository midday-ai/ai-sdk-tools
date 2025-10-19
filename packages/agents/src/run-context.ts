/**
 * AgentRunContext
 * 
 * Tracks user context and metadata throughout agent workflows.
 */

export class AgentRunContext<TContext = Record<string, unknown>> {
  /**
   * The context object passed to the agent workflow
   */
  public context: TContext;

  /**
   * Additional metadata for the run
   */
  public metadata: Record<string, unknown>;

  constructor(context?: TContext) {
    this.context = (context || {}) as TContext;
    this.metadata = {};
  }

  /**
   * Serialize the run context to JSON
   */
  toJSON(): {
    context: TContext;
    metadata: Record<string, unknown>;
  } {
    return {
      context: this.context,
      metadata: this.metadata,
    };
  }
}
