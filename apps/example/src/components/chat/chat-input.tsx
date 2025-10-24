"use client";

import { useChatId } from "@ai-sdk-tools/store";
import type { ChatStatus } from "ai";
import { GlobeIcon } from "lucide-react";
import { type RefObject, useEffect, useState } from "react";
import {
  type CommandMetadata,
  type CommandSelection,
  PromptCommands,
  PromptCommandsTextarea,
  useCommandActions,
} from "@/components/ai-elements/prompt-commands";
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
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { VoiceInputButton } from "@/components/ai-elements/voice-input-button";
import { LiveWaveform } from "@/components/ui/live-waveform";
import { useChatInterface } from "@/hooks/use-chat-interface";

export interface ChatInputMessage extends PromptInputMessage {
  metadata?: {
    agentChoice?: string;
    toolChoice?: string;
  };
}

interface ChatInputProps {
  text: string;
  setText: (text: string) => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  useWebSearch: boolean;
  setUseWebSearch: (value: boolean) => void;
  onSubmit: (message: ChatInputMessage) => void;
  status?: ChatStatus;
  hasMessages: boolean;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: string;
    code?: string;
  } | null;
}

function ChatInputInner({
  text,
  setText,
  textareaRef,
  useWebSearch,
  setUseWebSearch,
  onSubmit,
  status,
  hasMessages,
  rateLimit,
  selection,
}: ChatInputProps & {
  selection: CommandSelection;
}) {
  const { clearPills } = useCommandActions();
  const { setChatId } = useChatInterface();
  const chatId = useChatId();
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    if (chatId) {
      setChatId(chatId);
    }

    // Merge message with command selection and web search button
    onSubmit({
      ...message,
      metadata: {
        agentChoice: selection.agentChoice,
        // If Search button is active and no tool selected, use webSearch
        toolChoice:
          selection.toolChoice || (useWebSearch ? "webSearch" : undefined),
      },
    });

    // Clear pills and reset search button after submit
    clearPills();
    setUseWebSearch(false);
  };

  return (
    <PromptInput
      globalDrop
      multiple
      onSubmit={handleSubmit}
      className="bg-[#fafafa]/80 dark:bg-background/50 backdrop-blur-xl"
    >
      <PromptInputBody>
        {isRecording && audioStream ? (
          <div className="flex items-center justify-center w-full h-[56px] px-6">
            <LiveWaveform
              audioStream={audioStream}
              barCount={120}
              minHeight={12}
              maxHeight={32}
              className="w-full"
            />
          </div>
        ) : (
          <>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptCommandsTextarea
              onChange={(event) => setText(event.target.value)}
              ref={textareaRef}
              value={text}
              placeholder={
                rateLimit?.code === "RATE_LIMIT_EXCEEDED"
                  ? "Rate limit exceeded. Please try again tomorrow."
                  : hasMessages
                    ? "Ask me anything (or use @agent or /tool)"
                    : "Ask me anything (or use @agent or /tool)"
              }
              disabled={rateLimit?.code === "RATE_LIMIT_EXCEEDED"}
              autoFocus
            />
          </>
        )}
      </PromptInputBody>

      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <VoiceInputButton
            onTranscriptionChange={setText}
            onRecordingStateChange={setIsRecording}
            onAudioStreamChange={setAudioStream}
            textareaRef={textareaRef}
          />
          <PromptInputButton
            onClick={() => setUseWebSearch(!useWebSearch)}
            variant={useWebSearch ? "default" : "ghost"}
          >
            <GlobeIcon size={16} />
            <span>Search</span>
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={
            (!text.trim() && !status) ||
            status === "streaming" ||
            rateLimit?.code === "RATE_LIMIT_EXCEEDED"
          }
          status={status}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
}

export function ChatInput({
  text,
  setText,
  textareaRef,
  useWebSearch,
  setUseWebSearch,
  onSubmit,
  status,
  hasMessages,
  rateLimit,
}: ChatInputProps) {
  const [metadata, setMetadata] = useState<CommandMetadata>({
    agents: [],
    tools: [],
  });
  const [selection, setSelection] = useState<CommandSelection>({});

  // Fetch metadata on mount
  useEffect(() => {
    fetch("/api/metadata")
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch((err) => console.error("Failed to fetch metadata:", err));
  }, []);

  return (
    <div>
      <PromptCommands metadata={metadata} onSelectionChange={setSelection}>
        <ChatInputInner
          text={text}
          setText={setText}
          textareaRef={textareaRef}
          useWebSearch={useWebSearch}
          setUseWebSearch={setUseWebSearch}
          onSubmit={onSubmit}
          status={status}
          hasMessages={hasMessages}
          rateLimit={rateLimit}
          selection={selection}
        />
      </PromptCommands>

      <div className="h-5">
        {rateLimit && rateLimit.remaining < 5 && (
          <div
            className={`py-2 text-[11px] border-t border-border/50 ${
              rateLimit.code === "RATE_LIMIT_EXCEEDED"
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
            }`}
          >
            <div className="flex w-full">
              <span>
                {rateLimit.code === "RATE_LIMIT_EXCEEDED"
                  ? "Rate limit exceeded - try again tomorrow"
                  : `Messages remaining: ${rateLimit.remaining} / ${rateLimit.limit}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
