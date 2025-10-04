// Example usage of the flow package
import { flow, createTypedFlowContext } from "@ai-sdk-tools/flow";
import { useFlow, useFlows } from "@ai-sdk-tools/flow/client";
import { streamText, tool } from "ai";
import { z } from "zod";

// Backend setup
interface ChatContext extends BaseFlowContext {
  userId: string;
  userRole: "admin" | "user";
}

const { setContext } = createTypedFlowContext<ChatContext>();

// Define flows - AI SDK style configuration
const deleteFileFlow = flow({
  id: "delete-file",
  inputSchema: z.object({
    fileName: z.string(),
    path: z.string(),
    size: z.number(),
    isSystemFile: z.boolean().default(false),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    deletedFile: z.string().optional(),
  }),
  priority: "high",
  timeout: 30000,
  autoApprove: (data) => data.size < 1024 && !data.isSystemFile,
});

const sendEmailFlow = flow({
  id: "send-email",
  inputSchema: z.object({
    to: z.array(z.string().email()),
    subject: z.string(),
    body: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    messageId: z.string().optional(),
    recipients: z.array(z.string()),
  }),
  priority: "medium",
  timeout: 60000,
});

// Backend route handler example
export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      setContext({
        writer,
        userId: "user-123",
        userRole: "admin",
      });

      const result = streamText({
        model: openai("gpt-4o"),
        messages: convertToModelMessages(messages),
        tools: {
          deleteFile: tool({
            description: "Delete a file from the filesystem",
            inputSchema: deleteFileFlow.inputSchema,
            outputSchema: deleteFileFlow.outputSchema,
            execute: async (input) => {
              const flowStream = deleteFileFlow.stream(input);
              const response = await flowStream.waitForResponse();
              
              switch (response) {
                case "approved":
                  // Actually delete the file
                  const result = {
                    success: true,
                    message: `File "${input.fileName}" deleted successfully.`,
                    deletedFile: input.fileName,
                  };
                  // Validate output against schema
                  return deleteFileFlow.validateOutput(result);
                case "rejected":
                  return deleteFileFlow.validateOutput({
                    success: false,
                    message: "File deletion cancelled by user.",
                  });
                case "timeout":
                  return deleteFileFlow.validateOutput({
                    success: false,
                    message: "File deletion timed out.",
                  });
                default:
                  return deleteFileFlow.validateOutput({
                    success: false,
                    message: `Unknown response: ${response}`,
                  });
              }
            },
          }),

          sendEmail: tool({
            description: "Send an email",
            inputSchema: sendEmailFlow.inputSchema,
            outputSchema: sendEmailFlow.outputSchema,
            execute: async (input) => {
              const flowStream = sendEmailFlow.stream(input);
              const response = await flowStream.waitForResponse();
              
              if (response === "approved") {
                // Actually send email
                return `📧 Email sent to ${input.to.join(", ")}`;
              } else {
                return `📧 Email sending cancelled.`;
              }
            },
          }),
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}

// Frontend components
function FlowPanel() {
  const flows = useFlows({
    onFlow: (type, flow) => {
      console.log(`New ${type} flow:`, flow);
      if (flow.priority === "critical") {
        // Show urgent notification
        showNotification(`Critical action required: ${flow.action}`);
      }
    },
  });

  if (!flows.hasPending) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
        {flows.pendingCount} flow{flows.pendingCount !== 1 ? 's' : ''} pending
      </div>
      
      {flows.hasPending && (
        <div className="flex gap-2 mb-2">
          <button 
            onClick={() => flows.approveAll("Bulk approval")}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Approve All
          </button>
          <button 
            onClick={() => flows.rejectAll("Bulk rejection")}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Reject All
          </button>
        </div>
      )}
      
      {flows.pending.map((flow) => (
        <FlowCard key={flow.id} flowData={flow} />
      ))}
    </div>
  );
}

function FlowCard({ flowData }: { flowData: any }) {
  const deleteFlow = useFlow(deleteFileFlow, {
    onApproved: (data) => {
      console.log('File deletion approved:', data.fileName);
      showToast(`File ${data.fileName} will be deleted`, 'success');
    },
    onRejected: (data, reason) => {
      console.log('File deletion rejected:', reason);
      showToast('File deletion cancelled', 'info');
    },
    onTimeout: (data) => {
      console.log('File deletion timed out:', data.fileName);
      showToast('File deletion request timed out', 'warning');
    },
  });

  const emailFlow = useFlow(sendEmailFlow, {
    onApproved: (data) => {
      showToast(`Email will be sent to ${data.to.join(', ')}`, 'success');
    },
    onRejected: () => {
      showToast('Email sending cancelled', 'info');
    },
  });

  // Determine which flow is active
  const activeFlow = deleteFlow.isPending ? deleteFlow : 
                    emailFlow.isPending ? emailFlow : null;

  if (!activeFlow?.isPending) return null;

  const priorityColors = {
    low: "border-gray-300",
    medium: "border-blue-500",
    high: "border-orange-500",
    critical: "border-red-500 animate-pulse",
  };

  return (
    <div className={`
      p-4 bg-white border-2 rounded-lg shadow-lg max-w-sm
      ${priorityColors[activeFlow.priority || 'medium']}
    `}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{activeFlow.action}</h3>
        {activeFlow.timeRemaining && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>⏱️</span>
            <span>{Math.ceil(activeFlow.timeRemaining / 1000)}s</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{activeFlow.description}</p>
      
      {/* Dynamic data display based on UI config */}
      {activeFlow.data && (
        <div className="text-xs bg-gray-100 p-2 rounded mb-3">
          {uiConfig.getDetails(activeFlow.data).map((detail, index) => (
            <p key={index} className={detail.warning ? "text-red-600 font-semibold" : ""}>
              <strong>{detail.label}:</strong> {detail.value}
            </p>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => activeFlow.approve("User confirmed")}
          disabled={!activeFlow.canApprove}
          className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Approve
        </button>
        <button
          onClick={() => activeFlow.reject("User declined")}
          disabled={!activeFlow.canReject}
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✗ Reject
        </button>
        {activeFlow.canCancel && (
          <button
            onClick={() => activeFlow.cancel()}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
      
      {activeFlow.canRetry && (
        <button
          onClick={() => activeFlow.retry()}
          className="w-full mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          🔄 Retry
        </button>
      )}
    </div>
  );
}

// Utility functions (you'd implement these)
function showNotification(message: string) {
  // Implementation for urgent notifications
  console.log('URGENT:', message);
}

function showToast(message: string, type: 'success' | 'info' | 'warning' | 'error') {
  // Implementation for toast notifications
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// Advanced usage: Multiple flows with different configurations
function AdvancedFlowExample() {
  const criticalFlows = useFlows({
    priorityFilter: ["critical"],
    onFlow: (type, flow) => {
      // Immediately show modal for critical flows
      showCriticalFlowModal(flow);
    },
  });

  const backgroundFlows = useFlows({
    priorityFilter: ["low", "medium"],
    statusFilter: ["pending"],
  });

  return (
    <div>
      {/* Critical flows get immediate attention */}
      {criticalFlows.hasPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              🚨 Critical Action Required
            </h2>
            {criticalFlows.pending.map(flow => (
              <FlowCard key={flow.id} flowData={flow} />
            ))}
          </div>
        </div>
      )}
      
      {/* Background flows in sidebar */}
      {backgroundFlows.hasPending && (
        <div className="fixed right-4 top-4 w-80">
          <div className="bg-white border rounded-lg shadow-lg p-4">
            <h3 className="font-semibold mb-3">
              Pending Actions ({backgroundFlows.pendingCount})
            </h3>
            {backgroundFlows.pending.slice(0, 3).map(flow => (
              <div key={flow.id} className="mb-2 p-2 border rounded text-sm">
                <p className="font-medium">{flow.action}</p>
                <p className="text-gray-600">{flow.description}</p>
              </div>
            ))}
            {backgroundFlows.pendingCount > 3 && (
              <p className="text-sm text-gray-500">
                +{backgroundFlows.pendingCount - 3} more...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function showCriticalFlowModal(flow: any) {
  // Implementation for critical flow modal
  console.log('CRITICAL FLOW:', flow);
}
