/**
 * Programmatic Routing System
 *
 * Matches user messages to agents based on keywords, patterns, or custom functions
 */

import type { Agent } from "./types.js";
import { createLogger } from "@ai-sdk-tools/debug";

const logger = createLogger('ROUTING');

/**
 * Normalize text for better matching
 * - Lowercase
 * - Remove numbers
 * - Remove extra whitespace
 * - Simple plural → singular
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\d+/g, "") // remove numbers
    .replace(/\s+/g, " ") // normalize whitespace
    .trim();
}

/**
 * Match a message against an agent's matchOn patterns
 */
export function matchAgent(
  agent: Agent,
  message: string,
  matchOn?: (string | RegExp)[] | ((message: string) => boolean),
): { matched: boolean; score: number } {
  if (!matchOn) {
    return { matched: false, score: 0 };
  }

  const normalizedMessage = normalizeText(message);
  let score = 0;

  // Function-based matching
  if (typeof matchOn === "function") {
    try {
      const result = matchOn(message);
      return { matched: result, score: result ? 10 : 0 };
    } catch (error) {
      logger.error(`Error in matchOn function for ${agent.name}`, { 
        agent: agent.name, 
        error 
      });
      return { matched: false, score: 0 };
    }
  }

  // Array-based matching (strings and regex)
  for (const pattern of matchOn) {
    if (typeof pattern === "string") {
      // String keyword matching
      const normalizedPattern = normalizeText(pattern);
      if (normalizedMessage.includes(normalizedPattern)) {
        // Weight longer keywords higher (more specific)
        const weight = normalizedPattern.split(" ").length;
        score += weight;
      }
    } else if (pattern instanceof RegExp) {
      // Regex pattern matching
      if (pattern.test(normalizedMessage)) {
        score += 2; // Regex matches get higher weight
      }
    }
  }

  return { matched: score > 0, score };
}

/**
 * Find the best matching agent from a list of agents
 */
export function findBestMatch(
  agents: Agent[],
  message: string,
  getMatchOn?: (
    agent: Agent,
  ) => (string | RegExp)[] | ((message: string) => boolean) | undefined,
): Agent | null {
  const scores: Array<{ agent: Agent; score: number }> = [];

  for (const agent of agents) {
    const matchOn = getMatchOn ? getMatchOn(agent) : undefined;
    const { matched, score } = matchAgent(agent, message, matchOn);

    if (matched && score > 0) {
      scores.push({ agent, score });
    }
  }

  // No matches found
  if (scores.length === 0) {
    return null;
  }

  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);

  // Return agent with highest score
  return scores[0].agent;
}
