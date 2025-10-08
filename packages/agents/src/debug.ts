/**
 * Debug utility for AI SDK Agents
 * Set DEBUG_AGENTS=true in environment to enable debugging
 */

const isDebugEnabled = process.env.DEBUG_AGENTS === "true";

/**
 * Simple debug logger with clean prefixes
 * Usage: debug("ORCHESTRATION", "Starting orchestration", { agent: "Math Expert" })
 */
export const debug = (category: string, message: string, data?: any) => {
  if (!isDebugEnabled) return;

  const timestamp = new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
  const prefix = `[${category}] [${timestamp}]`;

  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};
