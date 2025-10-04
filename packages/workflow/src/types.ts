import type { UIMessageStreamWriter } from "ai";
import type { z } from "zod";

export type FlowStatus = 
  | "idle"
  | "pending" 
  | "approved" 
  | "rejected" 
  | "timeout"
  | "cancelled"
  | "error";

export type FlowPriority = "low" | "medium" | "high" | "critical";

export interface BaseFlowContext {
  writer: UIMessageStreamWriter;
}

export class FlowError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "FlowError";
  }
}

export interface FlowData<T = unknown> {
  id: string;
  type: string;
  status: FlowStatus;
  action: string;
  description: string;
  payload: T;
  priority: FlowPriority;
  timeout?: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
  approvedAt?: number;
  rejectedAt?: number;
  metadata?: Record<string, unknown>;
}

export interface FlowConfig<T = unknown> {
  id: string;
  schema: z.ZodSchema<T>;
  action: string;
  description: string;
  priority?: FlowPriority;
  timeout?: number;
  autoApprove?: (data: T) => boolean;
}

export interface FlowStreamPart<T = unknown> {
  type: `data-flow-${string}`;
  id: string;
  data: FlowData<T>;
}

export interface FlowEventHandlers<T = unknown> {
  onPending?: (data: T, flow?: FlowInstance<T>) => void;
  onApproved?: (data: T, reason?: string, flow?: FlowInstance<T>) => void;
  onRejected?: (data: T, reason?: string, flow?: FlowInstance<T>) => void;
  onTimeout?: (data: T, flow?: FlowInstance<T>) => void;
  onCancelled?: (data: T, flow?: FlowInstance<T>) => void;
  onStatusChange?: (status: FlowStatus, prevStatus: FlowStatus, data: T, flow?: FlowInstance<T>) => void;
  onUpdate?: (data: T, prevData: T | null, flow?: FlowInstance<T>) => void;
  onError?: (error: string, data: T | null, flow?: FlowInstance<T>) => void;
}

export interface FlowActions {
  approve: (reason?: string) => Promise<void>;
  reject: (reason?: string) => Promise<void>;
  cancel: () => Promise<void>;
  retry: () => Promise<void>;
}

export interface FlowState<T = unknown> {
  data: T | null;
  status: FlowStatus;
  isActive: boolean;
  isPending: boolean;
  isComplete: boolean;
  hasData: boolean;
  timeRemaining?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface FlowInstance<T = unknown> extends FlowState<T>, FlowActions {
  id: string;
  type: string;
  action: string;
  description: string;
  priority: FlowPriority;
  createdAt: number;
  updatedAt: number;
}

export interface UseFlowOptions<T = unknown> extends FlowEventHandlers<T> {
  autoRetry?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export interface UseFlowReturn<T = unknown> extends FlowState<T>, FlowActions {
  // Flow instance details
  id: string | null;
  type: string | null;
  action: string | null;
  description: string | null;
  priority: FlowPriority | null;
  
  // Timestamps
  createdAt: number | null;
  updatedAt: number | null;
  
  // Helper states
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  canRetry: boolean;
}

export interface UseFlowsOptions {
  onFlow?: (type: string, flow: FlowData<unknown>) => void;
  include?: string[];
  exclude?: string[];
  priorityFilter?: FlowPriority[];
  statusFilter?: FlowStatus[];
}

export interface UseFlowsReturn {
  flows: FlowData<unknown>[];
  byType: Record<string, FlowData<unknown>[]>;
  byStatus: Record<FlowStatus, FlowData<unknown>[]>;
  byPriority: Record<FlowPriority, FlowData<unknown>[]>;
  pending: FlowData<unknown>[];
  active: FlowData<unknown>[];
  completed: FlowData<unknown>[];
  latest: Record<string, FlowData<unknown>>;
  
  // Counts
  totalCount: number;
  pendingCount: number;
  activeCount: number;
  completedCount: number;
  
  // States
  hasPending: boolean;
  hasActive: boolean;
  allComplete: boolean;
  
  // Bulk actions
  approveAll: (reason?: string) => Promise<void>;
  rejectAll: (reason?: string) => Promise<void>;
  cancelAll: () => Promise<void>;
}

export interface FlowUIProps<T = unknown> {
  data: T;
  action: string;
  description: string;
  priority: FlowPriority;
  timeRemaining?: number;
  onApprove: (reason?: string) => void;
  onReject: (reason?: string) => void;
  onCancel: () => void;
}
