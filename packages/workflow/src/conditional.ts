// import type { FlowConfig, FlowData } from "./types";
import { workflows } from "./context";
import { workflow } from "./workflow";

export interface ConditionalFlowOptions<T> {
  requiresConfirmation?: (data: T) => boolean;
  skipForRoles?: string[];
  onlyForRoles?: string[];
  autoApproveCondition?: (data: T) => boolean;
  bypassInDevelopment?: boolean;
}

export interface FlowContext {
  userId?: string;
  userRole?: string;
  environment?: "development" | "staging" | "production";
  [key: string]: any;
}

/**
 * Execute a flow conditionally - only shows HITL when needed
 */
export async function withConditionalFlow<T>(
  flowDef: any, // Flow definition
  data: T,
  executeAction: (data: T) => Promise<string>,
  options: ConditionalFlowOptions<T> = {}
): Promise<string> {
  try {
    const context = workflows.getContext() as FlowContext;
    
    // Check environment bypass
    if (options.bypassInDevelopment && context.environment === "development") {
      return executeAction(data);
    }
    
    // Check role-based permissions
    if (options.skipForRoles?.includes(context.userRole || "")) {
      return executeAction(data);
    }
    
    if (options.onlyForRoles && !options.onlyForRoles.includes(context.userRole || "")) {
      return executeAction(data);
    }
    
    // Check if confirmation is required
    const needsConfirmation = options.requiresConfirmation 
      ? options.requiresConfirmation(data)
      : true; // Default to requiring confirmation
    
    if (!needsConfirmation) {
      return executeAction(data);
    }
    
    // Check auto-approve conditions
    if (options.autoApproveCondition && options.autoApproveCondition(data)) {
      return executeAction(data);
    }
    
    // Check flow-level auto-approve
    if (flowDef.shouldAutoApprove && flowDef.shouldAutoApprove(data)) {
      return executeAction(data);
    }
    
    // Use HITL flow
    const flowStream = flowDef.stream(data);
    const response = await flowStream.waitForResponse();
    
    switch (response) {
      case "approved":
        return executeAction(data);
      case "rejected":
        return "Operation cancelled by user.";
      case "timeout":
        return "Operation timed out waiting for confirmation.";
      case "cancelled":
        return "Operation was cancelled.";
      default:
        return `Unknown response: ${response}`;
    }
    
  } catch (error) {
    // If flow system fails, you can choose to:
    // 1. Fail the operation (secure)
    // 2. Execute anyway (permissive)
    // 3. Use fallback confirmation
    
    console.error("Flow system error:", error);
    
    // For high-risk operations, fail if flow system is unavailable
    if (options.requiresConfirmation && options.requiresConfirmation(data)) {
      throw new Error("Confirmation required but flow system unavailable");
    }
    
    // For low-risk operations, proceed
    return executeAction(data);
  }
}

/**
 * Create a flow that can be conditionally skipped
 */
export function conditionalFlow<T>(
  id: string,
  schema: any,
  conditions: {
    when?: (data: T) => boolean;
    unless?: (data: T) => boolean;
    priority?: "low" | "medium" | "high" | "critical";
    timeout?: number;
    autoApprove?: (data: T) => boolean;
  } = {}
) {
  const baseWorkflow = workflow({
    id,
    inputSchema: schema,
    priority: conditions.priority,
    timeout: conditions.timeout,
    autoApprove: conditions.autoApprove,
  });

  return {
    ...baseWorkflow,
    
    // Enhanced stream method with conditions
    stream(data: Partial<T> = {}) {
      const validated = schema.parse(data);
      
      // Check conditions
      if (conditions.when && !conditions.when(validated)) {
        // Skip flow - return a mock stream that auto-approves
        return {
          waitForResponse: async () => "approved" as const,
          approve: () => {},
          reject: () => {},
          cancel: () => {},
          getData: () => baseWorkflow.create(data),
        };
      }
      
      if (conditions.unless && conditions.unless(validated)) {
        // Skip flow - return a mock stream that auto-approves
        return {
          waitForResponse: async () => "approved" as const,
          approve: () => {},
          reject: () => {},
          cancel: () => {},
          getData: () => baseWorkflow.create(data),
        };
      }
      
      // Use normal workflow
      return baseWorkflow.stream(data);
    },
    
    // Check if flow should be shown for given data
    shouldShow(data: T): boolean {
      if (conditions.when && !conditions.when(data)) return false;
      if (conditions.unless && conditions.unless(data)) return false;
      return true;
    },
  };
}

/**
 * Batch conditional flows - only show flows that meet conditions
 */
export function filterConditionalFlows<T>(
  flowsArray: Array<{ flow: any; data: T }>,
  _context?: FlowContext
): Array<{ flow: any; data: T }> {
  return flowsArray.filter(({ flow, data }) => {
    if (flow.shouldShow) {
      return flow.shouldShow(data);
    }
    return true;
  });
}
