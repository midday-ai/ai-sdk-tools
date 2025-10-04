// Examples of conditional flows and optional HITL
import { 
  flow, 
  conditionalFlow, 
  withConditionalFlow, 
  createTypedFlowContext 
} from "@ai-sdk-tools/flow";
import { streamText, tool } from "ai";
import { z } from "zod";

// Extended context with user info
interface ChatContext extends BaseFlowContext {
  userId: string;
  userRole: "admin" | "user" | "guest";
  environment: "development" | "staging" | "production";
  permissions: string[];
}

const { setContext, getContext } = createTypedFlowContext<ChatContext>();

// ============================================================================
// APPROACH 1: Auto-Approval Conditions (Built-in)
// ============================================================================

const deleteFileFlow = flow(
  "delete-file",
  z.object({
    fileName: z.string(),
    path: z.string(),
    size: z.number(),
    isSystemFile: z.boolean().default(false),
    owner: z.string().optional(),
  }),
  "Delete File",
  "This will permanently delete the file.",
  {
    priority: "high",
    timeout: 30000,
    autoApprove: (data) => {
      const context = getContext();
      
      // Auto-approve conditions:
      // 1. Small files (< 1KB) that aren't system files
      // 2. Admin users deleting their own files
      // 3. Development environment for non-system files
      
      const isSmallFile = data.size < 1024 && !data.isSystemFile;
      const isOwnFile = data.owner === context.userId && context.userRole === "admin";
      const isDevNonSystem = context.environment === "development" && !data.isSystemFile;
      
      return isSmallFile || isOwnFile || isDevNonSystem;
    },
  }
);

// ============================================================================
// APPROACH 2: Conditional Flow Helper
// ============================================================================

const sendEmailFlow = conditionalFlow(
  "send-email",
  z.object({
    to: z.array(z.string().email()),
    subject: z.string(),
    body: z.string(),
    isMarketing: z.boolean().default(false),
    isBulk: z.boolean().default(false),
  }),
  "Send Email",
  "Send this email to recipients?",
  {
    priority: "medium",
    timeout: 60000,
    
    // Only require confirmation when:
    when: (data) => {
      const context = getContext();
      
      // Always confirm marketing emails
      if (data.isMarketing) return true;
      
      // Always confirm bulk emails (>5 recipients)
      if (data.isBulk || data.to.length > 5) return true;
      
      // Guests always need confirmation
      if (context.userRole === "guest") return true;
      
      // Otherwise, no confirmation needed
      return false;
    },
    
    // Auto-approve internal emails for admins
    autoApprove: (data) => {
      const context = getContext();
      const isInternal = data.to.every(email => email.endsWith("@company.com"));
      return context.userRole === "admin" && isInternal && !data.isMarketing;
    },
  }
);

// ============================================================================
// APPROACH 3: withConditionalFlow Helper
// ============================================================================

const executeCommandFlow = flow(
  "execute-command",
  z.object({
    command: z.string(),
    workingDir: z.string().default("/"),
    sudo: z.boolean().default(false),
    args: z.array(z.string()).default([]),
  }),
  "Execute Command",
  "Execute this system command?",
  { priority: "critical", timeout: 45000 }
);

// ============================================================================
// BACKEND TOOLS WITH DIFFERENT CONFIRMATION STRATEGIES
// ============================================================================

export const tools = {
  // Tool 1: Always requires confirmation (traditional approach)
  deleteFile: tool({
    description: "Delete a file from the filesystem",
    inputSchema: deleteFileFlow.schema,
    execute: async (input) => {
      const flowStream = deleteFileFlow.stream(input);
      const response = await flowStream.waitForResponse();
      
      if (response === "approved") {
        return `✅ File "${input.fileName}" deleted successfully.`;
      } else {
        return `❌ File deletion cancelled.`;
      }
    },
  }),

  // Tool 2: Conditional confirmation using conditionalFlow
  sendEmail: tool({
    description: "Send an email to recipients",
    inputSchema: sendEmailFlow.schema,
    execute: async (input) => {
      // Check if flow should be shown
      if (!sendEmailFlow.shouldShow(input)) {
        // Skip confirmation - execute directly
        return `📧 Email sent to ${input.to.join(", ")} (auto-approved)`;
      }
      
      const flowStream = sendEmailFlow.stream(input);
      const response = await flowStream.waitForResponse();
      
      if (response === "approved") {
        return `📧 Email sent to ${input.to.join(", ")}`;
      } else {
        return `📧 Email sending cancelled.`;
      }
    },
  }),

  // Tool 3: Using withConditionalFlow helper
  executeCommand: tool({
    description: "Execute a system command",
    inputSchema: executeCommandFlow.schema,
    execute: async (input) => {
      return withConditionalFlow(
        executeCommandFlow,
        input,
        async (data) => {
          // Actual command execution
          return `💻 Command executed: ${data.command}`;
        },
        {
          requiresConfirmation: (data) => {
            // Require confirmation for dangerous commands
            const dangerousCommands = ["rm", "delete", "format", "dd", "sudo"];
            const isDangerous = dangerousCommands.some(cmd => 
              data.command.toLowerCase().includes(cmd)
            );
            
            // Always confirm sudo commands
            if (data.sudo) return true;
            
            // Always confirm dangerous commands
            if (isDangerous) return true;
            
            // Confirm commands outside safe directories
            const safeDirs = ["/tmp", "/home/user", "/workspace"];
            const isSafeDir = safeDirs.some(dir => data.workingDir.startsWith(dir));
            if (!isSafeDir) return true;
            
            return false; // Safe command, no confirmation needed
          },
          
          skipForRoles: ["admin"], // Admins can skip confirmation
          bypassInDevelopment: true, // Skip in development
          
          autoApproveCondition: (data) => {
            // Auto-approve safe read-only commands
            const safeCommands = ["ls", "pwd", "whoami", "date", "cat"];
            const commandName = data.command.split(" ")[0];
            return safeCommands.includes(commandName) && !data.sudo;
          },
        }
      );
    },
  }),

  // Tool 4: Never requires confirmation
  getCurrentTime: tool({
    description: "Get the current time",
    inputSchema: z.object({}),
    execute: async () => {
      return `🕒 Current time: ${new Date().toISOString()}`;
    },
  }),

  // Tool 5: Role-based confirmation
  viewSensitiveData: tool({
    description: "View sensitive user data",
    inputSchema: z.object({
      userId: z.string(),
      dataType: z.enum(["profile", "financial", "medical"]),
    }),
    execute: async (input) => {
      const context = getContext();
      
      // Different confirmation requirements based on data sensitivity
      const requiresConfirmation = (() => {
        switch (input.dataType) {
          case "profile":
            return context.userRole === "guest"; // Only guests need confirmation
          case "financial":
            return context.userRole !== "admin"; // Everyone except admin
          case "medical":
            return true; // Always require confirmation
          default:
            return true;
        }
      })();
      
      if (!requiresConfirmation) {
        return `📊 ${input.dataType} data for user ${input.userId}`;
      }
      
      // Create dynamic flow based on data type
      const viewDataFlow = flow(
        `view-${input.dataType}-data`,
        z.object({ userId: z.string(), dataType: z.string() }),
        `View ${input.dataType} Data`,
        `Access ${input.dataType} data for user ${input.userId}?`,
        {
          priority: input.dataType === "medical" ? "critical" : "high",
          timeout: 30000,
        }
      );
      
      const flowStream = viewDataFlow.stream(input);
      const response = await flowStream.waitForResponse();
      
      if (response === "approved") {
        return `📊 ${input.dataType} data for user ${input.userId}`;
      } else {
        return `🚫 Access to ${input.dataType} data denied.`;
      }
    },
  }),
};

// ============================================================================
// ROUTE HANDLER WITH DIFFERENT CONFIRMATION MODES
// ============================================================================

export async function POST(req: Request) {
  const { messages, confirmationMode = "smart" } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // Set context with confirmation preferences
      setContext({
        writer,
        userId: "user-123", // From auth
        userRole: "user",    // From auth
        environment: process.env.NODE_ENV as any || "production",
        permissions: ["read", "write"], // From auth
      });

      const result = streamText({
        model: openai("gpt-4o"),
        system: `You are a helpful assistant with access to various system tools.

Confirmation Mode: ${confirmationMode}
- "strict": Always ask for confirmation
- "smart": Ask only when necessary based on risk
- "minimal": Only ask for critical operations
- "disabled": Never ask for confirmation (dangerous!)

Use tools appropriately based on user requests.`,
        messages: convertToModelMessages(messages),
        tools,
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}

// ============================================================================
// FRONTEND: CONDITIONAL FLOW DISPLAY
// ============================================================================

import { useFlows } from "@ai-sdk-tools/flow/client";

function ConditionalFlowPanel() {
  const flows = useFlows({
    // Only show flows that actually need user interaction
    statusFilter: ["pending"],
    onFlow: (type, flow) => {
      console.log(`New ${type} flow:`, flow);
      
      // Different handling based on priority
      switch (flow.priority) {
        case "critical":
          showModal(flow); // Immediate modal
          break;
        case "high":
          showNotification(flow); // Push notification
          break;
        default:
          // Just show in panel
          break;
      }
    },
  });

  // Group flows by priority for better UX
  const criticalFlows = flows.pending.filter(f => f.priority === "critical");
  const highFlows = flows.pending.filter(f => f.priority === "high");
  const normalFlows = flows.pending.filter(f => ["medium", "low"].includes(f.priority));

  return (
    <div>
      {/* Critical flows - full screen modal */}
      {criticalFlows.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              🚨 Critical Action Required
            </h2>
            {criticalFlows.map(flow => (
              <FlowCard key={flow.id} flow={flow} />
            ))}
          </div>
        </div>
      )}

      {/* High priority flows - prominent panel */}
      {highFlows.length > 0 && (
        <div className="fixed top-4 right-4 bg-orange-50 border-l-4 border-orange-500 p-4 rounded shadow-lg max-w-sm">
          <h3 className="font-semibold text-orange-800 mb-2">
            ⚠️ High Priority Actions ({highFlows.length})
          </h3>
          {highFlows.map(flow => (
            <FlowCard key={flow.id} flow={flow} compact />
          ))}
        </div>
      )}

      {/* Normal flows - bottom right panel */}
      {normalFlows.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-semibold mb-2">
            Pending Actions ({normalFlows.length})
          </h3>
          {normalFlows.slice(0, 3).map(flow => (
            <FlowCard key={flow.id} flow={flow} compact />
          ))}
          {normalFlows.length > 3 && (
            <p className="text-sm text-gray-500 mt-2">
              +{normalFlows.length - 3} more...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Utility components
function FlowCard({ flow, compact = false }: { flow: any; compact?: boolean }) {
  // Implementation would use appropriate useFlow hook
  return (
    <div className={`border rounded p-2 mb-2 ${compact ? 'text-sm' : ''}`}>
      <div className="font-medium">{flow.action}</div>
      <div className="text-gray-600">{flow.description}</div>
      <div className="flex gap-2 mt-2">
        <button className="px-2 py-1 bg-green-500 text-white rounded text-xs">
          Approve
        </button>
        <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">
          Reject
        </button>
      </div>
    </div>
  );
}

function showModal(flow: any) {
  console.log("CRITICAL MODAL:", flow);
}

function showNotification(flow: any) {
  console.log("NOTIFICATION:", flow);
}
