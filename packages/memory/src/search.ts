import type { MemoryProvider, ConversationMessage } from "./types.js";

/**
 * Search options for finding messages in conversation history
 */
export interface SearchOptions {
  /** Chat ID to search within */
  chatId: string;
  /** User ID to search within (optional) */
  userId?: string;
  /** Search query - can be a string or regex pattern */
  query: string | RegExp;
  /** Maximum number of messages to retrieve for searching */
  limit?: number;
  /** Whether to search case-sensitive (default: false) */
  caseSensitive?: boolean;
  /** Whether to search user messages only (default: false - searches all) */
  userMessagesOnly?: boolean;
  /** Maximum number of results to return */
  maxResults?: number;
}

/**
 * Search result with message and match information
 */
export interface SearchResult {
  /** The matching message */
  message: ConversationMessage;
  /** The index of the message in the conversation */
  index: number;
  /** The matched text */
  match: string;
}

/**
 * Search through conversation history for specific content
 *
 * @param provider - Memory provider to use for searching
 * @param options - Search options
 * @returns Array of search results
 */
export async function searchConversationHistory(
  provider: MemoryProvider,
  options: SearchOptions
): Promise<SearchResult[]> {
  // Use native search if available
  if (provider.searchMessages) {
    try {
      // For string queries, use native search
      if (typeof options.query === "string") {
        const messages = await provider.searchMessages({
          chatId: options.chatId,
          userId: options.userId,
          query: options.query,
          limit: options.limit,
        });

        // Filter messages if needed
        let filteredMessages = messages;
        if (options.userMessagesOnly) {
          filteredMessages = messages.filter((msg) => msg.role === "user");
        }

        // Convert to search results
        return filteredMessages.map((message, index) => ({
          message,
          index: index,
          match: options.query as string,
        }));
      }
    } catch (error) {
      // Fall back to manual search if native search fails
      console.warn(
        "Native search failed, falling back to manual search",
        error
      );
    }
  }

  // Get messages from the provider
  const messages = await provider.getMessages?.({
    chatId: options.chatId,
    limit: options.limit || 100, // Default to 100 messages if not specified
  });

  if (!messages || messages.length === 0) {
    return [];
  }

  // Filter messages if needed
  let filteredMessages = messages;
  if (options.userMessagesOnly) {
    filteredMessages = messages.filter((msg) => msg.role === "user");
  }

  // Prepare search query
  const isRegex = options.query instanceof RegExp;
  const searchQuery = isRegex
    ? options.query
    : options.caseSensitive
    ? (options.query as string)
    : (options.query as string).toLowerCase();

  const results: SearchResult[] = [];

  // Search through messages
  for (let i = 0; i < filteredMessages.length; i++) {
    const message = filteredMessages[i];
    const messageContent = options.caseSensitive
      ? message.content
      : message.content.toLowerCase();

    let match: string | null = null;

    if (isRegex) {
      const regex = searchQuery as RegExp;
      const matchResult = messageContent.match(regex);
      if (matchResult) {
        match = matchResult[0];
      }
    } else {
      const queryString = searchQuery as string;
      if (messageContent.includes(queryString)) {
        match = queryString;
      }
    }

    if (match) {
      results.push({
        message,
        index: messages.indexOf(message), // Index in original array
        match,
      });
    }

    // Early exit if we have enough results
    if (options.maxResults && results.length >= options.maxResults) {
      break;
    }
  }

  return results;
}

/**
 * Find the most recent message that matches a query
 *
 * @param provider - Memory provider to use for searching
 * @param options - Search options
 * @returns The most recent matching message or null if none found
 */
export async function findRecentMessage(
  provider: MemoryProvider,
  options: SearchOptions
): Promise<SearchResult | null> {
  const results = await searchConversationHistory(provider, {
    ...options,
    maxResults: 1,
  });

  // Since we're searching through messages in order, the first result
  // should be the most recent if we reverse the array first
  const messages = await provider.getMessages?.({
    chatId: options.chatId,
    limit: options.limit || 100,
  });

  if (!messages || messages.length === 0 || results.length === 0) {
    return null;
  }

  // Find the result with the highest index (most recent)
  const mostRecent = results.reduce((prev, current) =>
    current.index > prev.index ? current : prev
  );

  return mostRecent || null;
}
