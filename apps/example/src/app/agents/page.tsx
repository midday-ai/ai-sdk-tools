"use client";

import { useChat } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { GlobeIcon, LoaderIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import type { AgentUIMessage } from "@/types/agents";

const models = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-2", name: "Claude 2" },
  { id: "claude-instant", name: "Claude Instant" },
  { id: "palm-2", name: "PaLM 2" },
  { id: "llama-2-70b", name: "Llama 2 70B" },
  { id: "llama-2-13b", name: "Llama 2 13B" },
  { id: "cohere-command", name: "Command" },
  { id: "mistral-7b", name: "Mistral 7B" },
];

type AgentStatus = {
  status: "routing" | "executing" | "completing";
  agent:
    | "orchestrator"
    | "reports"
    | "transactions"
    | "invoices"
    | "timeTracking"
    | "customers"
    | "analytics"
    | "operations";
};

// Generate user-friendly status messages
const getStatusMessage = (status: AgentStatus) => {
  const { agent, status: state } = status;

  if (state === "routing") {
    return "Routing to specialist...";
  }

  if (state === "executing") {
    const messages: Record<AgentStatus["agent"], string> = {
      orchestrator: "Analyzing your request...",
      reports: "Generating financial reports...",
      transactions: "Fetching transactions...",
      invoices: "Managing invoices...",
      timeTracking: "Processing time entries...",
      customers: "Accessing customer data...",
      analytics: "Running analytics...",
      operations: "Processing request...",
    };
    return messages[agent] || "Processing...";
  }

  if (state === "completing") {
    return "Completing task...";
  }

  return "Processing...";
};

export default function Agents() {
  const [model, setModel] = useState<string>(models[0].id);
  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, stop } = useChat<AgentUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/agents-simple",
    }),
    onData: (dataPart) => {
      // Handle transient agent status updates
      if (dataPart.type === "data-agent-status") {
        // Clear status immediately when completing (smoother UX)
        if (dataPart.data.status === "completing") {
          setAgentStatus(null);
        } else {
          setAgentStatus(dataPart.data);
        }
      }
    },
    onFinish: () => {
      // Clear status when done (fallback)
      setAgentStatus(null);
    },
  });

  const handleSubmit = (message: PromptInputMessage) => {
    // If currently streaming or submitted, stop instead of submitting
    if (status === "streaming" || status === "submitted") {
      stop();
      return;
    }

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    if (message.files?.length) {
      toast.success("Files attached", {
        description: `${message.files.length} file(s) attached to message`,
      });
    }

    sendMessage({ text: message.text || "Sent with attachments" });
    setText("");
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden max-w-4xl mx-auto pb-38">
      <Conversation>
        <ConversationContent>
          {messages.map(({ parts, ...message }) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <Response>
                  {parts
                    .map((part) => (part.type === "text" ? part.text : ""))
                    .join("")}
                </Response>
              </MessageContent>
            </Message>
          ))}
          {/* Show agent status indicator */}
          {agentStatus && (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
              <LoaderIcon className="size-4 animate-spin" />
              <span className="flex items-center gap-1.5">
                <span className="font-medium capitalize">
                  {agentStatus.agent}
                </span>
                <span>•</span>
                <span>{getStatusMessage(agentStatus)}</span>
              </span>
            </div>
          )}
          {status === "submitted" && !agentStatus && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 pt-4">
        <div className="fixed bottom-0 left-0 right-0 w-full">
          <div className="w-full px-4 pb-4 max-w-4xl mx-auto">
            <PromptInput
              globalDrop
              multiple
              onSubmit={handleSubmit}
              className="bg-black/80 backdrop-blur-xl"
            >
              <PromptInputBody>
                <PromptInputAttachments>
                  {(attachment) => <PromptInputAttachment data={attachment} />}
                </PromptInputAttachments>
                <PromptInputTextarea
                  onChange={(event) => setText(event.target.value)}
                  ref={textareaRef}
                  value={text}
                />
              </PromptInputBody>
              <PromptInputToolbar>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  <PromptInputSpeechButton
                    onTranscriptionChange={setText}
                    textareaRef={textareaRef}
                  />
                  <PromptInputButton
                    onClick={() => setUseWebSearch(!useWebSearch)}
                    variant={useWebSearch ? "default" : "ghost"}
                  >
                    <GlobeIcon size={16} />
                    <span>Search</span>
                  </PromptInputButton>
                  <PromptInputModelSelect
                    onValueChange={setModel}
                    value={model}
                  >
                    <PromptInputModelSelectTrigger>
                      <PromptInputModelSelectValue />
                    </PromptInputModelSelectTrigger>
                    <PromptInputModelSelectContent>
                      {models.map((model) => (
                        <PromptInputModelSelectItem
                          key={model.id}
                          value={model.id}
                        >
                          {model.name}
                        </PromptInputModelSelectItem>
                      ))}
                    </PromptInputModelSelectContent>
                  </PromptInputModelSelect>
                </PromptInputTools>
                <PromptInputSubmit
                  disabled={(!text.trim() && !status) || status === "streaming"}
                  status={status}
                />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
