/**
 * Debug utility for AI SDK Agents
 * Set DEBUG_AGENTS=true in environment to enable debugging
 */

const isDebugEnabled = process.env.DEBUG_AGENTS === "true";

/**
 * Simple debug logger with clean prefixes
 * Usage: debug("ORCHESTRATION", "Starting orchestration", { agent: "Math Expert" })
 */
export const debug = (category: string, message: string, ...args: any[]) => {
  if (!isDebugEnabled) return;

  const timestamp = new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
  const prefix = `[${category}] [${timestamp}]`;

  if (args.length > 0) {
    console.log(`${prefix} ${message}`, ...args);
  } else {
    console.log(`${prefix} ${message}`);
  }
};
