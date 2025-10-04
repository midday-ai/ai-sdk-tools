import type { z } from "zod";
import { StreamingFlow } from "./streaming";
import type { FlowConfig, FlowData, FlowPriority } from "./types";
import { generateId, getDefaults } from "./utils";

export function workflow<T, O = string>(config: {
  id: string;
  inputSchema: z.ZodSchema<T>;
  outputSchema?: z.ZodSchema<O>;
  priority?: FlowPriority;
  timeout?: number;
  autoApprove?: (data: T) => boolean;
}) {
  const flowConfig: FlowConfig<T> = { 
    id: config.id, 
    schema: config.inputSchema, 
    action: config.id, // Use id as default action
    description: config.id, // Use id as default description
    priority: config.priority,
    timeout: config.timeout,
    autoApprove: config.autoApprove,
  };

  return {
    id: config.id,
    inputSchema: config.inputSchema,
    outputSchema: config.outputSchema,

    create(data: Partial<T> = {}): FlowData<T> {
      const defaults = getDefaults(config.inputSchema);
      const validated = config.inputSchema.parse({ ...defaults, ...data });

      return {
        id: generateId(),
        type: config.id,
        status: "pending",
        action: config.id, // Will be overridden by streaming layer
        description: config.id, // Will be overridden by streaming layer
        payload: validated,
        priority: config.priority || "medium",
        timeout: config.timeout,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    },

    stream(data: Partial<T> = {}): StreamingFlow<T> {
      const instance = this.create(data);
      return new StreamingFlow(flowConfig, instance);
    },

    validate(data: unknown): T {
      return config.inputSchema.parse(data);
    },

    validateOutput(data: unknown): O {
      if (!config.outputSchema) {
        throw new Error(`No output schema defined for flow ${config.id}`);
      }
      return config.outputSchema.parse(data);
    },

    isValid(data: unknown): data is T {
      try {
        config.inputSchema.parse(data);
        return true;
      } catch {
        return false;
      }
    },

    isValidOutput(data: unknown): data is O {
      if (!config.outputSchema) return true;
      try {
        config.outputSchema.parse(data);
        return true;
      } catch {
        return false;
      }
    },

    shouldAutoApprove(data: T): boolean {
      return config.autoApprove ? config.autoApprove(data) : false;
    },
  };
}
