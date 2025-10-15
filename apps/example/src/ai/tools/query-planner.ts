/**
 * Query Planning Tool
 * 
 * LLM-powered tool for planning complex queries that require multiple steps
 * or information sources. Replaces hardcoded pattern matching with intelligent reasoning.
 */

import { tool } from "ai";
import { z } from "zod";

export const createQueryPlannerTool = () => tool({
  description: `Think through how to answer complex queries that require multiple steps or information sources.
  
  Use this when you need to:
  - Gather information from multiple places (web search + database)
  - Execute steps in sequence (find price, then check affordability)
  - Coordinate with other agents
  
  This helps you organize your thinking and track progress.`,
  
  inputSchema: z.object({
    analysis: z.string().describe('What is the user really asking? What makes this query complex?'),
    informationNeeded: z.array(z.string()).describe('What specific facts do you need to gather?'),
    proposedSteps: z.array(z.object({
      action: z.string().describe('What to do in this step'),
      why: z.string().describe('Why this step is necessary'),
      method: z.string().describe('How to accomplish this (tool name, agent handoff, etc.)')
    })).describe('Your step-by-step plan')
  }),
  
  execute: async ({ analysis, informationNeeded, proposedSteps }: {
    analysis: string;
    informationNeeded: string[];
    proposedSteps: Array<{
      action: string;
      why: string;
      method: string;
    }>;
  }, options: any) => {
    // For now, just return the plan without context integration
    // This will be enhanced when we integrate with the conversation state
    
    return {
      success: true,
      message: `Plan created with ${proposedSteps.length} steps. Proceeding with execution.`,
      firstStep: proposedSteps[0],
      plan: {
        analysis,
        informationNeeded,
        proposedSteps
      }
    };
  }
});

export const createCompoundQueryDetector = () => tool({
  description: `Detect if a query is compound (requires multiple steps or information sources).
  
  Use this to determine if a query needs special handling with multiple agents or tools.`,
  
  inputSchema: z.object({
    query: z.string().describe('The user query to analyze'),
    isCompound: z.boolean().describe('Whether this is a compound query'),
    reasoning: z.string().describe('Why you think this is or isn\'t compound')
  }),
  
  execute: async ({ query, isCompound, reasoning }: {
    query: string;
    isCompound: boolean;
    reasoning: string;
  }, options: any) => {
    // For now, just return the analysis without context integration
    // This will be enhanced when we integrate with the conversation state
    
    return {
      isCompound,
      reasoning,
      needsPlanning: isCompound
    };
  }
});
