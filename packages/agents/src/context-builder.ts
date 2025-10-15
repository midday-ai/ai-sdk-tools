/**
 * Context Builder
 * 
 * Intelligent context assembly for agent handoffs, similar to OpenAI's
 * getTurnInput but integrated with AI SDK's message system.
 */

import type { ModelMessage } from "ai";
import type { ConversationState, ConversationStateManager } from "./conversation-state.js";

/**
 * Build context-rich messages for agent handoffs
 * 
 * This replaces the hardcoded message truncation with intelligent context building
 * that preserves full conversation history and adds conversation state.
 */
export function buildContextualMessages(
  messages: ModelMessage[],
  conversationState: ConversationStateManager,
  currentAgent: { name: string },
  maxMessages: number = 20
): ModelMessage[] {
  // Build context prompt from conversation state
  const contextPrompt = conversationState.buildContextPrompt(currentAgent.name);
  
  // Create context message
  const contextMessage: ModelMessage = {
    role: 'system',
    content: contextPrompt
  };
  
  // Select relevant messages with intelligent truncation
  const relevantMessages = conversationState.selectRelevantMessages(messages, maxMessages);
  
  // Combine context with relevant messages
  return [contextMessage, ...relevantMessages];
}

/**
 * Extract facts from agent response using LLM
 * 
 * This replaces hardcoded fact extraction with LLM-powered analysis
 * that adapts to different types of information.
 */
export async function extractFactsFromResponse(
  response: string,
  agentName: string,
  model: any, // LanguageModel type
  conversationState: ConversationStateManager
): Promise<void> {
  try {
    // Use the model to extract structured facts
    const { object } = await model.generateObject({
      schema: {
        type: 'object',
        properties: {
          facts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: { type: 'string' },
                value: { type: 'string' },
                source: { type: 'string' }
              },
              required: ['key', 'value', 'source']
            }
          },
          summary: { type: 'string' }
        },
        required: ['facts', 'summary']
      },
      prompt: `Extract key facts from this agent response:

Agent: ${agentName}
Response: ${response}

What factual information should we remember? Focus on:
- Numbers (balances, amounts, metrics)
- Decisions made
- Items found or identified
- Status information

Provide a brief summary of what this agent discovered.`
    });
    
    // Update conversation state with extracted facts
    const facts: Record<string, any> = {};
    for (const fact of object.facts) {
      facts[fact.key] = fact.value;
    }
    
    conversationState.addFacts(facts, agentName);
    conversationState.addHandoff(agentName, '...', object.summary);
    
  } catch (error) {
    console.warn('Failed to extract facts from response:', error);
    // Fallback: just add a basic summary
    conversationState.addHandoff(agentName, '...', response.substring(0, 200) + '...');
  }
}

/**
 * Detect if a query is compound (requires multiple steps/sources)
 * 
 * This replaces hardcoded pattern matching with LLM-powered detection
 * that can handle novel query types.
 */
export async function isCompoundQuery(
  input: string,
  model: any // LanguageModel type
): Promise<boolean> {
  try {
    const { object } = await model.generateObject({
      schema: {
        type: 'object',
        properties: {
          isCompound: { type: 'boolean' },
          reasoning: { type: 'string' }
        },
        required: ['isCompound', 'reasoning']
      },
      prompt: `Analyze this user query to determine if it's compound (requires multiple steps or information sources):

Query: "${input}"

A compound query typically:
- Asks for multiple pieces of information
- Requires external data + internal data
- Needs sequential steps (find X, then check Y)
- Combines different domains (web search + database)

Examples of compound queries:
- "Find latest iPhone price and tell me if I can afford it"
- "Show my balance and this month's spending"
- "What's the weather and how does it affect my outdoor plans?"

Examples of simple queries:
- "What's my balance?"
- "Show me transactions"
- "Create an invoice"

Is this a compound query?`
    });
    
    return object.isCompound;
  } catch (error) {
    console.warn('Failed to analyze query complexity:', error);
    // Fallback: use simple heuristics
    return /\b(and|then|also|plus|find.*and|show.*and)\b/i.test(input) ||
           /\b(afford|compare|versus|latest.*and|current.*and)\b/i.test(input);
  }
}

/**
 * Create a query plan for compound queries
 * 
 * This uses LLM reasoning to create execution plans instead of hardcoded patterns.
 */
export async function createQueryPlan(
  input: string,
  availableAgents: string[],
  model: any // LanguageModel type
): Promise<{
  analysis: string;
  informationNeeded: string[];
  proposedSteps: Array<{
    action: string;
    why: string;
    method: string;
  }>;
}> {
  try {
    const { object } = await model.generateObject({
      schema: {
        type: 'object',
        properties: {
          analysis: { type: 'string' },
          informationNeeded: {
            type: 'array',
            items: { type: 'string' }
          },
          proposedSteps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                action: { type: 'string' },
                why: { type: 'string' },
                method: { type: 'string' }
              },
              required: ['action', 'why', 'method']
            }
          }
        },
        required: ['analysis', 'informationNeeded', 'proposedSteps']
      },
      prompt: `Create an execution plan for this compound query:

Query: "${input}"

Available agents: ${availableAgents.join(', ')}

Think through:
1. What is the user really asking for?
2. What information do you need to gather?
3. What steps are required and in what order?
4. Which agents/tools can provide each piece of information?

Create a step-by-step plan that will result in a complete answer.`
    });
    
    return object;
  } catch (error) {
    console.warn('Failed to create query plan:', error);
    // Fallback: simple plan
    return {
      analysis: `User wants: ${input}`,
      informationNeeded: ['Information to answer the query'],
      proposedSteps: [{
        action: 'Gather information',
        why: 'To answer the user query',
        method: 'Use appropriate agent'
      }]
    };
  }
}

/**
 * Update working memory with conversation state
 * 
 * This replaces template-based memory updates with LLM-generated content
 * that evolves naturally with the conversation.
 */
export async function updateWorkingMemory(
  conversationState: ConversationStateManager,
  currentMemory: string,
  model: any // LanguageModel type
): Promise<string> {
  try {
    const { text } = await model.generateText({
      prompt: `Update the working memory with new facts learned in this conversation.

Current working memory:
${currentMemory}

New facts:
${JSON.stringify(conversationState.getState().facts, null, 2)}

Recent findings:
${conversationState.getState().handoffChain.slice(-3).map(h => 
  `- ${h.agent}: ${h.findings}`
).join('\n')}

Generate an updated working memory in markdown format that includes:
1. User context
2. Recently learned facts with timestamps
3. Current conversation focus

Keep it concise and well-organized.`
    });
    
    return text;
  } catch (error) {
    console.warn('Failed to update working memory:', error);
    // Fallback: append new facts to existing memory
    const newFacts = Object.entries(conversationState.getState().facts)
      .map(([key, fact]) => `- ${key}: ${fact.value} (${fact.source})`)
      .join('\n');
    
    return currentMemory + '\n\n## New Facts\n' + newFacts;
  }
}
