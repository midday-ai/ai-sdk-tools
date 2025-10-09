"use client";

import type { ChatStatus } from "ai";
import { GlobeIcon } from "lucide-react";
import type { RefObject } from "react";
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
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

interface ChatInputProps {
  text: string;
  setText: (text: string) => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  useWebSearch: boolean;
  setUseWebSearch: (value: boolean) => void;
  onSubmit: (message: PromptInputMessage) => void;
  status?: ChatStatus;
  hasMessages: boolean;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: string;
    code?: string;
  } | null;
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
  return (
    <div>
      <PromptInput
        globalDrop
        multiple
        onSubmit={onSubmit}
        className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-border"
      >
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea
            onChange={(event) => setText(event.target.value)}
            ref={textareaRef}
            value={text}
            placeholder={
              rateLimit?.code === "RATE_LIMIT_EXCEEDED"
                ? "Rate limit exceeded. Please try again tomorrow."
                : hasMessages
                  ? undefined
                  : "Ask me anything..."
            }
            disabled={rateLimit?.code === "RATE_LIMIT_EXCEEDED"}
            autoFocus
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
