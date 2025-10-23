"use client";

import { useChatId } from "@ai-sdk-tools/store";
import { useChatActions } from "ai-sdk-tools/client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useChatInterface } from "@/hooks/use-chat-interface";

const SUGGESTIONS = [
  "Show me my balance sheet",
  "What's our revenue this year",
  "Analyze our burn rate",
  "Can I afford a Tesla Model Y",
  "Show recent transactions",
  "How healthy is my business",
];

export function SuggestionPills() {
  const { sendMessage } = useChatActions();
  const { setChatId } = useChatInterface();
  const chatId = useChatId();

  const handleSuggestionClick = (suggestion: string) => {
    if (chatId) {
      setChatId(chatId);
    }

    sendMessage({ text: suggestion });
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {SUGGESTIONS.map((suggestion, index) => (
        <motion.div
          key={suggestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: 0.3 + index * 0.05,
            ease: "easeOut",
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSuggestionClick(suggestion)}
            className="rounded-full text-xs font-normal text-muted-foreground/60 hover:bg-accent"
          >
            {suggestion}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
