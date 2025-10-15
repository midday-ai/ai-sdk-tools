/**
 * Handoff Input Filters - Pre-built filter utilities
 */

import type { HandoffInputData, HandoffInputFilter } from "./types.js";

/**
 * Remove all tool-related messages from handoff data
 * Useful when the next agent doesn't need to see tool calls
 */
export function removeAllTools(data: HandoffInputData): HandoffInputData {
  try {
    const filterToolMessages = (messages: any[]) => {
      if (!Array.isArray(messages)) {
        console.warn("removeAllTools: messages is not an array", messages);
        return [];
      }
      
      return messages.filter((msg) => {
        if (!msg || typeof msg !== "object") return false;
        
        // Remove tool call messages
        if (msg.role === "tool") return false;
        // Remove assistant messages that only contain tool calls
        if (msg.role === "assistant" && msg.tool_calls) return false;
        return true;
      });
    };

    return {
      ...data,
      inputHistory: filterToolMessages(data.inputHistory || []),
      preHandoffItems: filterToolMessages(data.preHandoffItems || []),
      newItems: filterToolMessages(data.newItems || []),
    };
  } catch (error) {
    console.error("Error in removeAllTools filter:", error);
    // Return original data as fallback
    return data;
  }
}

/**
 * Keep only the last N messages in the input history
 * Useful for context windowing to prevent token limits
 */
export function keepLastNMessages(n: number): HandoffInputFilter {
  return (data: HandoffInputData) => {
    try {
      if (typeof n !== "number" || n < 0) {
        console.warn("keepLastNMessages: invalid n value", n);
        return data;
      }

      const safeSlice = (messages: any[], count: number) => {
        if (!Array.isArray(messages)) {
          console.warn("keepLastNMessages: messages is not an array", messages);
          return [];
        }
        return messages.slice(-count);
      };

      return {
        ...data,
        inputHistory: safeSlice(data.inputHistory || [], n),
        preHandoffItems: safeSlice(data.preHandoffItems || [], n),
        newItems: safeSlice(data.newItems || [], n),
      };
    } catch (error) {
      console.error("Error in keepLastNMessages filter:", error);
      // Return original data as fallback
      return data;
    }
  };
}
