"use client";

import type { UIMessage } from "@ai-sdk/react";
import { useChatMessages, useChatActions } from "@ai-sdk-tools/store";
import { useEffect, useState, useMemo, useCallback } from "react";
import type { z } from "zod";
import type {
  FlowData,
  FlowStatus,
  UseFlowReturn,
  UseFlowsOptions,
  UseFlowsReturn,
  UseFlowOptions,
  FlowPriority,
} from "./types";
import { sortFlowsByPriority, isFlowComplete, isFlowActive } from "./utils";

// Type to extract the inferred type from a flow definition
type InferFlowType<T> = T extends { schema: z.ZodSchema<infer U> }
  ? U
  : never;

// Types for message parts that might contain flows
interface FlowPart<T = unknown> {
  type: string;
  data?: FlowData<T>;
}

export function useWorkflow<
  T extends { id: string; inputSchema: z.ZodSchema<unknown> },
>(
  workflowDef: T,
  options: UseFlowOptions<InferFlowType<T>> = {},
): UseFlowReturn<InferFlowType<T>> {
  const messages = useChatMessages();
  const { addToolResult } = useChatActions();

  const [currentFlow, setCurrentFlow] = useState<FlowData<
    InferFlowType<T>
  > | null>(null);

  const [timeRemaining, setTimeRemaining] = useState<number | undefined>();
  const [retryAttempts, setRetryAttempts] = useState(0);

  // Extract flows with memoization (following artifacts pattern)
  const flows = useMemo(() => 
    extractFlowsFromMessages<InferFlowType<T>>(
      messages,
      workflowDef.id,
    ), 
    [messages, workflowDef.id]
  );

  useEffect(() => {
    const latest = flows[0] || null;

    if (
      latest &&
      (!currentFlow || 
       latest.updatedAt > currentFlow.updatedAt)
    ) {
      const prevData = currentFlow?.payload || null;
      const prevStatus = currentFlow?.status || "idle";

      // Fire callbacks (matching artifacts pattern)
      if (options.onUpdate && latest.payload !== prevData) {
        options.onUpdate(latest.payload, prevData);
      }

      if (options.onStatusChange && latest.status !== prevStatus) {
        options.onStatusChange(latest.status, prevStatus, latest.payload);
      }

      if (options.onPending && latest.status === "pending" && prevStatus !== "pending") {
        options.onPending(latest.payload);
      }

      if (options.onApproved && latest.status === "approved" && prevStatus !== "approved") {
        options.onApproved(latest.payload, latest.metadata?.approvalReason as string);
      }

      if (options.onRejected && latest.status === "rejected" && prevStatus !== "rejected") {
        options.onRejected(latest.payload, latest.metadata?.rejectionReason as string);
      }

      if (options.onTimeout && latest.status === "timeout" && prevStatus !== "timeout") {
        options.onTimeout(latest.payload);
      }

      if (options.onCancelled && latest.status === "cancelled" && prevStatus !== "cancelled") {
        options.onCancelled(latest.payload);
      }

      if (options.onError && latest.status === "error" && prevStatus !== "error") {
        options.onError(latest.error || "Unknown error", latest.payload);
      }

      setCurrentFlow(latest);
    }
  }, [flows, currentFlow, options]);

  // Handle timeout countdown
  useEffect(() => {
    if (currentFlow?.status === "pending" && currentFlow.timeout) {
      const startTime = currentFlow.createdAt;
      const timeoutMs = currentFlow.timeout;
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, timeoutMs - elapsed);
        
        if (remaining === 0) {
          setTimeRemaining(undefined);
          clearInterval(interval);
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeRemaining(undefined);
    }
  }, [currentFlow]);

  // Action handlers (stable callbacks)
  const approve = useCallback(async (reason?: string) => {
    if (!currentFlow) return;
    
    await addToolResult({
      toolCallId: currentFlow.id,
      tool: `data-flow-${workflowDef.id}`,
      output: { action: "approve", reason },
    });
  }, [currentFlow, workflowDef.id, addToolResult]);

  const reject = useCallback(async (reason?: string) => {
    if (!currentFlow) return;
    
    await addToolResult({
      toolCallId: currentFlow.id,
      tool: `data-flow-${workflowDef.id}`,
      output: { action: "reject", reason },
    });
  }, [currentFlow, workflowDef.id, addToolResult]);

  const cancel = useCallback(async () => {
    if (!currentFlow) return;
    
    await addToolResult({
      toolCallId: currentFlow.id,
      tool: `data-flow-${workflowDef.id}`,
      output: { action: "cancel" },
    });
  }, [currentFlow, workflowDef.id, addToolResult]);

  const retry = useCallback(async () => {
    if (!currentFlow) return;
    
    setRetryAttempts(prev => prev + 1);
    await addToolResult({
      toolCallId: currentFlow.id,
      tool: `data-flow-${workflowDef.id}`,
      output: { action: "retry" },
    });
  }, [currentFlow, workflowDef.id, addToolResult]);

  // Auto-retry logic
  useEffect(() => {
    if (
      options.autoRetry && 
      currentFlow?.status === "timeout" && 
      retryAttempts < (options.retryCount || 3)
    ) {
      const delay = options.retryDelay || 2000;
      const timer = setTimeout(() => {
        retry();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentFlow?.status, retryAttempts, options.autoRetry, options.retryCount, options.retryDelay, retry]);

  const status: FlowStatus = currentFlow?.status || "idle";
  const isActive = status === "pending";
  const isPending = status === "pending";
  const isComplete = isFlowComplete(status);
  const hasData = currentFlow !== null;

  // Permission checks
  const canApprove = isPending;
  const canReject = isPending;
  const canCancel = isPending;
  const canRetry = status === "timeout" || status === "error";

  return {
    // Data
    data: currentFlow?.payload || null,
    
    // Status
    status,
    isActive,
    isPending,
    isComplete,
    hasData,
    timeRemaining,
    error: currentFlow?.error,
    metadata: currentFlow?.metadata,
    
    // Flow details
    id: currentFlow?.id || null,
    type: currentFlow?.type || null,
    action: currentFlow?.action || null,
    description: currentFlow?.description || null,
    priority: currentFlow?.priority || null,
    
    // Timestamps
    createdAt: currentFlow?.createdAt || null,
    updatedAt: currentFlow?.updatedAt || null,
    
    // Actions
    approve,
    reject,
    cancel,
    retry,
    
    // Permissions
    canApprove,
    canReject,
    canCancel,
    canRetry,
  };
}

export function useWorkflows(options: UseFlowsOptions = {}): UseFlowsReturn {
  const messages = useChatMessages();
  const { addToolResult } = useChatActions();

  return useMemo(() => {
    const allFlows = extractAllFlowsFromMessages(messages);

    // Filter flows based on options (following artifacts pattern)
    const filteredFlows = allFlows.filter(flow => {
      if (options.include?.length && !options.include.includes(flow.type)) return false;
      if (options.exclude?.length && options.exclude.includes(flow.type)) return false;
      if (options.priorityFilter?.length && !options.priorityFilter.includes(flow.priority)) return false;
      if (options.statusFilter?.length && !options.statusFilter.includes(flow.status)) return false;
      return true;
    });

    // Group by various criteria (following artifacts pattern)
    const byType: Record<string, FlowData<unknown>[]> = {};
    const byStatus = {} as Record<FlowStatus, FlowData<unknown>[]>;
    const byPriority = {} as Record<FlowPriority, FlowData<unknown>[]>;
    const latest: Record<string, FlowData<unknown>> = {};
    
    const pending: FlowData<unknown>[] = [];
    const active: FlowData<unknown>[] = [];
    const completed: FlowData<unknown>[] = [];

    for (const flow of filteredFlows) {
      if (!byType[flow.type]) {
        byType[flow.type] = [];
      }
      byType[flow.type].push(flow);

      if (!byStatus[flow.status]) {
        byStatus[flow.status] = [];
      }
      byStatus[flow.status].push(flow);

      if (!byPriority[flow.priority]) {
        byPriority[flow.priority] = [];
      }
      byPriority[flow.priority].push(flow);

      // Categorize by state
      if (isFlowActive(flow.status)) {
        pending.push(flow);
        active.push(flow);
      } else if (isFlowComplete(flow.status)) {
        completed.push(flow);
      }

      // Track latest for each type (artifacts pattern)
      if (
        !latest[flow.type] ||
        flow.updatedAt > latest[flow.type].updatedAt
      ) {
        const prevLatest = latest[flow.type];
        latest[flow.type] = flow;

        // Fire callback if this is a new or updated flow
        if (options.onFlow && (!prevLatest || 
                               flow.updatedAt > prevLatest.updatedAt)) {
          options.onFlow(flow.type, flow);
        }
      }
    }

    // Sort each type by creation time (artifacts pattern)
    for (const type in byType) {
      byType[type].sort((a, b) => b.createdAt - a.createdAt);
    }

    // Sort pending by priority
    const sortedPending = sortFlowsByPriority(pending);

    // Bulk actions
    const approveAll = async (reason?: string) => {
      await Promise.all(
        pending.map(flow => 
          addToolResult({
            toolCallId: flow.id,
            tool: `data-flow-${flow.type}`,
            output: { action: "approve", reason },
          })
        )
      );
    };

    const rejectAll = async (reason?: string) => {
      await Promise.all(
        pending.map(flow => 
          addToolResult({
            toolCallId: flow.id,
            tool: `data-flow-${flow.type}`,
            output: { action: "reject", reason },
          })
        )
      );
    };

    const cancelAll = async () => {
      await Promise.all(
        pending.map(flow => 
          addToolResult({
            toolCallId: flow.id,
            tool: `data-flow-${flow.type}`,
            output: { action: "cancel" },
          })
        )
      );
    };

    return {
      flows: filteredFlows,
      byType,
      byStatus,
      byPriority,
      pending: sortedPending,
      active,
      completed,
      latest,
      
      totalCount: filteredFlows.length,
      pendingCount: pending.length,
      activeCount: active.length,
      completedCount: completed.length,
      
      hasPending: pending.length > 0,
      hasActive: active.length > 0,
      allComplete: filteredFlows.length > 0 && completed.length === filteredFlows.length,
      
      approveAll,
      rejectAll,
      cancelAll,
    };
  }, [messages, options, addToolResult]);
}

// Optimized hooks for common use cases (following store pattern)
export const usePendingWorkflows = (options?: UseFlowsOptions) => {
  const workflows = useWorkflows(options);
  return useMemo(() => workflows.pending, [workflows.pending]);
};

export const useHasPendingWorkflows = (options?: UseFlowsOptions) => {
  const workflows = useWorkflows(options);
  return workflows.hasPending;
};

export const usePendingWorkflowCount = (options?: UseFlowsOptions) => {
  const workflows = useWorkflows(options);
  return workflows.pendingCount;
};

// Workflow by ID hook (following store pattern)
export const useWorkflowById = (workflowId: string) => {
  const messages = useChatMessages();
  
  return useMemo(() => {
    const allFlows = extractAllFlowsFromMessages(messages);
    const workflow = allFlows.find(f => f.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found for id: ${workflowId}`);
    }
    return workflow;
  }, [messages, workflowId]);
};

// Helper functions for extracting flows from messages
function extractAllFlowsFromMessages(
  messages: UIMessage[],
): FlowData<unknown>[] {
  const flows = new Map<string, FlowData<unknown>>();

  for (const message of messages) {
    if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        if (part.type.startsWith("data-flow-") && "data" in part) {
          const flowPart = part as FlowPart<unknown>;
          if (flowPart.data) {
            const existing = flows.get(flowPart.data.id);
            if (!existing || 
                flowPart.data.updatedAt > existing.updatedAt) {
              flows.set(flowPart.data.id, flowPart.data);
            }
          }
        }

        // Also check tool call results that might contain flows
        if (part.type.startsWith("tool-") && "result" in part && part.result) {
          const result = part.result;
          if (typeof result === "object" && result && "parts" in result) {
            const parts = (result as { parts?: FlowPart<unknown>[] }).parts;
            if (Array.isArray(parts)) {
              for (const nestedPart of parts) {
                if (
                  nestedPart.type.startsWith("data-flow-") &&
                  nestedPart.data
                ) {
                  const existing = flows.get(nestedPart.data.id);
                  if (!existing || 
                      nestedPart.data.updatedAt > existing.updatedAt) {
                    flows.set(nestedPart.data.id, nestedPart.data);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return Array.from(flows.values()).sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

function extractFlowsFromMessages<T>(
  messages: UIMessage[],
  flowType: string,
): FlowData<T>[] {
  const flows = new Map<string, FlowData<T>>();

  for (const message of messages) {
    if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        if (part.type === `data-flow-${flowType}` && "data" in part) {
          const flowPart = part as FlowPart<T>;
          if (flowPart.data) {
            const existing = flows.get(flowPart.data.id);
            if (!existing || 
                flowPart.data.updatedAt > existing.updatedAt) {
              flows.set(flowPart.data.id, flowPart.data);
            }
          }
        }

        // Also check tool call results
        if (part.type.startsWith("tool-") && "result" in part && part.result) {
          const result = part.result;
          if (typeof result === "object" && result && "parts" in result) {
            const parts = (result as { parts?: FlowPart<T>[] }).parts;
            if (Array.isArray(parts)) {
              for (const nestedPart of parts) {
                if (
                  nestedPart.type === `data-flow-${flowType}` &&
                  nestedPart.data
                ) {
                  const existing = flows.get(nestedPart.data.id);
                  if (!existing || 
                      nestedPart.data.updatedAt > existing.updatedAt) {
                    flows.set(nestedPart.data.id, nestedPart.data);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return Array.from(flows.values()).sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}
