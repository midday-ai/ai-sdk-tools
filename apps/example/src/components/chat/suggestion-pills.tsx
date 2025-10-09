"use client";

import { useChatActions } from "@ai-sdk-tools/store";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "Show me the balance sheet",
  "What's our revenue this year",
  "Analyze our burn rate",
  "Show recent invoices",
  "How's our cash flow",
];

export function SuggestionPills() {
  const { sendMessage } = useChatActions();

  const handleSuggestionClick = (suggestion: string) => {
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
