import type { UIMessage } from "ai";

// Custom data types for different scenarios
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  [key: string]: any; // Index signature for UIDataTypes compatibility
}

export interface UserMetadata {
  userId: string;
  sessionId: string;
  timestamp: string;
  userAgent?: string;
  [key: string]: any; // Index signature for metadata compatibility
}

export interface AnalyticsData {
  messageLength: number;
  responseTime?: number;
  tokensUsed?: number;
  [key: string]: any; // Index signature for UIDataTypes compatibility
}

// Tool definitions with index signatures
export interface WeatherTool {
  getWeather: {
    input: { location: string };
    output: WeatherData;
  };
  [key: string]: any; // Index signature for UITools compatibility
}

export interface CalculatorTool {
  calculate: {
    input: { expression: string };
    output: { result: number; expression: string };
  };
  [key: string]: any; // Index signature for UITools compatibility
}

export interface SearchTool {
  search: {
    input: { query: string; limit?: number };
    output: { results: Array<{ title: string; url: string; snippet: string }> };
  };
  [key: string]: any; // Index signature for UITools compatibility
}

// Combined tool interface
export interface AllTools extends WeatherTool, CalculatorTool, SearchTool {}

// Custom message types
export interface CustomUIMessage
  extends UIMessage<
    UserMetadata, // metadata type
    AnalyticsData, // data type
    AllTools // tools type
  > {}

// Specialized message types for different use cases
export interface WeatherMessage
  extends UIMessage<UserMetadata, WeatherData, WeatherTool> {}

export interface CalculatorMessage
  extends UIMessage<
    UserMetadata,
    { result: number; expression: string; [key: string]: any },
    CalculatorTool
  > {}

export interface SearchMessage
  extends UIMessage<
    UserMetadata,
    { searchQuery: string; resultCount: number; [key: string]: any },
    SearchTool
  > {}

// Message part type guards
export function isTextPart(part: any): part is { type: "text"; text: string } {
  return part && part.type === "text" && typeof part.text === "string";
}

export function isToolCallPart(part: any): part is {
  type: "tool-call";
  toolCallId: string;
  toolName: string;
  args: any;
} {
  return part && part.type === "tool-call" && part.toolCallId && part.toolName;
}

export function isToolResultPart(part: any): part is {
  type: "tool-result";
  toolCallId: string;
  toolName: string;
  result: any;
} {
  return (
    part && part.type === "tool-result" && part.toolCallId && part.toolName
  );
}

export function isDataPart(part: any): part is { type: "data"; data: any } {
  return part && part.type === "data" && part.data !== undefined;
}

// Utility functions for working with custom messages
export function extractWeatherData(message: any): WeatherData | null {
  // Check if message has data with weather properties
  if (
    message?.experimental_providerMetadata?.custom?.data &&
    "location" in message.experimental_providerMetadata.custom.data &&
    "temperature" in message.experimental_providerMetadata.custom.data
  ) {
    return message.experimental_providerMetadata.custom.data as WeatherData;
  }
  return null;
}

export function getToolCalls(message: CustomUIMessage) {
  return message.parts?.filter(isToolCallPart) || [];
}

export function getToolResults(message: CustomUIMessage) {
  return message.parts?.filter(isToolResultPart) || [];
}

export function getTextContent(message: CustomUIMessage): string {
  return (
    message.parts
      ?.filter(isTextPart)
      .map((part) => part.text)
      .join("") || ""
  );
}
