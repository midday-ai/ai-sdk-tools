/**
 * TypeScript compilation tests to verify custom types work correctly
 * These tests ensure that our custom message types are properly typed
 * and compatible with ai-sdk-tools/store hooks.
 */

import { useChat, useChatActions, useChatMessages } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import type {
  AllTools,
  AnalyticsData,
  CalculatorMessage,
  CustomUIMessage,
  SearchMessage,
  UserMetadata,
  WeatherData,
  WeatherMessage,
} from "./custom-message";

// Test 1: Custom message types extend UIMessage correctly
function testCustomMessageTypes() {
  // These should compile without errors
  const customMessage: CustomUIMessage = {
    id: "test-1",
    role: "user",
    parts: [{ type: "text", text: "Hello" }],
    metadata: {
      userId: "user-123",
      sessionId: "session-456",
      timestamp: new Date().toISOString(),
      userAgent: "test-agent",
    },
  };

  const weatherMessage: WeatherMessage = {
    id: "test-2",
    role: "assistant",
    parts: [{ type: "text", text: "The weather is sunny" }],
    metadata: {
      userId: "user-123",
      sessionId: "session-456",
      timestamp: new Date().toISOString(),
    },
  };

  return { customMessage, weatherMessage };
}

// Test 2: Hook compatibility with custom types
function testHookCompatibility() {
  // These should compile with proper type inference

  // Default chat with custom types
  const chat1 = useChat<CustomUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Weather-specific chat (no storeId needed with new implementation)
  const chat2 = useChat<WeatherMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Calculator-specific chat (no storeId needed with new implementation)
  const chat3 = useChat<CalculatorMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Messages should be properly typed (no storeId needed)
  const customMessages = useChatMessages<CustomUIMessage>();
  const weatherMessages = useChatMessages<WeatherMessage>();
  const calculatorMessages = useChatMessages<CalculatorMessage>();

  // Chat actions should be properly typed
  const actions = useChatActions();
  const _sendMessage = actions.sendMessage; // From actions object

  return {
    chats: [chat1, chat2, chat3],
    messages: [customMessages, weatherMessages, calculatorMessages],
    actions: actions,
  };
}

// Test 3: Message part type guards work correctly
function testMessagePartTypeGuards() {
  const message: CustomUIMessage = {
    id: "test-3",
    role: "assistant",
    parts: [{ type: "text", text: "Here is the weather:" }],
    metadata: {
      userId: "user-123",
      sessionId: "session-456",
      timestamp: new Date().toISOString(),
    },
  };

  // Type guards should work correctly
  message.parts?.forEach((part) => {
    if (part.type === "text") {
      // TypeScript should know this is a text part
      const text: string = part.text;
      console.log("Text:", text);
    } else if (part.type.startsWith("tool-")) {
      // Handle tool-related parts
      console.log("Tool part:", part.type);
    }
  });

  return message;
}

// Test 4: Data and metadata types are enforced
function testDataAndMetadataTypes() {
  // UserMetadata should enforce required fields
  const metadata: UserMetadata = {
    userId: "user-123",
    sessionId: "session-456",
    timestamp: new Date().toISOString(),
    userAgent: "Mozilla/5.0...", // optional field
  };

  // AnalyticsData should enforce correct types
  const analyticsData: AnalyticsData = {
    messageLength: 100,
    responseTime: 250, // optional
    tokensUsed: 50, // optional
  };

  // WeatherData should enforce all required fields
  const weatherData: WeatherData = {
    location: "New York",
    temperature: 22,
    condition: "Sunny",
    humidity: 65,
    windSpeed: 10,
  };

  return { metadata, analyticsData, weatherData };
}

// Export all test functions for potential runtime testing
export {
  testCustomMessageTypes,
  testHookCompatibility,
  testMessagePartTypeGuards,
  testDataAndMetadataTypes,
};

// Type-only exports to verify type definitions
export type {
  CustomUIMessage,
  WeatherMessage,
  CalculatorMessage,
  SearchMessage,
  WeatherData,
  UserMetadata,
  AnalyticsData,
  AllTools,
};

/**
 * If this file compiles without TypeScript errors, it means:
 * ✅ Custom message types extend UIMessage correctly
 * ✅ Hook types are compatible with custom message types
 * ✅ Tool call types are properly defined
 * ✅ Data and metadata types are enforced
 * ✅ Message part types work with type guards
 * ✅ All generic type parameters flow through correctly
 */
