// Mock utility functions that mirror your real @midday/utils

export function formatAmount(params: {
  amount: number;
  currency: string;
  locale?: string;
}): string {
  const { amount, currency, locale = 'en-US' } = params;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function safeValue<T>(value: T | null | undefined): T | null {
  return value ?? null;
}

// Mock follow-up question generation
export async function generateFollowupQuestions(
  toolName: string,
  analysisText: string
): Promise<string[]> {
  console.log(`[MockUtils] Generating follow-up questions for ${toolName}`);
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    "What specific expense categories should I focus on reducing?",
    "How does my burn rate compare to industry benchmarks?",
    "What's the best strategy to extend my runway?",
    "Should I consider fundraising based on these metrics?",
  ];
}
