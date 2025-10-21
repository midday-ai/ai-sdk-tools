"use client";

import { ChatNavigation } from "./chat-navigation";
import { ChatTitle } from "./chat-title";

export function ChatHeader() {
  return (
    <div className="flex items-center justify-center relative">
      <ChatNavigation />
      <ChatTitle />
    </div>
  );
}
