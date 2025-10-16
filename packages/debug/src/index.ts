const isDebugEnabled = process.env.DEBUG_AGENTS === 'true';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
};

// Format timestamp
const timestamp = () => new Date().toISOString().slice(11, 23);

// Create category-scoped logger with clean API
export function createLogger(category: string) {
  if (!isDebugEnabled) {
    // Return no-op functions when debug is disabled
    return {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };
  }

  return {
    debug: (message: string, data?: any) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.blue}DEBUG${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : '';
      console.log(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    info: (message: string, data?: any) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.green}INFO${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : '';
      console.log(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    warn: (message: string, data?: any) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.yellow}WARN${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : '';
      console.warn(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
    error: (message: string, data?: any) => {
      const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
      const level = `${colors.red}ERROR${colors.reset}`;
      const cat = `${colors.cyan}[${category}]${colors.reset}`;
      const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : '';
      console.error(`${ts} ${level} ${cat} ${message}${dataStr}`);
    },
  };
}

// Export a base logger for backward compatibility
export const logger = {
  debug: (message: string, data?: any) => {
    if (!isDebugEnabled) return;
    const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
    const level = `${colors.blue}DEBUG${colors.reset}`;
    const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : '';
    console.log(`${ts} ${level} ${message}${dataStr}`);
  },
  info: (message: string, data?: any) => {
    if (!isDebugEnabled) return;
    const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
    const level = `${colors.green}INFO${colors.reset}`;
    const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : '';
    console.log(`${ts} ${level} ${message}${dataStr}`);
  },
  warn: (message: string, data?: any) => {
    if (!isDebugEnabled) return;
    const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
    const level = `${colors.yellow}WARN${colors.reset}`;
    const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : '';
    console.warn(`${ts} ${level} ${message}${dataStr}`);
  },
  error: (message: string, data?: any) => {
    if (!isDebugEnabled) return;
    const ts = `${colors.gray}[${timestamp()}]${colors.reset}`;
    const level = `${colors.red}ERROR${colors.reset}`;
    const dataStr = data ? ` ${colors.gray}${JSON.stringify(data)}${colors.reset}` : '';
    console.error(`${ts} ${level} ${message}${dataStr}`);
  },
};

