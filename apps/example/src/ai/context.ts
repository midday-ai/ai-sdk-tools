// Define custom context type with database and user info (mirrors real app)
export interface ChatContext {
  userId: string;
  fullName: string;
  db: unknown; // Mock database
  user: {
    teamId: string;
    baseCurrency: string;
    locale: string;
    fullName: string;
  };
}

// Global context store
let currentContext: ChatContext | null = null;

// Context helpers
export function setContext(context: ChatContext): void {
  currentContext = context;
}

export function getContext(): ChatContext {
  if (!currentContext) {
    throw new Error("Context not set. Call setContext() first.");
  }
  return currentContext;
}

// Helper function to get current user context (can be used in tools)
export function getCurrentUser() {
  const context = getContext();
  return {
    id: context.userId,
    fullName: context.fullName,
  };
}
