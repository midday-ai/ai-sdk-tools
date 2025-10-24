"use client";

import { useChatActions, useDataPart } from "ai-sdk-tools/client";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

type SuggestionsData = {
  prompts: string[];
};

interface SuggestedPromptsProps {
  delay?: number;
}

export function SuggestedPrompts({ delay = 0 }: SuggestedPromptsProps = {}) {
  const [suggestions, clearSuggestions] =
    useDataPart<SuggestionsData>("suggestions");
  const { sendMessage } = useChatActions();

  const handlePromptClick = (prompt: string) => {
    clearSuggestions();
    sendMessage({ text: prompt });
  };

  if (!suggestions?.prompts || suggestions.prompts.length === 0) {
    return null;
  }

  const prompts = suggestions.prompts;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, delay, ease: "easeOut" }}
        className="flex gap-2 mb-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {prompts.map((prompt, index) => (
          <motion.div
            key={prompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.2,
              delay: delay + index * 0.05, // Add base delay to stagger
              ease: "easeOut",
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePromptClick(prompt)}
              className="rounded-full text-xs font-normal text-muted-foreground/60 hover:text-foreground hover:bg-accent border border-border/50 bg-[#fafafa]/80 dark:bg-background/50 backdrop-blur-sm flex-shrink-0 whitespace-nowrap"
            >
              {prompt}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
