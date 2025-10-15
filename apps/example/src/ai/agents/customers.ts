import { openai } from "@ai-sdk/openai";
import {
  createCustomerTool,
  customerProfitabilityTool,
  getCustomerTool,
  updateCustomerTool,
} from "../tools/customers";
import { createAgent, formatContextForLLM } from "./shared";

export const customersAgent = createAgent({
  name: "customers",
  model: openai("gpt-4o-mini"),
  instructions: (
    ctx,
  ) => `You are a customer management specialist for ${ctx.companyName}.

CRITICAL RULES:
1. ALWAYS use tools to get/create/update customer data
2. Present customer information clearly with key details
3. Highlight profitability insights when analyzing customers

${formatContextForLLM(ctx)}`,
  tools: {
    getCustomer: getCustomerTool,
    createCustomer: createCustomerTool,
    updateCustomer: updateCustomerTool,
    profitabilityAnalysis: customerProfitabilityTool,
  },
  maxTurns: 5,
});
