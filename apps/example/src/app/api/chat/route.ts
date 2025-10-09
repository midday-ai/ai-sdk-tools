// NOTE: This is what will become @ai-sdk-tools/agents, make it work, make it right, make it good.
// https://ai-sdk-tools.dev/agents

import { openai } from "@ai-sdk/openai";
import {
  Experimental_Agent as Agent,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
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
  revenueDashboardTool,
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
import { setContext } from "@/ai/context";
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

// Configuration
const CONFIG = {
  orchestration: {
    maxRounds: 5,
    contextWindow: 5, // Number of recent messages for specialists
  },
  agents: {
    maxSteps: 5,
  },
} as const;

/**
 * Agent Context
 * TODO: Later pass as parameter to orchestrator.run({ context })
 */
const AGENT_CONTEXT = {
  companyName: "Acme Inc.",
  date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  fullName: "John Doe",
  registeredCountry: "United States",
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
      revenue: revenueDashboardTool,
      profitLoss: profitLossTool,
      cashFlow: cashFlowTool,
      balanceSheet: balanceSheetTool,
      expenses: expensesTool,
      burnRate: burnRateMetricsTool,
      runway: runwayMetricsTool,
      spending: spendingMetricsTool,
      taxSummary: taxSummaryTool,
    },
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
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
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
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
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
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
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
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
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
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
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
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
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
  }),

  research: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are a research specialist with access to real-time web search for ${AGENT_CONTEXT.companyName}.

YOUR ROLE:
- Search the web for current information, news, and market data
- Find competitor information and industry insights
- Look up real-time data (exchange rates, stock prices, etc.)
- Research business tools, services, and best practices
- Verify facts and cross-reference information

CRITICAL RULES:
1. ALWAYS use web_search when asked to find external information
2. Synthesize findings into actionable insights
3. Cite or reference sources when relevant
4. Distinguish between fact and opinion
5. Flag information gaps or uncertainties

SCOPE:
✓ External information (news, competitors, markets, tools)
✗ Internal company data (use appropriate specialists: reports, transactions, etc.)

PRESENTATION STYLE:
- Provide clear summaries with key findings first
- Use bullet points for multiple findings
- Include context on how findings relate to ${AGENT_CONTEXT.companyName}
- Be concise but comprehensive
- Recommend next steps when relevant`,
    tools: {
      web_search: openai.tools.webSearch({
        searchContextSize: "high",
      }),
    },
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
  }),

  general: new Agent({
    model: openai("gpt-4o-mini"),
    system: `${getContextPrompt()}

You are a general assistant for ${AGENT_CONTEXT.companyName}.

YOUR ROLE:
- Handle general conversation (greetings, thanks, casual chat)
- Answer questions about what you can do and your capabilities
- Handle ambiguous or unclear requests by asking clarifying questions
- Provide helpful information about the available specialists

AVAILABLE SPECIALISTS:
- **reports**: Financial metrics (revenue, P&L, burn rate, runway, etc.)
- **transactions**: Transaction history and details
- **invoices**: Invoice management
- **timeTracking**: Time tracking and timers
- **customers**: Customer management and profitability
- **analytics**: Forecasting and business intelligence
- **operations**: Inbox, documents, balances, data export
- **research**: Web search for external information, news, competitors, market data

STYLE:
- Be friendly and helpful
- Reference ${AGENT_CONTEXT.companyName} when relevant
- If the user asks for something specific, suggest the right specialist
- Keep responses concise but complete`,
    stopWhen: ({ steps }) => steps.length >= CONFIG.agents.maxSteps,
  }),
};

// Orchestrator
const orchestrator = new Agent({
  model: openai("gpt-4o-mini"),
  toolChoice: "required",
  system: `${getContextPrompt()}
  

${RECOMMENDED_PROMPT_PREFIX}

Route user requests to the appropriate agent:

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

**research**: Web search and external information
  - Latest news, market trends, competitor research
  - Real-time data lookup (exchange rates, stock prices, etc.)
  - Industry insights, business tools research
  - Any external information not in our internal systems

**general**: General queries and conversation
  - Greetings, thanks, casual conversation
  - "What can you do?", "How does this work?"
  - Memory queries: "What did I just ask?", "What did we discuss?"
  - Ambiguous or unclear requests
  - Default for anything that doesn't fit other specialists

ROUTING RULES: 
- "runway" = reports (not analytics)
- "forecast" = analytics (not reports)
- "search", "look up", "find", "latest news" = research (not reports)
- "what did I just ask" or memory queries = general
- Greetings, thanks, casual chat = general
- When uncertain = general (as default)
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
          "research",
          "general",
        ]),
        reason: z.string().optional(),
      }),
      execute: async ({ agent, reason }) => ({ agent, reason }),
    }),
  },
});

type HandoffData = { agent: keyof typeof specialists; reason?: string };

export async function POST(request: Request) {
  const { messages } = await request.json();
  const conversationMessages = convertToModelMessages(messages).slice(-8); // Only keep last 8 messages

  return createUIMessageStreamResponse({
    experimental_transform: smoothStream(),
    stream: createUIMessageStream<AgentUIMessage>({
      execute: async ({ writer }) => {
        // Set up artifact context with writer
        setContext({
          writer,
          userId: "demo-user",
          fullName: "Demo User",
          db: null,
          user: {
            teamId: "demo-team",
            baseCurrency: "USD",
            locale: "en-US",
            fullName: "Demo User",
          },
        });

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

        // Agent name lookup - WeakMap for O(1) performance
        type AgentName =
          | "orchestrator"
          | "reports"
          | "transactions"
          | "invoices"
          | "timeTracking"
          | "customers"
          | "analytics"
          | "operations"
          | "research"
          | "general";
        const agentNames = new WeakMap<object, AgentName>([
          [orchestrator, "orchestrator"],
          [specialists.reports, "reports"],
          [specialists.transactions, "transactions"],
          [specialists.invoices, "invoices"],
          [specialists.timeTracking, "timeTracking"],
          [specialists.customers, "customers"],
          [specialists.analytics, "analytics"],
          [specialists.operations, "operations"],
          [specialists.research, "research"],
          [specialists.general, "general"],
        ]);

        while (round++ < CONFIG.orchestration.maxRounds) {
          const agentName: AgentName =
            agentNames.get(currentAgent) ?? "general";

          // Send status: agent executing
          writer.write({
            type: "data-agent-status",
            data: {
              status: "executing",
              agent: agentName,
            },
            transient: true,
          });

          // 🎯 CONTEXT STRATEGY
          const messagesToSend =
            currentAgent === orchestrator
              ? [conversationMessages[conversationMessages.length - 1]] // Latest only
              : conversationMessages.slice(-CONFIG.orchestration.contextWindow); // Recent context

          const result = currentAgent.stream({
            messages: messagesToSend,
          });

          // This automatically converts fullStream to proper UI message chunks
          // Enable sendSources to include source-url parts for web search citations
          const uiStream = result.toUIMessageStream({
            sendSources: true,
          });

          // Track for orchestration
          let textAccumulated = "";
          let handoffData: HandoffData | null = null;
          const toolCallNames = new Map<string, string>(); // toolCallId -> toolName
          let hasStartedContent = false;

          // Stream UI chunks - AI SDK handles all the formatting!
          for await (const chunk of uiStream) {
            // Clear status on first actual content (text or tool)
            if (
              !hasStartedContent &&
              (chunk.type === "text-delta" || chunk.type === "tool-input-start")
            ) {
              writer.write({
                type: "data-agent-status",
                data: { status: "completing", agent: agentName },
                transient: true,
              });
              hasStartedContent = true;
            }

            // Write chunk - type assertion needed because our custom AgentUIMessage
            // type is more restrictive than the chunks from toUIMessageStream()
            writer.write(chunk as any);

            // Track text for conversation history
            if (chunk.type === "text-delta") {
              textAccumulated += chunk.delta;
            }

            // Track tool names when they start
            if (chunk.type === "tool-input-start") {
              toolCallNames.set(chunk.toolCallId, chunk.toolName);
            }

            // Detect handoff from tool output
            if (chunk.type === "tool-output-available") {
              const toolName = toolCallNames.get(chunk.toolCallId);
              if (toolName === "handoff") {
                handoffData = chunk.output as HandoffData;
                console.log("[Handoff Detected]", handoffData);
              }
            }
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
