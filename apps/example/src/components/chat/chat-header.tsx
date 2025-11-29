"use client";

import { ChatNavigation } from "./chat-navigation";
import { ChatTitle } from "./chat-title";
import { TokenUsage } from "./token-usage";

export function ChatHeader() {
  return (
    <div className="flex items-center justify-center relative h-8">
      <ChatNavigation />
      <ChatTitle />
      <div className="absolute right-0 flex items-center gap-2">
        <TokenUsage />
      </div>
    </div>
  );
}
