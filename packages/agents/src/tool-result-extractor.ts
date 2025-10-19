/**
 * Tool Result Extractor
 * 
 * Extracts tool results from conversation messages to pass to handoff agents
 */

import type { ModelMessage } from "ai";
import type { HandoffInputData } from "./types.js";
import { createLogger } from "@ai-sdk-tools/debug";

const logger = createLogger('TOOL_EXTRACTOR');

/**
 * Extract tool results from conversation messages
 */
export function extractToolResults(messages: ModelMessage[]): Record<string, any> {
  const toolResults: Record<string, any> = {};
  
  logger.debug(`Analyzing ${messages.length} messages for tool results`, { count: messages.length });
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    logger.debug(`Message ${i}`, { role: message.role, contentType: typeof message.content });
    
    if (message.role === "assistant" && message.content) {
      // Look for tool calls in assistant messages
      if (Array.isArray(message.content)) {
        logger.debug(`Assistant message has ${message.content.length} content items`, { count: message.content.length });
        for (const content of message.content) {
          logger.debug(`Content item type: ${content.type}`, { type: content.type });
          if (content.type === "tool-result") {
            const toolName = content.toolName;
            const result = (content as any).result || (content as any).output;
            logger.debug(`Found tool result: ${toolName}`, { toolName });
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
      logger.debug(`Tool message: ${toolName}`, { toolName });
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
  
  logger.debug("Final tool results", { tools: Object.keys(toolResults) });
  return toolResults;
}

/**
 * Create a default input filter that modifies conversation history to include tool results
 * 
 * @internal This is automatically applied during handoffs. You typically don't need to use this directly.
 * Simply use `handoff(agent)` without specifying an inputFilter.
 */
export function createDefaultInputFilter(): (input: HandoffInputData) => HandoffInputData {
  return (input: HandoffInputData) => {
    logger.debug(`Processing input history with ${input.inputHistory.length} messages`, { 
      historyCount: input.inputHistory.length 
    });
    logger.debug(`Processing newItems with ${input.newItems.length} items`, { 
      newItemsCount: input.newItems.length 
    });
    
    // Extract tool results from newItems
    const toolResults: Record<string, any> = {};
    
    // Process newItems to extract tool results
    for (const item of input.newItems) {
      logger.debug(`Processing newItem: ${typeof item}`, { itemType: typeof item });
      
      // Check if item has tool results
      if (item && typeof item === 'object') {
        // Look for tool result properties
        if ('toolName' in item && 'result' in item) {
          const toolName = (item as any).toolName;
          const result = (item as any).result;
          if (toolName && result) {
            toolResults[toolName] = result;
            logger.debug(`Found tool result in newItems: ${toolName}`, { toolName });
          }
        }
        
        // Also check for nested tool results
        if ('content' in item && Array.isArray((item as any).content)) {
          const content = (item as any).content;
          for (const contentItem of content) {
            if (contentItem.type === 'tool-result' && contentItem.toolName && contentItem.result) {
              toolResults[contentItem.toolName] = contentItem.result;
              logger.debug(`Found nested tool result: ${contentItem.toolName}`, { toolName: contentItem.toolName });
            }
          }
        }
      }
    }
    
    logger.debug("Extracted tool results from newItems", { tools: Object.keys(toolResults) });
    
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
        content: `Available data from previous agent:\n${dataSummary}\n\n**IMPORTANT**: Only use this data if it's DIRECTLY relevant to the current user question. If the user is asking about something different, ignore this data and call the appropriate tools.`
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
