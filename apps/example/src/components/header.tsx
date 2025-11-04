"use client";

import { useChatActions, useChatReset } from "ai-sdk-tools/client";
import { Github, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  onToggleHistory?: () => void;
}

export function Header({ onToggleHistory }: HeaderProps) {
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
          onClick={onToggleHistory || handleReset}
          className="cursor-pointer transition-opacity hover:opacity-80 p-2 hover:bg-accent rounded-lg"
          aria-label={onToggleHistory ? "Toggle chat history" : "Reset chat"}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div className="fixed top-6 right-6 z-10 flex items-center gap-6">
        <a
          href="https://github.com/midday-ai/ai-sdk-tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-4 w-4" />
        </a>
        <ThemeToggle />
      </div>
    </>
  );
}
