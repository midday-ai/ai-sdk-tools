"use client";

import { useChatActions, useChatReset } from "@ai-sdk-tools/store";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function ChatHeader() {
  const reset = useChatReset();
  const { stop } = useChatActions();

  const handleReset = () => {
    stop();
    reset();
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-10">
        <button
          type="button"
          onClick={handleReset}
          className="cursor-pointer transition-opacity hover:opacity-80"
          aria-label="Reset chat"
        >
          <Logo />
        </button>
      </div>
      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </div>
    </>
  );
}
