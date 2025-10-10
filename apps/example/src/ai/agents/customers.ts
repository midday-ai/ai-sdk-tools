import { openai } from "@ai-sdk/openai";
import { Agent } from "@ai-sdk-tools/agents";
import {
  createCustomerTool,
  customerProfitabilityTool,
  getCustomerTool,
  updateCustomerTool,
} from "../tools/customers";
import { AGENT_CONTEXT, getContextPrompt } from "./shared";

export const customersAgent = new Agent({
  name: "customers",
  model: openai("gpt-4o-mini"),
  instructions: `${getContextPrompt()}

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
  matchOn: [
    "customer",
    "client",
    "customer profitability",
    "customer analysis",
  ],
  maxTurns: 5,
});
