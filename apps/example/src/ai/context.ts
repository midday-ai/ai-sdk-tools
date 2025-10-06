import { type BaseContext, createTypedContext } from "@ai-sdk-tools/artifacts";

// Define custom context type with database and user info (mirrors real app)
interface ChatContext extends BaseContext {
  userId: string;
  fullName: string;
  db: any; // Mock database
  user: {
    teamId: string;
    baseCurrency: string;
    locale: string;
    fullName: string;
  };
}

// Create typed context helpers
const { setContext, getContext } = createTypedContext<ChatContext>();

// Helper function to get current user context (can be used in tools)
export function getCurrentUser() {
  const context = getContext();
  return {
    id: context.userId,
    fullName: context.fullName,
  };
}

export { setContext, getContext };
