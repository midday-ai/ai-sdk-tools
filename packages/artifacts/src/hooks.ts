import type { UIMessage } from "@ai-sdk/react";
import { useChatActions, useChatMessages } from "@ai-sdk-tools/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { z } from "zod";
import type {
  ArtifactData,
  ArtifactStatus,
  UseArtifactActions,
  UseArtifactOptions,
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

/**
 * Remove artifact part from a message by artifact ID
 */
function removeArtifactFromMessage(
  message: UIMessage,
  artifactId: string,
): UIMessage | null {
  if (!message.parts || !Array.isArray(message.parts)) {
    return message;
  }

  const updatedParts = message.parts.filter((part) => {
    // Check if this part is an artifact part
    if (part.type.startsWith("data-artifact-") && "data" in part) {
      const artifactPart = part as { type: string; data?: { id?: string } };
      if (artifactPart.data?.id === artifactId) {
        return false; // Remove this part
      }
    }

    // Check tool call results that might contain artifacts
    if (part.type.startsWith("tool-") && "result" in part && part.result) {
      const result = part.result;
      if (typeof result === "object" && result && "parts" in result) {
        const parts = (result as { parts?: unknown[] }).parts;
        if (Array.isArray(parts)) {
          const filteredParts = parts.filter((nestedPart: unknown) => {
            const part = nestedPart as {
              type?: string;
              data?: { id?: string };
            };
            if (
              part.type?.startsWith("data-artifact-") &&
              part.data?.id === artifactId
            ) {
              return false; // Remove this nested part
            }
            return true;
          });

          // If we removed parts, update the result
          if (filteredParts.length !== parts.length) {
            const toolPart = part as {
              type: string;
              result?: unknown;
            };
            toolPart.result = {
              ...(result as Record<string, unknown>),
              parts: filteredParts,
            };
          }
        }
      }
    }

    return true;
  });

  // If no parts remain, return null to indicate message should be removed
  if (updatedParts.length === 0) {
    return null;
  }

  return {
    ...message,
    parts: updatedParts,
  };
}

export function useArtifact<
  T extends { id: string; schema: z.ZodSchema<unknown> },
>(
  artifactDef: T,
  options?: UseArtifactOptions<InferArtifactType<T>>,
): [UseArtifactReturn<InferArtifactType<T>>, UseArtifactActions] {
  // Get messages from the chat store
  const messages = useChatMessages();
  const { replaceMessageById } = useChatActions();
  const { version: versionIndex } = options || {};
  const includeVersions = versionIndex !== undefined;

  // Store callbacks in ref to avoid dependency issues
  const callbacksRef = useRef(options);
  useEffect(() => {
    callbacksRef.current = options;
  }, [options]);

  const [currentArtifact, setCurrentArtifact] = useState<ArtifactData<
    InferArtifactType<T>
  > | null>(null);

  // Get all artifacts (needed for both version selection and latest tracking)
  const allArtifacts = useMemo(
    () =>
      extractArtifactsFromMessages<InferArtifactType<T>>(
        messages,
        artifactDef.id,
      ),
    [messages, artifactDef.id],
  );
  const latest = allArtifacts[0] || null;

  useEffect(() => {
    if (
      latest &&
      (!currentArtifact ||
        latest.version > currentArtifact.version ||
        (latest.version === currentArtifact.version &&
          latest.createdAt > currentArtifact.createdAt))
    ) {
      const prevData = currentArtifact?.payload || null;
      const currentCallbacks = callbacksRef.current;

      // Fire callbacks only for latest artifact (when not using version selection)
      if (!includeVersions) {
        if (
          currentCallbacks &&
          "onUpdate" in currentCallbacks &&
          currentCallbacks.onUpdate &&
          latest.payload !== prevData
        ) {
          currentCallbacks.onUpdate(latest.payload, prevData);
        }

        if (
          currentCallbacks &&
          "onComplete" in currentCallbacks &&
          currentCallbacks.onComplete &&
          latest.status === "complete" &&
          currentArtifact?.status !== "complete"
        ) {
          currentCallbacks.onComplete(latest.payload);
        }

        if (
          currentCallbacks &&
          "onError" in currentCallbacks &&
          currentCallbacks.onError &&
          latest.status === "error" &&
          currentArtifact?.status !== "error"
        ) {
          currentCallbacks.onError(
            latest.error || "Unknown error",
            latest.payload,
          );
        }

        if (
          currentCallbacks &&
          "onProgress" in currentCallbacks &&
          currentCallbacks.onProgress &&
          latest.progress !== currentArtifact?.progress
        ) {
          currentCallbacks.onProgress(latest.progress || 0, latest.payload);
        }

        if (
          currentCallbacks &&
          "onStatusChange" in currentCallbacks &&
          currentCallbacks.onStatusChange &&
          latest.status !== currentArtifact?.status
        ) {
          currentCallbacks.onStatusChange(
            latest.status,
            currentArtifact?.status || "idle",
          );
        }
      }

      setCurrentArtifact(latest);
    }
  }, [latest, currentArtifact, includeVersions]);

  // Memoize stable empty versions array for default case
  const emptyVersions = useMemo(
    () => [] as ArtifactData<InferArtifactType<T>>[],
    [],
  );

  // Create delete function
  const deleteArtifact = useCallback(
    (artifactId: string) => {
      // Find the message containing this artifact
      for (const message of messages) {
        if (!message.parts || !Array.isArray(message.parts)) continue;

        // Check message parts
        for (const part of message.parts) {
          if (part.type.startsWith("data-artifact-") && "data" in part) {
            const artifactPart = part as {
              type: string;
              data?: { id?: string };
            };
            if (artifactPart.data?.id === artifactId) {
              const updatedMessage = removeArtifactFromMessage(
                message,
                artifactId,
              );
              if (updatedMessage) {
                replaceMessageById(message.id, updatedMessage);
              }
              return;
            }
          }

          // Check tool call results
          if (
            part.type.startsWith("tool-") &&
            "result" in part &&
            part.result
          ) {
            const result = part.result;
            if (typeof result === "object" && result && "parts" in result) {
              const parts = (result as { parts?: unknown[] }).parts;
              if (Array.isArray(parts)) {
                const hasArtifact = parts.some((p: unknown) => {
                  const part = p as { type?: string; data?: { id?: string } };
                  return (
                    part.type?.startsWith("data-artifact-") &&
                    part.data?.id === artifactId
                  );
                });
                if (hasArtifact) {
                  const updatedMessage = removeArtifactFromMessage(
                    message,
                    artifactId,
                  );
                  if (updatedMessage) {
                    replaceMessageById(message.id, updatedMessage);
                  }
                  return;
                }
              }
            }
          }
        }
      }
    },
    [messages, replaceMessageById],
  );

  // Memoize actions object
  const actions = useMemo(
    (): UseArtifactActions => ({
      delete: deleteArtifact,
    }),
    [deleteArtifact],
  );

  // Memoize return value - handle both version selection and latest artifact cases
  const artifactData = useMemo(() => {
    // If version index is provided, return that specific version
    if (includeVersions && versionIndex !== undefined) {
      // Clamp version index to valid range
      const clampedIndex = Math.max(
        0,
        Math.min(versionIndex, allArtifacts.length - 1),
      );
      const selectedArtifact =
        allArtifacts[clampedIndex] || allArtifacts[0] || null;

      const status: ArtifactStatus = selectedArtifact?.status || "idle";
      const isActive = status === "loading" || status === "streaming";

      return {
        data: selectedArtifact?.payload || null,
        status,
        progress: selectedArtifact?.progress,
        error: selectedArtifact?.error,
        isActive,
        hasData: selectedArtifact !== null,
        versions: allArtifacts,
        currentIndex: clampedIndex,
      };
    }

    // Default behavior: return latest artifact
    const status: ArtifactStatus = currentArtifact?.status || "idle";
    const isActive = status === "loading" || status === "streaming";

    return {
      data: currentArtifact?.payload || null,
      status,
      progress: currentArtifact?.progress,
      error: currentArtifact?.error,
      isActive,
      hasData: currentArtifact !== null,
      versions: emptyVersions,
    };
  }, [
    includeVersions,
    versionIndex,
    allArtifacts,
    currentArtifact,
    emptyVersions,
  ]);

  return [artifactData, actions] as [
    UseArtifactReturn<InferArtifactType<T>>,
    UseArtifactActions,
  ];
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

  // Store onData in ref to avoid dependency issues
  const onDataRef = useRef(onData);
  useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);

  return useMemo(() => {
    const allArtifacts = extractAllArtifactsFromMessages(messages);

    // Filter artifacts based on include/exclude options
    const filteredArtifacts = allArtifacts.filter((artifact) => {
      if (include && include.length > 0) return include.includes(artifact.type);
      if (exclude && exclude.length > 0)
        return !exclude.includes(artifact.type);
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
        (artifact.version === latest[artifact.type].version &&
          artifact.createdAt > latest[artifact.type].createdAt)
      ) {
        const prevLatest = latest[artifact.type];
        latest[artifact.type] = artifact;

        // Fire callback if this is a new or updated artifact
        const currentOnData = onDataRef.current;
        if (
          currentOnData &&
          (!prevLatest ||
            artifact.version > prevLatest.version ||
            (artifact.version === prevLatest.version &&
              artifact.createdAt > prevLatest.createdAt))
        ) {
          currentOnData(artifact.type, artifact);
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
  }, [messages, include, exclude]);
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
            if (
              !existing ||
              artifactPart.data.version > existing.version ||
              (artifactPart.data.version === existing.version &&
                artifactPart.data.createdAt > existing.createdAt)
            ) {
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
                  if (
                    !existing ||
                    nestedPart.data.version > existing.version ||
                    (nestedPart.data.version === existing.version &&
                      nestedPart.data.createdAt > existing.createdAt)
                  ) {
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
            if (
              !existing ||
              artifactPart.data.version > existing.version ||
              (artifactPart.data.version === existing.version &&
                artifactPart.data.createdAt > existing.createdAt)
            ) {
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
                  if (
                    !existing ||
                    nestedPart.data.version > existing.version ||
                    (nestedPart.data.version === existing.version &&
                      nestedPart.data.createdAt > existing.createdAt)
                  ) {
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
