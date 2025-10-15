/**
 * Tool Result Extractor
 * 
 * Extracts tool results from conversation messages to pass to handoff agents
 */

import type { ModelMessage } from "ai";
import type { HandoffInputData } from "./types.js";
import { debug } from "./debug.js";

/**
 * Extract tool results from conversation messages
 */
export function extractToolResults(messages: ModelMessage[]): Record<string, any> {
  const toolResults: Record<string, any> = {};
  
  debug("TOOL_EXTRACTOR", `Analyzing ${messages.length} messages for tool results`);
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    debug("TOOL_EXTRACTOR", `Message ${i}: role=${message.role}, content type=${typeof message.content}`);
    
    if (message.role === "assistant" && message.content) {
      // Look for tool calls in assistant messages
      if (Array.isArray(message.content)) {
        debug("TOOL_EXTRACTOR", `Assistant message has ${message.content.length} content items`);
        for (const content of message.content) {
          debug("TOOL_EXTRACTOR", `Content item type: ${content.type}`);
          if (content.type === "tool-result") {
            const toolName = content.toolName;
            const result = (content as any).result || (content as any).output;
            debug("TOOL_EXTRACTOR", `Found tool result: ${toolName}`);
            if (toolName && result) {
              toolResults[toolName] = result;
            }
          }
        }
      }
    }
    
    // Also check for tool results in the message itself
    if (message.role === "tool" && message.content) {
      // Tool messages contain the result directly
      const toolName = (message as any).toolName;
      debug("TOOL_EXTRACTOR", `Tool message: ${toolName}`);
      if (toolName && message.content) {
        try {
          const result = typeof message.content === 'string' 
            ? JSON.parse(message.content) 
            : message.content;
          toolResults[toolName] = result;
        } catch (e) {
          // If not JSON, store as string
          toolResults[toolName] = message.content;
        }
      }
    }
  }
  
  debug("TOOL_EXTRACTOR", "Final tool results:", Object.keys(toolResults));
  return toolResults;
}

/**
 * Create a default input filter that modifies conversation history to include tool results
 */
export function createDefaultInputFilter(): (input: HandoffInputData) => HandoffInputData {
  return (input: HandoffInputData) => {
    debug("TOOL_EXTRACTOR", `Processing input history with ${input.inputHistory.length} messages`);
    debug("TOOL_EXTRACTOR", `Processing newItems with ${input.newItems.length} items`);
    
    // Extract tool results from newItems (this is the key - OpenAI agents style)
    const toolResults: Record<string, any> = {};
    
    // Process newItems to extract tool results
    for (const item of input.newItems) {
      debug("TOOL_EXTRACTOR", `Processing newItem: ${typeof item}`, item);
      
      // Check if item has tool results
      if (item && typeof item === 'object') {
        // Look for tool result properties
        if ('toolName' in item && 'result' in item) {
          const toolName = (item as any).toolName;
          const result = (item as any).result;
          if (toolName && result) {
            toolResults[toolName] = result;
            debug("TOOL_EXTRACTOR", `Found tool result in newItems: ${toolName}`);
          }
        }
        
        // Also check for nested tool results
        if ('content' in item && Array.isArray((item as any).content)) {
          const content = (item as any).content;
          for (const contentItem of content) {
            if (contentItem.type === 'tool-result' && contentItem.toolName && contentItem.result) {
              toolResults[contentItem.toolName] = contentItem.result;
              debug("TOOL_EXTRACTOR", `Found nested tool result: ${contentItem.toolName}`);
            }
          }
        }
      }
    }
    
    debug("TOOL_EXTRACTOR", "Extracted tool results from newItems:", Object.keys(toolResults));
    
    // Create a summary message with the available data
    if (Object.keys(toolResults).length > 0) {
      const dataSummary = Object.entries(toolResults)
        .map(([key, value]) => {
          // Generic data summary based on value type
          if (Array.isArray(value)) {
            return `Available ${key} data: ${value.length} items found`;
          }
          if (typeof value === 'object' && value !== null) {
            return `Available ${key} data: ${JSON.stringify(value)}`;
          }
          return `Available ${key} data: ${value}`;
        })
        .join('\n');
      
      // Add a system message with the available data
      const dataMessage: ModelMessage = {
        role: 'system',
        content: `Available data from previous agent:\n${dataSummary}\n\nUse this data instead of calling tools for the same information.`
      };
      
      // Ensure we keep the original conversation and add the data message
      const enhancedHistory = [...input.inputHistory];
      if (enhancedHistory.length === 0) {
        // If no history, add a user message to maintain context
        enhancedHistory.push({
          role: 'user',
          content: 'Please help with the request using the available data.'
        });
      }
      enhancedHistory.push(dataMessage);
      
      return {
        ...input,
        inputHistory: enhancedHistory,
      };
    }
    
    return input;
  };
}

/**
 * Create an input filter that only passes recent tool results
 */
export function createRecentDataFilter(maxAge: number = 5): (input: HandoffInputData) => HandoffInputData {
  return (input: HandoffInputData) => {
    // Only look at recent messages (last maxAge messages)
    const recentMessages = input.inputHistory.slice(-maxAge);
    const toolResults = extractToolResults(recentMessages);
    
    return {
      ...input,
      availableData: toolResults,
    };
  };
}
