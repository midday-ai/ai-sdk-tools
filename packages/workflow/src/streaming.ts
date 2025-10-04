import type { FlowConfig, FlowData } from "./types";
import { workflows } from "./context";

export class StreamingWorkflow<T> {
  constructor(
    private config: FlowConfig<T>,
    private instance: FlowData<T>,
  ) {}

  async waitForResponse(timeoutMs?: number): Promise<"approved" | "rejected" | "timeout" | "cancelled"> {
    const writer = workflows.getWriter();
    
    // Send flow request to client
    writer.write({
      type: `data-flow-${this.config.id}`,
      id: this.instance.id,
      data: this.instance,
    });

    // Check for auto-approval
    if (this.config.autoApprove?.(this.instance.payload)) {
      this.instance.status = "approved";
      this.instance.approvedAt = Date.now();
      this.instance.updatedAt = Date.now();
      
      writer.write({
        type: `data-flow-${this.config.id}`,
        id: this.instance.id,
        data: this.instance,
      });
      
      return "approved";
    }

    const timeout = timeoutMs || this.config.timeout || 60000; // 1 minute default
    
    return new Promise((resolve) => {
      let resolved = false;
      
      const resolveOnce = (result: "approved" | "rejected" | "timeout" | "cancelled") => {
        if (resolved) return;
        resolved = true;
        resolve(result);
      };

      // Set up timeout
      setTimeout(() => {
        this.instance.status = "timeout";
        this.instance.updatedAt = Date.now();
        
        writer.write({
          type: `data-flow-${this.config.id}`,
          id: this.instance.id,
          data: this.instance,
        });
        
        resolveOnce("timeout");
      }, timeout);

      // In a real implementation, this would listen to the message stream
      // for user responses. For now, this is a placeholder that demonstrates
      // the interface. The actual implementation would integrate with the
      // AI SDK's message streaming system to detect user tool calls.
      
      // This would be replaced with actual message stream listening:
      // const unsubscribe = listenToMessageStream((message) => {
      //   if (message.toolCallId === this.instance.id) {
      //     clearTimeout(timeoutId);
      //     const action = message.output?.action;
      //     if (action === "approve") {
      //       this.approve(message.output?.reason);
      //       resolveOnce("approved");
      //     } else if (action === "reject") {
      //       this.reject(message.output?.reason);
      //       resolveOnce("rejected");
      //     } else if (action === "cancel") {
      //       this.cancel();
      //       resolveOnce("cancelled");
      //     }
      //   }
      // });

      // Cleanup function would be: () => { clearTimeout(timeoutId); unsubscribe(); }
    });
  }

  approve(reason?: string): void {
    this.instance.status = "approved";
    this.instance.approvedAt = Date.now();
    this.instance.updatedAt = Date.now();
    if (reason) {
      this.instance.metadata = { ...this.instance.metadata, approvalReason: reason };
    }

    const writer = workflows.getWriter();
    writer.write({
      type: `data-flow-${this.config.id}`,
      id: this.instance.id,
      data: this.instance,
    });
  }

  reject(reason?: string): void {
    this.instance.status = "rejected";
    this.instance.rejectedAt = Date.now();
    this.instance.updatedAt = Date.now();
    if (reason) {
      this.instance.metadata = { ...this.instance.metadata, rejectionReason: reason };
    }

    const writer = workflows.getWriter();
    writer.write({
      type: `data-flow-${this.config.id}`,
      id: this.instance.id,
      data: this.instance,
    });
  }

  cancel(): void {
    this.instance.status = "cancelled";
    this.instance.updatedAt = Date.now();

    const writer = workflows.getWriter();
    writer.write({
      type: `data-flow-${this.config.id}`,
      id: this.instance.id,
      data: this.instance,
    });
  }

  retry(): void {
    this.instance.status = "pending";
    this.instance.updatedAt = Date.now();
    // Clear previous timestamps
    delete this.instance.approvedAt;
    delete this.instance.rejectedAt;

    const writer = workflows.getWriter();
    writer.write({
      type: `data-flow-${this.config.id}`,
      id: this.instance.id,
      data: this.instance,
    });
  }

  getData(): FlowData<T> {
    return this.instance;
  }

  updateData(updates: Partial<FlowData<T>>): void {
    Object.assign(this.instance, updates, { updatedAt: Date.now() });
    
    const writer = workflows.getWriter();
    writer.write({
      type: `data-flow-${this.config.id}`,
      id: this.instance.id,
      data: this.instance,
    });
  }
}
