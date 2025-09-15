import type { UIMessage } from "@ai-sdk/react";
import { useChatMessages } from "@ai-sdk-tools/store";
import { useEffect, useState } from "react";
import type { z } from "zod";
import type {
  ArtifactCallbacks,
  ArtifactData,
  ArtifactStatus,
  UseArtifactReturn,
} from "./types";

// Type to extract the inferred type from an artifact definition
type InferArtifactType<T> = T extends { schema: z.ZodSchema<infer U> }
  ? U
  : never;

// Types for message parts that might contain artifacts
interface ArtifactPart<T = unknown> {
  type: string;
  data?: ArtifactData<T>;
}

export function useArtifact<
  T extends { id: string; schema: z.ZodSchema<unknown> },
>(
  artifactDef: T,
  callbacks?: ArtifactCallbacks<InferArtifactType<T>>,
  storeId?: string,
): UseArtifactReturn<InferArtifactType<T>> {
  // Get messages from the chat store
  const messages = useChatMessages(storeId);

  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData<
    InferArtifactType<T>
  > | null>(null);

  useEffect(() => {
    const artifacts = extractArtifactsFromMessages<InferArtifactType<T>>(
      messages,
      artifactDef.id,
    );
    const latest = artifacts[0] || null;

    if (
      latest &&
      (!currentArtifact || latest.version > currentArtifact.version)
    ) {
      const prevData = currentArtifact?.payload || null;

      // Fire callbacks
      if (callbacks?.onUpdate && latest.payload !== prevData) {
        callbacks.onUpdate(latest.payload, prevData);
      }

      if (
        callbacks?.onComplete &&
        latest.status === "complete" &&
        currentArtifact?.status !== "complete"
      ) {
        callbacks.onComplete(latest.payload);
      }

      if (
        callbacks?.onError &&
        latest.status === "error" &&
        currentArtifact?.status !== "error"
      ) {
        callbacks.onError(latest.error || "Unknown error", latest.payload);
      }

      if (
        callbacks?.onProgress &&
        latest.progress !== currentArtifact?.progress
      ) {
        callbacks.onProgress(latest.progress || 0, latest.payload);
      }

      if (
        callbacks?.onStatusChange &&
        latest.status !== currentArtifact?.status
      ) {
        callbacks.onStatusChange(
          latest.status,
          currentArtifact?.status || "idle",
        );
      }

      setCurrentArtifact(latest);
    }
  }, [messages, artifactDef.id, currentArtifact, callbacks]);

  const status: ArtifactStatus = currentArtifact?.status || "idle";
  const isActive = status === "loading" || status === "streaming";

  return {
    data: currentArtifact?.payload || null,
    status,
    progress: currentArtifact?.progress,
    error: currentArtifact?.error,
    isActive,
    hasData: currentArtifact !== null,
  };
}

function extractArtifactsFromMessages<T>(
  messages: UIMessage[],
  artifactType: string,
): ArtifactData<T>[] {
  const artifacts = new Map<string, ArtifactData<T>>();

  for (const message of messages) {
    // Check message parts for artifact data
    if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        // Check if this part is an artifact of the type we're looking for
        if (part.type === `data-artifact-${artifactType}` && "data" in part) {
          const artifactPart = part as ArtifactPart<T>;
          if (artifactPart.data) {
            const existing = artifacts.get(artifactPart.data.id);
            if (!existing || artifactPart.data.version > existing.version) {
              artifacts.set(artifactPart.data.id, artifactPart.data);
            }
          }
        }

        // Also check tool call results that might contain artifacts
        if (part.type.startsWith("tool-") && "result" in part && part.result) {
          const result = part.result;
          if (typeof result === "object" && result && "parts" in result) {
            const parts = (result as { parts?: ArtifactPart<T>[] }).parts;
            if (Array.isArray(parts)) {
              for (const nestedPart of parts) {
                if (
                  nestedPart.type === `data-artifact-${artifactType}` &&
                  nestedPart.data
                ) {
                  const existing = artifacts.get(nestedPart.data.id);
                  if (!existing || nestedPart.data.version > existing.version) {
                    artifacts.set(nestedPart.data.id, nestedPart.data);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return Array.from(artifacts.values()).sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}
