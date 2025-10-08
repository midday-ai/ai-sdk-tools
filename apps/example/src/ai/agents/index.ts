/**
 * Financial Agents - Main Entry Point
 *
 * Modular agent system for comprehensive financial operations
 */

// Individual specialist agents (for advanced usage)
export {
  invoicesAgent,
  reportsAgent,
  transactionsAgent,
} from "./agents";
// Main orchestrator (primary export)
export { orchestratorAgent } from "./orchestrator";

// Re-export types and utilities for external use
export type * from "./types/filters";
