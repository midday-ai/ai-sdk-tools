"use client";

import { useChatId } from "@ai-sdk-tools/store";
import { useChatActions } from "ai-sdk-tools/client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useChatInterface } from "@/hooks/use-chat-interface";

const SUGGESTIONS = [
  { toolChoice: "balanceSheet", text: "Show me my balance sheet" },
  { toolChoice: "revenue", text: "What's our revenue this year" },
  { toolChoice: "burnRate", text: "Analyze our burn rate" },
  { toolChoice: "affordability", text: "Can I afford a Tesla Model Y" },
  { toolChoice: "transactions", text: "Show recent transactions" },
  { toolChoice: "health", text: "How healthy is my business" },
];

type Suggestion = (typeof SUGGESTIONS)[number];

export function SuggestionPills() {
  const { sendMessage } = useChatActions();
  const { setChatId } = useChatInterface();
  const chatId = useChatId();

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (chatId) {
      setChatId(chatId);
    }

    sendMessage({
      text: suggestion.text,
      metadata: {
        toolChoice: suggestion.toolChoice,
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {SUGGESTIONS.map((suggestion, index) => (
        <motion.div
          key={suggestion.toolChoice}
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
            {suggestion.text}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
