/**
 * Shared Memory Tool - Cross-Agent State Coordination
 * 
 * Enables agents to share state via runContext.metadata
 * Automatically injected when multiple agents in workflow
 */

import { tool } from "ai";
import { z } from "zod";
import type { AgentRunContext } from "../run-context.js";

/**
 * Shared memory tool for cross-agent coordination
 * Stores data in runContext.metadata._sharedMemory
 */
export function createSharedMemoryTool() {
  return tool({
    description: "Read or write shared memory that persists across agent handoffs",
    inputSchema: z.object({
      operation: z.enum(["read", "write"]).describe("Operation to perform"),
      key: z.string().describe("Memory key to read or write"),
      value: z.any().optional().describe("Value to write (required for write operation)"),
    }),
    execute: async ({ operation, key, value }, { experimental_context }) => {
      // Get runContext from experimental_context
      const runContext = (experimental_context as any)?.runContext as AgentRunContext | undefined;
      
      if (!runContext) {
        throw new Error("Shared memory tool requires runContext in experimental_context");
      }

      // Initialize shared memory if it doesn't exist
      if (!runContext.metadata._sharedMemory) {
        runContext.metadata._sharedMemory = {};
      }

      const sharedMemory = runContext.metadata._sharedMemory as Record<string, any>;

      if (operation === "read") {
        return {
          key,
          value: sharedMemory[key],
          exists: key in sharedMemory,
        };
      } else if (operation === "write") {
        if (value === undefined) {
          throw new Error("Value is required for write operation");
        }
        
        sharedMemory[key] = value;
        return {
          key,
          value,
          success: true,
        };
      }

      throw new Error(`Invalid operation: ${operation}`);
    },
  });
}

/**
 * Helper function to get shared memory value
 */
export function getSharedMemory(runContext: AgentRunContext, key: string): any {
  const sharedMemory = runContext.metadata._sharedMemory as Record<string, any> | undefined;
  return sharedMemory?.[key];
}

/**
 * Helper function to set shared memory value
 */
export function setSharedMemory(runContext: AgentRunContext, key: string, value: any): void {
  if (!runContext.metadata._sharedMemory) {
    runContext.metadata._sharedMemory = {};
  }
  
  const sharedMemory = runContext.metadata._sharedMemory as Record<string, any>;
  sharedMemory[key] = value;
}
