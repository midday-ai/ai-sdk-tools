/**
 * Agent Routing Registry
 *
 * Declarative routing rules for agent selection based on intent keywords
 */

/**
 * Recommended prompt prefix for agents that use handoffs.
 * Based on OpenAI Agents SDK best practices.
 */
export const RECOMMENDED_PROMPT_PREFIX = `# System context
You are part of a multi-agent system designed to make agent coordination and execution easy. The system uses two primary abstractions: **Agents** and **Handoffs**. An agent encompasses instructions and tools and can hand off a conversation to another agent when appropriate. Handoffs are achieved by calling a handoff function. Transfers between agents are handled seamlessly in the background; do not mention or draw attention to these transfers in your conversation with the user.`;

export type AgentName =
  | "reports"
  | "transactions"
  | "invoices"
  | "timeTracking"
  | "customers"
  | "analytics"
  | "operations";

interface RoutingRule {
  agent: AgentName;
  keywords: string[];
  patterns?: RegExp[];
  description: string;
}

/**
 * Routing Rules Registry
 * Each rule defines keywords and patterns that trigger routing to a specific agent
 */
const routingRules: RoutingRule[] = [
  {
    agent: "reports",
    keywords: [
      "revenue",
      "profit",
      "loss",
      "p&l",
      "runway",
      "burn rate",
      "expenses",
      "spending",
      "balance sheet",
      "tax",
      "financial report",
    ],
    description: "Financial metrics, reports, and analysis",
  },
  {
    agent: "transactions",
    keywords: [
      "transaction",
      "payment",
      "transfer",
      "purchase",
      "last transaction",
      "recent transaction",
      "latest transaction",
    ],
    description: "Transaction queries and history",
  },
  {
    agent: "invoices",
    keywords: [
      "invoice",
      "bill",
      "create invoice",
      "send invoice",
      "unpaid invoice",
      "paid invoice",
    ],
    description: "Invoice creation and management",
  },
  {
    agent: "timeTracking",
    keywords: [
      "timer",
      "time entry",
      "time tracking",
      "hours",
      "tracked time",
      "start timer",
      "stop timer",
    ],
    description: "Time tracking and timer management",
  },
  {
    agent: "customers",
    keywords: [
      "customer",
      "client",
      "customer profitability",
      "customer analysis",
    ],
    description: "Customer management and analysis",
  },
  {
    agent: "analytics",
    keywords: [
      "forecast",
      "prediction",
      "predict",
      "stress test",
      "what if",
      "scenario",
      "health score",
      "business health",
      "healthy",
      "health",
      "analyze",
      "analysis",
      "future",
      "projection",
    ],
    description: "Forecasting and business intelligence",
  },
  {
    agent: "operations",
    keywords: ["inbox", "document", "export", "balance", "account balance"],
    description: "Operational tools and data export",
  },
];

/**
 * Normalize text for better matching
 * - Lowercase
 * - Remove numbers (e.g., "last 10 transactions" → "last transactions")
 * - Remove extra whitespace
 * - Simple plural → singular (conservative approach)
 */
function normalizeText(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/\d+/g, "") // remove numbers
      .replace(/\s+/g, " ") // normalize whitespace
      .trim() // clean up again after number removal
      // Safe plural removal - only common patterns
      .replace(
        /\b(transaction|payment|invoice|customer|document|entry)s\b/g,
        "$1",
      )
  );
}

/**
 * Route Classifier
 * Uses keyword matching to determine the best agent for a message
 */
export class RouteClassifier {
  private rules: RoutingRule[];

  constructor(rules: RoutingRule[] = routingRules) {
    this.rules = rules;
  }

  /**
   * Add a custom routing rule
   */
  addRule(rule: RoutingRule): void {
    this.rules.push(rule);
  }

  /**
   * Classify a message to determine the best agent
   * Returns null if no confident match is found (fallback to LLM)
   */
  classify(message: string): AgentName | null {
    const normalizedMessage = normalizeText(message);
    console.log("[Classifier] Input:", message);
    console.log("[Classifier] Normalized:", normalizedMessage);

    // Score each agent based on keyword matches
    const scores = new Map<AgentName, number>();

    for (const rule of this.rules) {
      let score = 0;

      // Check keyword matches
      for (const keyword of rule.keywords) {
        const normalizedKeyword = normalizeText(keyword);
        if (normalizedMessage.includes(normalizedKeyword)) {
          // Weight longer keywords higher (more specific)
          const weight = normalizedKeyword.split(" ").length;
          score += weight;
          console.log(
            `[Classifier] Match: "${normalizedKeyword}" in ${rule.agent} (weight: ${weight})`,
          );
        }
      }

      // Check regex patterns if provided
      if (rule.patterns) {
        for (const pattern of rule.patterns) {
          if (pattern.test(normalizedMessage)) {
            score += 2; // Regex matches get higher weight
            console.log(
              `[Classifier] Regex match: ${pattern} in ${rule.agent} (weight: 2)`,
            );
          }
        }
      }

      if (score > 0) {
        scores.set(rule.agent, score);
      }
    }

    // No matches found
    if (scores.size === 0) {
      console.log("[Classifier] No matches found");
      return null;
    }

    // Find highest scoring agent
    let bestAgent: AgentName | null = null;
    let highestScore = 0;

    for (const [agent, score] of scores.entries()) {
      console.log(`[Classifier] Score: ${agent} = ${score}`);
      if (score > highestScore) {
        highestScore = score;
        bestAgent = agent;
      }
    }

    // Return best match if we have any clear winner (score >= 1)
    // Use null only if truly ambiguous (tied scores or no matches)
    const result = highestScore >= 1 ? bestAgent : null;
    console.log(
      `[Classifier] Best: ${bestAgent} (score: ${highestScore}) → ${result ? "MATCHED" : "FALLBACK"}`,
    );
    return result;
  }

  /**
   * Get all registered rules
   */
  getRules(): ReadonlyArray<RoutingRule> {
    return this.rules;
  }

  /**
   * Get rules for a specific agent
   */
  getRulesForAgent(agent: AgentName): RoutingRule | undefined {
    return this.rules.find((rule) => rule.agent === agent);
  }
}

/**
 * Default classifier instance
 */
export const routeClassifier = new RouteClassifier();

/**
 * Helper function for quick classification
 */
export function classifyIntent(message: string): AgentName | null {
  return routeClassifier.classify(message);
}
