import type { UIMessage } from "@ai-sdk/react";
import { useChatMessages } from "@ai-sdk-tools/store";
import { useEffect, useState, useMemo } from "react";
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
): UseArtifactReturn<InferArtifactType<T>> {
  // Get messages from the chat store
  const messages = useChatMessages();

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
      (!currentArtifact || 
       latest.version > currentArtifact.version ||
       (latest.version === currentArtifact.version && latest.createdAt > currentArtifact.createdAt))
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

// Listening to all artifacts with filtering options
export interface UseArtifactsOptions {
  onData?: (artifactType: string, data: ArtifactData<unknown>) => void;
  include?: string[]; // Only listen to these artifact types
  exclude?: string[]; // Ignore these artifact types
}

export interface UseArtifactsReturn {
  byType: Record<string, ArtifactData<unknown>[]>;
  latest: Record<string, ArtifactData<unknown>>;
  artifacts: ArtifactData<unknown>[];
  current: ArtifactData<unknown> | null;
}

export function useArtifacts(
  options: UseArtifactsOptions = {},
): UseArtifactsReturn {
  const { onData, include, exclude } = options;
  const messages = useChatMessages();

  const includeKey = include?.join(',');
  const excludeKey = exclude?.join(',');

  return useMemo(() => {
    const allArtifacts = extractAllArtifactsFromMessages(messages);

    // Filter artifacts based on include/exclude options
    const filteredArtifacts = allArtifacts.filter(artifact => {
      if (include?.length) return include.includes(artifact.type);
      if (exclude?.length) return !exclude.includes(artifact.type);
      return true;
    });

    // Group by type
    const byType: Record<string, ArtifactData<unknown>[]> = {};
    const latest: Record<string, ArtifactData<unknown>> = {};

    for (const artifact of filteredArtifacts) {
      if (!byType[artifact.type]) {
        byType[artifact.type] = [];
      }
      byType[artifact.type].push(artifact);

      // Track latest version for each type
      if (
        !latest[artifact.type] ||
        artifact.version > latest[artifact.type].version ||
        (artifact.version === latest[artifact.type].version && artifact.createdAt > latest[artifact.type].createdAt)
      ) {
        const prevLatest = latest[artifact.type];
        latest[artifact.type] = artifact;

        // Fire callback if this is a new or updated artifact
        if (onData && (!prevLatest || 
                       artifact.version > prevLatest.version ||
                       (artifact.version === prevLatest.version && artifact.createdAt > prevLatest.createdAt))) {
          onData(artifact.type, artifact);
        }
      }
    }

    // Sort each type by creation time (newest first)
    for (const type in byType) {
      byType[type].sort((a, b) => b.createdAt - a.createdAt);
    }

    return {
      byType,
      latest,
      artifacts: filteredArtifacts,
      current: filteredArtifacts[0] || null,
    };
  }, [messages, onData, includeKey, excludeKey]);
}

function extractAllArtifactsFromMessages(
  messages: UIMessage[],
): ArtifactData<unknown>[] {
  const artifacts = new Map<string, ArtifactData<unknown>>();

  for (const message of messages) {
    // Check message parts for artifact data
    if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        // Check if this part is any artifact type
        if (part.type.startsWith("data-artifact-") && "data" in part) {
          const artifactPart = part as ArtifactPart<unknown>;
          if (artifactPart.data) {
            const existing = artifacts.get(artifactPart.data.id);
            if (!existing || 
                artifactPart.data.version > existing.version ||
                (artifactPart.data.version === existing.version && artifactPart.data.createdAt > existing.createdAt)) {
              artifacts.set(artifactPart.data.id, artifactPart.data);
            }
          }
        }

        // Also check tool call results that might contain artifacts
        if (part.type.startsWith("tool-") && "result" in part && part.result) {
          const result = part.result;
          if (typeof result === "object" && result && "parts" in result) {
            const parts = (result as { parts?: ArtifactPart<unknown>[] }).parts;
            if (Array.isArray(parts)) {
              for (const nestedPart of parts) {
                if (
                  nestedPart.type.startsWith("data-artifact-") &&
                  nestedPart.data
                ) {
                  const existing = artifacts.get(nestedPart.data.id);
                  if (!existing || 
                      nestedPart.data.version > existing.version ||
                      (nestedPart.data.version === existing.version && nestedPart.data.createdAt > existing.createdAt)) {
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
            if (!existing || 
                artifactPart.data.version > existing.version ||
                (artifactPart.data.version === existing.version && artifactPart.data.createdAt > existing.createdAt)) {
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
                  if (!existing || 
                      nestedPart.data.version > existing.version ||
                      (nestedPart.data.version === existing.version && nestedPart.data.createdAt > existing.createdAt)) {
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
