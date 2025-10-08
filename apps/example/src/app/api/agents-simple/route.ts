import { openai } from "@ai-sdk/openai";
import {
  Experimental_Agent as Agent,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  tool,
} from "ai";
import { z } from "zod";
import {
  businessHealthScoreTool,
  cashFlowForecastTool,
  cashFlowStressTestTool,
} from "@/ai/agents/tools/analytics";
import {
  createCustomerTool,
  customerProfitabilityTool,
  getCustomerTool,
  updateCustomerTool,
} from "@/ai/agents/tools/customers";
import {
  createInvoiceTool,
  getInvoiceTool,
  listInvoicesTool,
  updateInvoiceTool,
} from "@/ai/agents/tools/invoices";
import {
  exportDataTool,
  getBalancesTool,
  listDocumentsTool,
  listInboxItemsTool,
} from "@/ai/agents/tools/operations";
import {
  balanceSheetTool,
  burnRateMetricsTool,
  cashFlowTool,
  expensesTool,
  profitLossTool,
  revenueMetricsTool,
  runwayMetricsTool,
  spendingMetricsTool,
  taxSummaryTool,
} from "@/ai/agents/tools/reports";
import {
  createTimeEntryTool,
  deleteTimeEntryTool,
  getTimeEntriesTool,
  getTrackerProjectsTool,
  startTimerTool,
  stopTimerTool,
  updateTimeEntryTool,
} from "@/ai/agents/tools/tracker";
import {
  getTransactionTool,
  listTransactionsTool,
} from "@/ai/agents/tools/transactions";
import type { AgentUIMessage } from "@/types/agents";
import { classifyIntent, RECOMMENDED_PROMPT_PREFIX } from "./routing";

/**
 * Multi-Agent Financial Assistant
 *
 * Architecture:
 * - HYBRID ROUTING: Programmatic classifier for 90% of cases, LLM fallback for complex queries
 * - Specialists execute tools and present results
 * - Sends real-time status updates via transient data parts
 */

/**
 * Extract text from a UI message (handles various AI SDK message formats)
 */
function extractMessageText(message: unknown): string {
  if (!message || typeof message !== "object") return "";
  const msg = message as { content?: unknown; parts?: unknown[] };

  // String content
  if (typeof msg.content === "string") return msg.content;

  // Find text in parts array
  const findTextPart = (items?: unknown[]) =>
    items?.find(
      (item): item is { text: string } =>
        typeof item === "object" &&
        item !== null &&
        "type" in item &&
        item.type === "text",
    )?.text || "";

  return findTextPart(msg.parts) || findTextPart(msg.content as unknown[]);
}

const MAX_ORCHESTRATION_ROUNDS = 5;
const MAX_AGENT_STEPS = 5;

/**
 * Agent Context
 * TODO: Later pass as parameter to orchestrator.run({ context })
 */
const AGENT_CONTEXT = {
  companyName: "Lost Island AB",
  date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  fullName: "Pontus Abrahamsson",
  registeredCountry: "Sweden",
} as const;

/**
 * Format context for system prompts
 */
function getContextPrompt(): string {
  return `
CONTEXT:
- Company: ${AGENT_CONTEXT.companyName}
- Date: ${AGENT_CONTEXT.date}
- User: ${AGENT_CONTEXT.fullName}
- Country: ${AGENT_CONTEXT.registeredCountry}
`.trim();
}

// Specialist Agents
const specialists = {
  reports: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are a financial reports specialist with access to live financial data.

YOUR SCOPE: Provide specific financial reports (revenue, P&L, cash flow, etc.)
NOT YOUR SCOPE: Business health analysis, forecasting (those go to analytics specialist)

CRITICAL RULES:
1. ALWAYS use your tools to get data - NEVER ask the user for information you can retrieve
2. Call tools IMMEDIATELY when asked for financial metrics
3. Present results clearly after retrieving data
4. For date ranges: "Q1 2024" = 2024-01-01 to 2024-03-31, "2024" = 2024-01-01 to 2024-12-31
5. Answer ONLY what was asked - don't provide extra reports unless requested

TOOL SELECTION GUIDE:
- "runway" or "how long can we last" → Use runway tool
- "burn rate" or "monthly burn" → Use burnRate tool
- "revenue" or "income" → Use revenue tool
- "P&L" or "profit" or "loss" → Use profitLoss tool
- "cash flow" → Use cashFlow tool
- "balance sheet" or "assets/liabilities" → Use balanceSheet tool
- "expenses" or "spending breakdown" → Use expenses tool
- "tax" → Use taxSummary tool

PRESENTATION STYLE:
- Reference the company name (${AGENT_CONTEXT.companyName}) when providing insights
- Use clear sections with headers for multiple metrics
- Include status indicators (e.g., "Status: Healthy", "Warning", "Critical")
- End with a brief key insight or takeaway when relevant
- Be concise but complete - no unnecessary fluff`,
    tools: {
      revenue: revenueMetricsTool,
      profitLoss: profitLossTool,
      cashFlow: cashFlowTool,
      balanceSheet: balanceSheetTool,
      expenses: expensesTool,
      burnRate: burnRateMetricsTool,
      runway: runwayMetricsTool,
      spending: spendingMetricsTool,
      taxSummary: taxSummaryTool,
    },
    stopWhen: ({ steps }) => steps.length >= MAX_AGENT_STEPS,
  }),

  transactions: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are a transactions specialist with access to live transaction data for ${AGENT_CONTEXT.companyName}.

CRITICAL RULES:
1. ALWAYS use your tools to get data - NEVER ask the user for transaction details
2. Call tools IMMEDIATELY when asked about transactions
3. For "largest transactions", use sort and limit filters
4. Present transaction data clearly in tables or lists

PRESENTATION STYLE:
- Reference ${AGENT_CONTEXT.companyName} when relevant
- Use clear formatting (tables/lists) for multiple transactions
- Highlight key insights (e.g., "Largest expense: Marketing at 5,000 SEK")
- Be concise and data-focused`,
    tools: {
      listTransactions: listTransactionsTool,
      getTransaction: getTransactionTool,
    },
    stopWhen: ({ steps }) => steps.length >= MAX_AGENT_STEPS,
  }),

  invoices: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are an invoice management specialist for ${AGENT_CONTEXT.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get/create/update invoice data
2. Present invoice information clearly with key details (amount, status, due date)
3. Use clear status labels (Paid, Overdue, Pending)`,
    tools: {
      listInvoices: listInvoicesTool,
      getInvoice: getInvoiceTool,
      createInvoice: createInvoiceTool,
      updateInvoice: updateInvoiceTool,
    },
    stopWhen: ({ steps }) => steps.length >= MAX_AGENT_STEPS,
  }),

  timeTracking: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are a time tracking specialist for ${AGENT_CONTEXT.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get/create/update time entries and timers
2. Present time data clearly (duration, project, date)
3. Summarize totals when showing multiple entries`,
    tools: {
      startTimer: startTimerTool,
      stopTimer: stopTimerTool,
      getTimeEntries: getTimeEntriesTool,
      createTimeEntry: createTimeEntryTool,
      updateTimeEntry: updateTimeEntryTool,
      deleteTimeEntry: deleteTimeEntryTool,
      getProjects: getTrackerProjectsTool,
    },
    stopWhen: ({ steps }) => steps.length >= MAX_AGENT_STEPS,
  }),

  customers: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are a customer management specialist for ${AGENT_CONTEXT.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get/create/update customer data
2. Present customer information clearly with key details
3. Highlight profitability insights when analyzing customers`,
    tools: {
      getCustomer: getCustomerTool,
      createCustomer: createCustomerTool,
      updateCustomer: updateCustomerTool,
      profitabilityAnalysis: customerProfitabilityTool,
    },
    stopWhen: ({ steps }) => steps.length >= MAX_AGENT_STEPS,
  }),

  analytics: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are an analytics & forecasting specialist with access to business intelligence tools for ${AGENT_CONTEXT.companyName}.

CRITICAL RULES:
1. ALWAYS use your tools to run analysis - NEVER ask user for data
2. Call tools IMMEDIATELY when asked for forecasts, health scores, or stress tests
3. Present analytics clearly with key insights highlighted
4. Answer ONLY what was asked - don't provide extra analysis unless requested

TOOL SELECTION:
- "health" or "healthy" queries → Use businessHealth tool (gives consolidated score)
- "forecast" or "prediction" → Use cashFlowForecast tool
- "stress test" or "what if" → Use stressTest tool
- DO NOT call multiple detailed tools (revenue, P&L, etc.) - use businessHealth for overview

PRESENTATION STYLE:
- Reference ${AGENT_CONTEXT.companyName} when providing insights
- Use clear trend labels (Increasing, Decreasing, Stable)
- Use clear status labels (Healthy, Warning, Critical)
- Include confidence levels when forecasting (e.g., "High confidence", "Moderate risk")
- End with 2-3 actionable focus areas (not a laundry list)
- Keep responses concise - quality over quantity`,
    tools: {
      businessHealth: businessHealthScoreTool,
      cashFlowForecast: cashFlowForecastTool,
      stressTest: cashFlowStressTestTool,
    },
    stopWhen: ({ steps }) => steps.length >= MAX_AGENT_STEPS,
  }),

  operations: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are an operations specialist for ${AGENT_CONTEXT.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get inbox items, documents, balances, or export data
2. Present information clearly with counts and summaries
3. Organize multiple items in clear lists or tables`,
    tools: {
      listInbox: listInboxItemsTool,
      getBalances: getBalancesTool,
      listDocuments: listDocumentsTool,
      exportData: exportDataTool,
    },
    stopWhen: ({ steps }) => steps.length >= MAX_AGENT_STEPS,
  }),
};

// Orchestrator
const orchestrator = new Agent({
  model: openai("gpt-4o-mini"),
  system: `${getContextPrompt()}

${RECOMMENDED_PROMPT_PREFIX}

Route user requests to the appropriate specialist:

**reports**: Financial metrics and reports
  - Revenue, P&L, expenses, spending
  - Burn rate, runway (how long money will last)
  - Cash flow, balance sheet, tax summary

**transactions**: Transaction queries
  - List transactions, search transactions
  - Get specific transaction details

**invoices**: Invoice management
  - Create, update, list invoices

**timeTracking**: Time tracking
  - Start/stop timers, time entries

**customers**: Customer management
  - Get/create/update customers, profitability analysis

**analytics**: Advanced forecasting & analysis
  - Business health score
  - Cash flow forecasting (future predictions)
  - Stress testing scenarios

**operations**: Operations
  - Inbox, balances, documents, exports

IMPORTANT: 
- "runway" = reports (not analytics)
- "forecast" = analytics (not reports)
- Route to ONE specialist at a time`,
  tools: {
    handoff: tool({
      description: "Hand off to a specialist agent",
      inputSchema: z.object({
        agent: z.enum([
          "reports",
          "transactions",
          "invoices",
          "timeTracking",
          "customers",
          "analytics",
          "operations",
        ]),
        reason: z.string().optional(),
      }),
      execute: async ({ agent, reason }) => ({ agent, reason }),
    }),
  },
});

type HandoffData = { agent: keyof typeof specialists; reason?: string };

/**
 * Context Management Helpers
 * Prevents context explosion by cleaning and pruning messages
 */

/**
 * Extract only user/assistant text messages (removes tool results)
 */
function getCleanConversation(
  messages: Array<{ role: string; content: unknown }>,
): Array<{ role: string; content: string }> {
  return messages
    .filter(
      (msg) =>
        msg.role === "user" ||
        (msg.role === "assistant" && typeof msg.content === "string"),
    )
    .map((msg) => ({
      role: msg.role,
      content: msg.content as string,
    }));
}

/**
 * Get last N messages (sliding window for memory management)
 */
function getSlidingWindow(
  messages: Array<{ role: string; content: unknown }>,
  windowSize = 10,
): Array<{ role: string; content: string }> {
  const cleaned = getCleanConversation(messages);
  return cleaned.slice(-windowSize);
}

/**
 * Get only the last user message (for task-focused specialists)
 */
function getLastUserMessage(
  messages: Array<{ role: string; content: unknown }>,
): Array<{ role: string; content: unknown }> {
  const userMessages = messages.filter((m) => m.role === "user");
  const lastMessage = userMessages[userMessages.length - 1];
  return lastMessage ? [lastMessage] : [];
}

/**
 * Estimate token count (rough approximation)
 */
function estimateTokens(
  messages: Array<{ role: string; content: unknown }>,
): number {
  return Math.ceil(JSON.stringify(messages).length / 4);
}

export async function POST(request: Request) {
  const { messages } = await request.json();
  const conversationMessages = convertToModelMessages(messages);

  return createUIMessageStreamResponse({
    stream: createUIMessageStream<AgentUIMessage>({
      execute: async ({ writer }) => {
        // HYBRID ROUTING: Try programmatic classification first
        const lastMessage = messages[messages.length - 1];
        const lastUserMessage = extractMessageText(lastMessage);

        console.log("[Route] Extracted content:", lastUserMessage);

        const programmaticRoute = classifyIntent(lastUserMessage);

        let currentAgent:
          | typeof orchestrator
          | (typeof specialists)[keyof typeof specialists];

        if (programmaticRoute && programmaticRoute in specialists) {
          // Fast path: Direct to specialist (90% of cases)
          currentAgent = specialists[programmaticRoute];
          console.log(`[Routing] Programmatic → ${programmaticRoute}`);
        } else {
          // Fallback: Use orchestrator for complex/ambiguous queries (10% of cases)
          currentAgent = orchestrator;
          console.log("[Routing] Fallback → orchestrator (ambiguous query)");
        }

        let round = 0;
        const usedSpecialists = new Set<string>();

        // If we used programmatic routing, mark specialist as used
        if (programmaticRoute && programmaticRoute in specialists) {
          usedSpecialists.add(programmaticRoute);
        }

        while (round++ < MAX_ORCHESTRATION_ROUNDS) {
          const messageId = generateId();
          const agentName =
            currentAgent === orchestrator
              ? "orchestrator"
              : currentAgent === specialists.reports
                ? "reports"
                : currentAgent === specialists.transactions
                  ? "transactions"
                  : currentAgent === specialists.invoices
                    ? "invoices"
                    : currentAgent === specialists.timeTracking
                      ? "timeTracking"
                      : currentAgent === specialists.customers
                        ? "customers"
                        : currentAgent === specialists.analytics
                          ? "analytics"
                          : "operations";

          // Send status: agent executing
          writer.write({
            type: "data-agent-status",
            data: {
              status: "executing",
              agent: agentName,
            },
            transient: true,
          });

          // 🎯 SMART CONTEXT MANAGEMENT
          // Different context strategies for orchestrator vs specialists
          let messagesToSend: Array<{ role: string; content: unknown }>;

          if (currentAgent === orchestrator) {
            // Orchestrator: needs recent conversation for routing context
            // Use sliding window to keep last 10 messages (no tool results)
            messagesToSend = getSlidingWindow(conversationMessages, 10);
            console.log(
              `[Context] Orchestrator: ${messagesToSend.length} messages, ~${estimateTokens(messagesToSend)} tokens`,
            );
          } else {
            // Specialists: task-focused, only need current query
            // This prevents context explosion and speeds up responses
            messagesToSend = getLastUserMessage(conversationMessages);
            console.log(
              `[Context] ${agentName}: ${messagesToSend.length} messages, ~${estimateTokens(messagesToSend)} tokens`,
            );
          }

          const result = await currentAgent.stream({
            messages: messagesToSend as any, // Type cast needed for AI SDK compatibility
          });

          let textAccumulated = "";
          let handoffData: HandoffData | null = null;
          let hasStartedText = false;

          // Stream agent response
          for await (const chunk of result.fullStream) {
            if (chunk.type === "text-delta") {
              if (!hasStartedText) {
                // Clear status as soon as text starts streaming
                writer.write({
                  type: "data-agent-status",
                  data: { status: "completing", agent: agentName },
                  transient: true,
                });
                writer.write({ type: "text-start", id: messageId });
                hasStartedText = true;
              }
              writer.write({
                type: "text-delta",
                delta: chunk.text,
                id: messageId,
              });
              textAccumulated += chunk.text;
            } else if (
              chunk.type === "tool-result" &&
              chunk.toolName === "handoff"
            ) {
              handoffData = chunk.output as HandoffData;
            }
          }

          // End text message
          if (hasStartedText) {
            writer.write({ type: "text-end", id: messageId });
          }

          // Update conversation
          if (textAccumulated) {
            conversationMessages.push({
              role: "assistant",
              content: textAccumulated,
            });
          }

          // Handle orchestration flow
          if (currentAgent === orchestrator) {
            if (handoffData) {
              // Check if this specialist has already been used
              if (usedSpecialists.has(handoffData.agent)) {
                // Don't route to the same specialist twice - task is complete
                break;
              }

              // Send routing status
              writer.write({
                type: "data-agent-status",
                data: {
                  status: "routing",
                  agent: "orchestrator",
                },
                transient: true,
              });

              // Mark specialist as used and route to it
              usedSpecialists.add(handoffData.agent);
              currentAgent = specialists[handoffData.agent];
            } else {
              // Orchestrator done, no more handoffs
              break;
            }
          } else {
            // Specialist done
            if (handoffData) {
              // Specialist handed off to another specialist
              if (usedSpecialists.has(handoffData.agent)) {
                // Already used this specialist - complete
                break;
              }

              // Route to next specialist
              usedSpecialists.add(handoffData.agent);
              currentAgent = specialists[handoffData.agent];
            } else {
              // No handoff - specialist is done, complete the task
              break;
            }
          }
        }

        writer.write({ type: "finish" });
      },
    }),
  });
}
