type LogLevel = "log" | "warn" | "error";

interface DebugOptions {
  enabled?: boolean;
  prefix?: string;
  level?: LogLevel;
}

class DebugLogger {
  private enabled: boolean;
  private prefix: string;
  private level: LogLevel;

  constructor(options: DebugOptions = {}) {
    this.enabled = options.enabled ?? process.env.DEBUG === "true";
    this.prefix = options.prefix ?? "[Store]";
    this.level = options.level ?? "warn";
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;

    const levels = ["log", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  log(...args: any[]): void {
    if (this.shouldLog("log")) {
      console.log(this.prefix, ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.prefix, ...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog("error")) {
      console.error(this.prefix, ...args);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

// Create default logger instance
export const debug = new DebugLogger();

// Export for external configuration
export function configureDebug(options: DebugOptions): void {
  if (options.enabled !== undefined) {
    debug.setEnabled(options.enabled);
  }
  if (options.level !== undefined) {
    debug.setLevel(options.level);
  }
}

// Export the class for custom loggers
export { DebugLogger };
