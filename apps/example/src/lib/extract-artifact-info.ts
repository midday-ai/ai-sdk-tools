import type { UIMessage } from "ai";

/**
 * Extract artifact type from a message
 * Returns the artifact type if found, null otherwise
 */
export function extractArtifactTypeFromMessage(
  message: UIMessage,
): string | null {
  if (!message.parts || !Array.isArray(message.parts)) {
    return null;
  }

  for (const part of message.parts) {
    // Check if this part is an artifact part
    if (part.type.startsWith("data-artifact-") && "data" in part) {
      const artifactPart = part as { type: string; data?: { type?: string } };
      if (artifactPart.data?.type) {
        return artifactPart.data.type;
      }
      // Fallback: extract type from part type
      const match = part.type.match(/^data-artifact-(.+)$/);
      if (match) {
        return match[1];
      }
    }

    // Check tool call results that might contain artifacts
    if (part.type.startsWith("tool-") && "result" in part && part.result) {
      const result = part.result;
      if (typeof result === "object" && result && "parts" in result) {
        const parts = (result as { parts?: unknown[] }).parts;
        if (Array.isArray(parts)) {
          for (const nestedPart of parts) {
            const part = nestedPart as {
              type?: string;
              data?: { type?: string };
            };
            if (part.type?.startsWith("data-artifact-")) {
              if (part.data?.type) {
                return part.data.type;
              }
              const match = part.type.match(/^data-artifact-(.+)$/);
              if (match) {
                return match[1];
              }
            }
          }
        }
      }
    }
  }

  return null;
}

/**
 * Extract artifact ID from a message
 * Returns the artifact ID if found, null otherwise
 */
export function extractArtifactIdFromMessage(
  message: UIMessage,
): string | null {
  if (!message.parts || !Array.isArray(message.parts)) {
    return null;
  }

  for (const part of message.parts) {
    // Check if this part is an artifact part
    if (part.type.startsWith("data-artifact-") && "data" in part) {
      const artifactPart = part as { type: string; data?: { id?: string } };
      if (artifactPart.data?.id) {
        return artifactPart.data.id;
      }
    }

    // Check tool call results that might contain artifacts
    if (part.type.startsWith("tool-") && "result" in part && part.result) {
      const result = part.result;
      if (typeof result === "object" && result && "parts" in result) {
        const parts = (result as { parts?: unknown[] }).parts;
        if (Array.isArray(parts)) {
          for (const nestedPart of parts) {
            const part = nestedPart as {
              type?: string;
              data?: { id?: string };
            };
            if (part.type?.startsWith("data-artifact-") && part.data?.id) {
              return part.data.id;
            }
          }
        }
      }
    }
  }

  return null;
}
