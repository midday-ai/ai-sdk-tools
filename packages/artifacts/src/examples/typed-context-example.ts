import { openai } from "@ai-sdk/openai";
import { artifact, createTypedContext } from "@ai-sdk-tools/artifacts";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from "ai";
import { z } from "zod";
import type { BaseContext } from "../types";

// 1. Define your custom context type
interface MyToolContext extends BaseContext {
  userId: string;
  sessionId: string;
  permissions: string[];
  config: {
    maxArtifacts: number;
    theme: "light" | "dark";
  };
  metadata?: Record<string, unknown>;
}

// 2. Create typed context helpers
const { setContext, getContext } = createTypedContext<MyToolContext>();

// 3. Define artifacts
const BurnRate = artifact(
  "burn-rate",
  z.object({
    title: z.string(),
    stage: z.enum(["loading", "processing", "complete"]).default("loading"),
    data: z
      .array(
        z.object({
          month: z.string(),
          burnRate: z.number(),
        }),
      )
      .default([]),
  }),
);

// 4. Create tools that use typed context (direct AI SDK format)
const analyzeBurnRate = {
  description: "Analyze company burn rate",
  inputSchema: z.object({
    company: z.string(),
  }),
  execute: async ({ company }: { company: string }) => {
    // Get fully typed context
    const context = getContext(); // TypeScript knows this is MyToolContext

    // Type-safe access to context properties
    console.log("Processing for user:", context.userId);
    console.log("Theme preference:", context.config.theme);
    console.log("Has write permission:", context.permissions.includes("write"));

    // Check permissions
    if (!context.permissions.includes("analytics")) {
      throw new Error("Insufficient permissions for analytics");
    }

    const analysis = BurnRate.stream({
      title: `${company} Analysis for ${context.userId}`,
      stage: "loading",
    });

    // Simulate processing with context-aware logic
    analysis.progress = 0.3;
    await analysis.update({
      stage: "processing",
      title: `${company} Analysis (${context.config.theme} theme)`,
    });

    // Complete with context data
    await analysis.complete({
      title: `${company} Analysis Complete`,
      stage: "complete",
      data: [
        { month: "2024-01", burnRate: 50000 },
        { month: "2024-02", burnRate: 45000 },
      ],
    });

    return `Analysis complete for ${company}. Results customized for user ${context.userId}.`;
  },
};

// 5. Route handler with typed context setup
export async function POST(req: Request) {
  const { messages } = await req.json();

  // Extract user info from request (example)
  const userId = req.headers.get("user-id") || "anonymous";
  const permissions = req.headers.get("permissions")?.split(",") || ["read"];

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // Set typed context
      setContext({
        writer,
        userId,
        sessionId: `session-${Date.now()}`,
        permissions,
        config: {
          maxArtifacts: 10,
          theme: "dark",
        },
        metadata: {
          requestTime: Date.now(),
          userAgent: req.headers.get("user-agent"),
        },
      });

      const result = streamText({
        model: openai("gpt-4"),
        messages,
        tools: { analyzeBurnRate },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}

// 6. Helper function to get current user (can be used anywhere)
export function getCurrentUser() {
  const context = getContext();
  return {
    id: context.userId,
    permissions: context.permissions,
    theme: context.config.theme,
  };
}

// 7. Context-aware utility function
export function createUserSpecificArtifact(
  artifactDef: ReturnType<typeof artifact>,
  data: Record<string, unknown>,
) {
  const context = getContext();

  return artifactDef.stream({
    ...data,
    userId: context.userId,
    sessionId: context.sessionId,
    theme: context.config.theme,
  });
}
