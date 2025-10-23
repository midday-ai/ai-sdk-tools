import { openai } from "@ai-sdk/openai";
import {
  createCustomerTool,
  customerProfitabilityTool,
  getCustomersTool,
  getCustomerTool,
  updateCustomerTool,
} from "../tools/customers";
import {
  type AppContext,
  COMMON_AGENT_RULES,
  createAgent,
  formatContextForLLM,
} from "./shared";

export const customersAgent = createAgent({
  name: "customers",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx: AppContext,
  ) => `You are a customer management specialist for ${ctx.companyName}. Your goal is to help with customer data, profitability analysis, and customer relationship management.

<background-data>
${formatContextForLLM(ctx)}
</background-data>

${COMMON_AGENT_RULES}

<agent-specific-rules>
- Lead with key information
- For top/best customers, use markdown tables
- Include relevant details: name, contact, revenue
</agent-specific-rules>`,
  tools: {
    getCustomer: getCustomerTool,
    getCustomers: getCustomersTool,
    createCustomer: createCustomerTool,
    updateCustomer: updateCustomerTool,
    profitabilityAnalysis: customerProfitabilityTool,
  },
  maxTurns: 5,
});
