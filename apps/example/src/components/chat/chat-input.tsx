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
}: ChatInputProps) {
  return (
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
          placeholder={hasMessages ? undefined : "Ask me anything..."}
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
          disabled={(!text.trim() && !status) || status === "streaming"}
          status={status}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
}
