"use client";

import { useChatActions } from "ai-sdk-tools/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatInterface } from "@/hooks/use-chat-interface";

export function ChatNavigation() {
  const router = useRouter();
  const { reset } = useChatActions();
  const { isChatPage } = useChatInterface();

  const handleBack = () => {
    reset();
    router.push("/");
  };

  if (!isChatPage) return null;

  return (
    <div className="absolute left-4">
      <button
        type="button"
        onClick={handleBack}
        className="p-2 hover:bg-accent rounded-lg transition-colors"
        aria-label="Back to home"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );
}
