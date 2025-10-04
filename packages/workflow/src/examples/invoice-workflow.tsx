// Example: Invoice creation and sending workflow
import { workflow, createTypedWorkflowContext } from "@ai-sdk-tools/workflow";
import { useWorkflow, useWorkflows } from "@ai-sdk-tools/workflow/client";
import { streamText, tool } from "ai";
import { z } from "zod";

// Backend setup
interface InvoiceContext extends BaseWorkflowContext {
  userId: string;
  userRole: "admin" | "accountant" | "user";
  companyId: string;
}

const { setContext, getContext } = createTypedWorkflowContext<InvoiceContext>();

// Define invoice workflows
const createInvoiceWorkflow = workflow({
  id: "create-invoice",
  inputSchema: z.object({
    customerEmail: z.string().email(),
    customerName: z.string(),
    items: z.array(z.object({
      description: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
    })),
    dueDate: z.string(),
    notes: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    invoiceId: z.string().optional(),
    invoiceNumber: z.string().optional(),
    totalAmount: z.number().optional(),
    error: z.string().optional(),
  }),
  priority: "medium",
  timeout: 120000, // 2 minutes for invoice review
  autoApprove: (data) => {
    const context = getContext();
    const totalAmount = data.items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    
    // Auto-approve small invoices for accountants
    return context.userRole === "accountant" && totalAmount < 500;
  },
});

const sendInvoiceWorkflow = workflow({
  id: "send-invoice",
  inputSchema: z.object({
    invoiceId: z.string(),
    customerEmail: z.string().email(),
    invoiceNumber: z.string(),
    totalAmount: z.number(),
    dueDate: z.string(),
    customMessage: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    sentAt: z.string().optional(),
    emailId: z.string().optional(),
    error: z.string().optional(),
  }),
  priority: "high",
  timeout: 60000, // 1 minute
  autoApprove: (data) => {
    // Auto-approve sending invoices under $100
    return data.totalAmount < 100;
  },
});

const deleteInvoiceWorkflow = workflow({
  id: "delete-invoice",
  inputSchema: z.object({
    invoiceId: z.string(),
    invoiceNumber: z.string(),
    customerName: z.string(),
    totalAmount: z.number(),
    status: z.enum(["draft", "sent", "paid", "overdue"]),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    deletedInvoiceId: z.string().optional(),
    error: z.string().optional(),
  }),
  priority: "critical",
  timeout: 45000,
  autoApprove: (data) => {
    const context = getContext();
    // Only auto-approve deleting draft invoices for admins
    return context.userRole === "admin" && data.status === "draft";
  },
});

// Backend route handler
export async function POST(req: Request) {
  const { messages, userId, userRole = "user" } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      setContext({
        writer,
        userId,
        userRole,
        companyId: "company-123",
      });

      const result = streamText({
        model: openai("gpt-4o"),
        system: `You are a helpful accounting assistant. You can help with:
- Creating invoices for customers
- Sending invoices via email
- Managing invoice lifecycle (delete drafts, etc.)

Always use the appropriate workflow for invoice operations to ensure proper approval.`,
        messages: convertToModelMessages(messages),
        tools: {
          createInvoice: tool({
            description: "Create a new invoice for a customer",
            inputSchema: createInvoiceWorkflow.inputSchema,
            outputSchema: createInvoiceWorkflow.outputSchema,
            execute: async (input) => {
              const workflowStream = createInvoiceWorkflow.stream(input);
              const response = await workflowStream.waitForResponse();
              
              if (response === "approved") {
                // Actually create the invoice
                const totalAmount = input.items.reduce((sum, item) => 
                  sum + (item.quantity * item.unitPrice), 0
                );
                
                const invoiceId = `inv_${Date.now()}`;
                const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
                
                return createInvoiceWorkflow.validateOutput({
                  success: true,
                  invoiceId,
                  invoiceNumber,
                  totalAmount,
                });
              } else if (response === "rejected") {
                return createInvoiceWorkflow.validateOutput({
                  success: false,
                  error: "Invoice creation was cancelled by user.",
                });
              } else {
                return createInvoiceWorkflow.validateOutput({
                  success: false,
                  error: "Invoice creation request timed out.",
                });
              }
            },
          }),

          sendInvoice: tool({
            description: "Send an invoice to a customer via email",
            inputSchema: sendInvoiceWorkflow.inputSchema,
            outputSchema: sendInvoiceWorkflow.outputSchema,
            execute: async (input) => {
              const workflowStream = sendInvoiceWorkflow.stream(input);
              const response = await workflowStream.waitForResponse();
              
              if (response === "approved") {
                // Actually send the invoice
                const emailId = `email_${Date.now()}`;
                const sentAt = new Date().toISOString();
                
                return sendInvoiceWorkflow.validateOutput({
                  success: true,
                  sentAt,
                  emailId,
                });
              } else {
                return sendInvoiceWorkflow.validateOutput({
                  success: false,
                  error: "Invoice sending was cancelled.",
                });
              }
            },
          }),

          deleteInvoice: tool({
            description: "Delete an invoice (only drafts can be deleted)",
            inputSchema: deleteInvoiceWorkflow.inputSchema,
            outputSchema: deleteInvoiceWorkflow.outputSchema,
            execute: async (input) => {
              const workflowStream = deleteInvoiceWorkflow.stream(input);
              const response = await workflowStream.waitForResponse();
              
              if (response === "approved") {
                return deleteInvoiceWorkflow.validateOutput({
                  success: true,
                  deletedInvoiceId: input.invoiceId,
                });
              } else {
                return deleteInvoiceWorkflow.validateOutput({
                  success: false,
                  error: "Invoice deletion was cancelled.",
                });
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
const INVOICE_WORKFLOW_UI = {
  "create-invoice": {
    title: "Create Invoice",
    getDescription: (data: any) => `Create invoice for ${data.customerName}?`,
    getDetails: (data: any) => {
      const total = data.items.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.unitPrice), 0
      );
      return [
        { label: "Customer", value: data.customerName },
        { label: "Email", value: data.customerEmail },
        { label: "Items", value: `${data.items.length} item(s)` },
        { label: "Total", value: `$${total.toFixed(2)}`, highlight: true },
        { label: "Due Date", value: data.dueDate },
        ...(data.notes ? [{ label: "Notes", value: data.notes }] : []),
      ];
    },
  },
  "send-invoice": {
    title: "Send Invoice",
    getDescription: (data: any) => `Send ${data.invoiceNumber} to ${data.customerEmail}?`,
    getDetails: (data: any) => [
      { label: "Invoice", value: data.invoiceNumber },
      { label: "Customer", value: data.customerEmail },
      { label: "Amount", value: `$${data.totalAmount.toFixed(2)}`, highlight: true },
      { label: "Due Date", value: data.dueDate },
      ...(data.customMessage ? [{ label: "Message", value: data.customMessage }] : []),
    ],
  },
  "delete-invoice": {
    title: "Delete Invoice",
    getDescription: (data: any) => `Permanently delete ${data.invoiceNumber}?`,
    getDetails: (data: any) => [
      { label: "Invoice", value: data.invoiceNumber },
      { label: "Customer", value: data.customerName },
      { label: "Amount", value: `$${data.totalAmount.toFixed(2)}` },
      { label: "Status", value: data.status, warning: data.status !== "draft" },
    ],
  },
};

function InvoiceWorkflowPanel() {
  const workflows = useWorkflows({
    include: ["create-invoice", "send-invoice", "delete-invoice"],
    onFlow: (type, workflow) => {
      console.log(`New ${type} workflow:`, workflow);
      
      // Show different notifications based on workflow type
      if (type === "delete-invoice") {
        showUrgentNotification("Invoice deletion requires approval");
      } else if (type === "send-invoice") {
        showNotification("Invoice ready to send");
      }
    },
  });

  if (!workflows.hasPending) return null;

  // Group by priority for better UX
  const criticalWorkflows = workflows.pending.filter(w => w.priority === "critical");
  const normalWorkflows = workflows.pending.filter(w => w.priority !== "critical");

  return (
    <div>
      {/* Critical workflows - full attention */}
      {criticalWorkflows.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              🚨 Critical Invoice Action Required
            </h2>
            {criticalWorkflows.map(workflow => (
              <InvoiceWorkflowCard key={workflow.id} workflowData={workflow} />
            ))}
          </div>
        </div>
      )}

      {/* Normal workflows - side panel */}
      {normalWorkflows.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-3 z-40">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {normalWorkflows.length} invoice action{normalWorkflows.length !== 1 ? 's' : ''} pending
          </div>
          
          {normalWorkflows.map(workflow => (
            <InvoiceWorkflowCard key={workflow.id} workflowData={workflow} />
          ))}
        </div>
      )}
    </div>
  );
}

function InvoiceWorkflowCard({ workflowData }: { workflowData: any }) {
  const createWorkflow = useWorkflow(createInvoiceWorkflow, {
    onApproved: (data) => {
      const total = data.items.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.unitPrice), 0
      );
      showToast(`Invoice for $${total.toFixed(2)} will be created`, 'success');
    },
    onRejected: (data, reason) => {
      showToast('Invoice creation cancelled', 'info');
    },
  });

  const sendWorkflow = useWorkflow(sendInvoiceWorkflow, {
    onApproved: (data) => {
      showToast(`Invoice ${data.invoiceNumber} will be sent to ${data.customerEmail}`, 'success');
    },
    onRejected: () => {
      showToast('Invoice sending cancelled', 'info');
    },
  });

  const deleteWorkflow = useWorkflow(deleteInvoiceWorkflow, {
    onApproved: (data) => {
      showToast(`Invoice ${data.invoiceNumber} will be deleted`, 'warning');
    },
    onRejected: () => {
      showToast('Invoice deletion cancelled', 'info');
    },
  });

  // Determine active workflow
  const activeWorkflow = createWorkflow.isPending ? createWorkflow :
                        sendWorkflow.isPending ? sendWorkflow :
                        deleteWorkflow.isPending ? deleteWorkflow : null;

  if (!activeWorkflow?.isPending) return null;

  const uiConfig = INVOICE_WORKFLOW_UI[activeWorkflow.type as keyof typeof INVOICE_WORKFLOW_UI];
  if (!uiConfig) return null;

  const priorityStyles = {
    low: "border-gray-300 bg-gray-50",
    medium: "border-blue-400 bg-blue-50",
    high: "border-orange-400 bg-orange-50",
    critical: "border-red-500 bg-red-50 animate-pulse",
  };

  return (
    <div className={`
      p-4 border-2 rounded-lg shadow-lg max-w-md
      ${priorityStyles[activeWorkflow.priority || 'medium']}
    `}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{uiConfig.title}</h3>
        {activeWorkflow.timeRemaining && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>⏱️</span>
            <span>{Math.ceil(activeWorkflow.timeRemaining / 1000)}s</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-700 mb-3">
        {uiConfig.getDescription(activeWorkflow.data)}
      </p>
      
      {/* Invoice details */}
      {activeWorkflow.data && (
        <div className="bg-white border rounded p-3 mb-4 space-y-2">
          {uiConfig.getDetails(activeWorkflow.data).map((detail, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{detail.label}:</span>
              <span className={`
                ${detail.highlight ? 'font-bold text-green-600' : ''}
                ${detail.warning ? 'font-bold text-red-600' : ''}
              `}>
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Special handling for create invoice - show line items */}
      {activeWorkflow === createWorkflow && activeWorkflow.data && (
        <div className="bg-gray-50 border rounded p-3 mb-4">
          <h4 className="font-medium text-sm mb-2">Invoice Items:</h4>
          {activeWorkflow.data.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-xs py-1">
              <span>{item.description}</span>
              <span>{item.quantity} × ${item.unitPrice} = ${(item.quantity * item.unitPrice).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => activeWorkflow.approve("Approved by user")}
          disabled={!activeWorkflow.canApprove}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          ✓ Approve
        </button>
        <button
          onClick={() => activeWorkflow.reject("Rejected by user")}
          disabled={!activeWorkflow.canReject}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          ✗ Reject
        </button>
        {activeWorkflow.canCancel && (
          <button
            onClick={() => activeWorkflow.cancel()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-medium"
          >
            Cancel
          </button>
        )}
      </div>
      
      {/* Retry button for failed workflows */}
      {activeWorkflow.canRetry && (
        <button
          onClick={() => activeWorkflow.retry()}
          className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          🔄 Retry
        </button>
      )}
    </div>
  );
}

// Invoice dashboard showing all pending workflows
function InvoiceDashboard() {
  const workflows = useWorkflows({
    include: ["create-invoice", "send-invoice", "delete-invoice"],
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        
        {workflows.hasPending && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {workflows.pendingCount} pending approval{workflows.pendingCount !== 1 ? 's' : ''}
            </span>
            
            <div className="flex gap-2">
              <button 
                onClick={() => workflows.approveAll("Bulk approval")}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Approve All
              </button>
              <button 
                onClick={() => workflows.rejectAll("Bulk rejection")}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Reject All
              </button>
            </div>
          </div>
        )}
      </div>
      
      {workflows.hasPending ? (
        <div className="grid gap-4">
          {workflows.pending.map(workflow => (
            <div key={workflow.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{workflow.action}</h3>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                </div>
                <div className="text-right">
                  <span className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${workflow.priority === "critical" ? "bg-red-100 text-red-800" :
                      workflow.priority === "high" ? "bg-orange-100 text-orange-800" :
                      "bg-blue-100 text-blue-800"}
                  `}>
                    {workflow.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No pending invoice workflows</p>
          <p className="text-sm">All invoice operations are up to date!</p>
        </div>
      )}
    </div>
  );
}

// Example chat interaction
function InvoiceChat() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/invoice-chat",
    }),
  });

  const [input, setInput] = useState("");

  return (
    <div className="flex h-screen">
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(message => (
            <div key={message.id} className="mb-4">
              <div className={`
                max-w-[80%] p-3 rounded-lg
                ${message.role === "user" 
                  ? "ml-auto bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-900"}
              `}>
                {message.parts?.map((part, i) => {
                  if (part.type === "text") {
                    return <div key={i}>{part.text}</div>;
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput("");
            }
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to create, send, or manage invoices..."
              className="w-full p-3 border rounded-lg"
            />
          </form>
        </div>
      </div>
      
      {/* Workflow panel overlay */}
      <InvoiceWorkflowPanel />
    </div>
  );
}

// Utility functions
function showNotification(message: string) {
  console.log("NOTIFICATION:", message);
}

function showUrgentNotification(message: string) {
  console.log("URGENT:", message);
}

function showToast(message: string, type: 'success' | 'info' | 'warning' | 'error') {
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// Example usage scenarios:
// 1. "Create an invoice for Acme Corp for $2,500 for web development services"
// 2. "Send invoice INV-2024-123456 to customer@acme.com"  
// 3. "Delete the draft invoice INV-2024-789012"

