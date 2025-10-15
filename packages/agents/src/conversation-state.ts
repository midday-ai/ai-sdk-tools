/**
 * Conversation State Management
 * 
 * Manages shared context across agent handoffs, similar to OpenAI's RunState
 * but integrated with AI SDK's experimental_context system.
 */

export interface ConversationState {
  /** Facts learned during conversation (LLM extracts these) */
  facts: Record<string, {
    value: any;
    source: string;
    timestamp: Date;
  }>;
  
  /** Current execution plan for compound queries */
  currentPlan?: {
    goal: string;
    steps: Array<{ 
      description: string; 
      completed: boolean; 
      result?: string;
      agent?: string;
    }>;
    nextStep?: string;
  };
  
  /** Agent interaction history */
  handoffChain: Array<{ 
    agent: string; 
    query: string;
    findings: string;
    timestamp: Date;
  }>;
  
  /** Natural language summary (updated by LLM) */
  conversationSummary: string;
  
  /** Original user input */
  originalInput?: string;
}

export interface QueryPlan {
  analysis: string;
  informationNeeded: string[];
  proposedSteps: Array<{
    action: string;
    why: string;
    method: string;
  }>;
}

/**
 * Conversation State Manager
 * 
 * Handles state updates and provides utilities for context building
 */
export class ConversationStateManager {
  private state: ConversationState;

  constructor(initialInput?: string) {
    this.state = {
      facts: {},
      handoffChain: [],
      conversationSummary: '',
      originalInput: initialInput
    };
  }

  /**
   * Get current conversation state
   */
  getState(): ConversationState {
    return { ...this.state };
  }

  /**
   * Update conversation state
   */
  updateState(updates: Partial<ConversationState>): void {
    this.state = { ...this.state, ...updates };
  }

  /**
   * Add facts learned from an agent response
   */
  addFacts(facts: Record<string, any>, source: string): void {
    const timestamp = new Date();
    for (const [key, value] of Object.entries(facts)) {
      this.state.facts[key] = {
        value,
        source,
        timestamp
      };
    }
  }

  /**
   * Add handoff to the chain
   */
  addHandoff(agent: string, query: string, findings: string): void {
    this.state.handoffChain.push({
      agent,
      query,
      findings,
      timestamp: new Date()
    });
  }

  /**
   * Set current execution plan
   */
  setPlan(plan: ConversationState['currentPlan']): void {
    this.state.currentPlan = plan;
  }

  /**
   * Mark a plan step as completed
   */
  completePlanStep(stepIndex: number, result: string): void {
    if (this.state.currentPlan && this.state.currentPlan.steps[stepIndex]) {
      this.state.currentPlan.steps[stepIndex].completed = true;
      this.state.currentPlan.steps[stepIndex].result = result;
    }
  }

  /**
   * Update conversation summary
   */
  updateSummary(summary: string): void {
    this.state.conversationSummary = summary;
  }

  /**
   * Build context prompt for agents
   */
  buildContextPrompt(agentName: string): string {
    const { facts, currentPlan, handoffChain, conversationSummary } = this.state;
    
    let context = `## Conversation Context\n\n`;
    
    if (conversationSummary) {
      context += `${conversationSummary}\n\n`;
    } else {
      context += `This is the start of the conversation.\n\n`;
    }

    if (Object.keys(facts).length > 0) {
      context += `### Known Facts\n`;
      for (const [key, fact] of Object.entries(facts)) {
        context += `- ${key}: ${fact.value} (from ${fact.source})\n`;
      }
      context += `\n`;
    }

    if (currentPlan) {
      const completedSteps = currentPlan.steps.filter(s => s.completed).length;
      context += `### Current Plan\n`;
      context += `Goal: ${currentPlan.goal}\n`;
      context += `Progress: ${completedSteps}/${currentPlan.steps.length} steps completed\n`;
      
      if (currentPlan.nextStep) {
        context += `Next: ${currentPlan.nextStep}\n`;
      }
      context += `\n`;
    }

    if (handoffChain.length > 0) {
      context += `### Previous Agent Findings\n`;
      const recentFindings = handoffChain.slice(-3);
      for (const handoff of recentFindings) {
        context += `- ${handoff.agent}: ${handoff.findings}\n`;
      }
      context += `\n`;
    }

    return context.trim();
  }

  /**
   * Get relevant message history (intelligent truncation)
   */
  selectRelevantMessages(messages: any[], maxMessages: number = 20): any[] {
    // For now, return recent messages. In the future, this could be more intelligent
    // by analyzing message content and selecting the most relevant ones
    return messages.slice(-maxMessages);
  }

  /**
   * Serialize state for persistence
   */
  toJSON(): string {
    return JSON.stringify(this.state, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
  }

  /**
   * Deserialize state from JSON
   */
  static fromJSON(json: string): ConversationStateManager {
    const parsed = JSON.parse(json, (key, value) => {
      if (key === 'timestamp' && typeof value === 'string') {
        return new Date(value);
      }
      return value;
    });
    
    const manager = new ConversationStateManager();
    manager.state = parsed;
    return manager;
  }
}
