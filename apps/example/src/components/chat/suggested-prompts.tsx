"use client";

import { useDataPart } from "ai-sdk-tools/client";
import { useChatActions } from "ai-sdk-tools/client";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";

type SuggestionsData = {
  prompts: string[];
}

export function SuggestedPrompts() {
  const [suggestions, clearSuggestions] = useDataPart<SuggestionsData>("suggestions");
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
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-wrap gap-2 mb-2"
      >
        {prompts.map((prompt, index) => (
          <motion.div
            key={`${prompt}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.2,
              delay: index * 0.05,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePromptClick(prompt)}
              className="rounded-full text-xs font-normal text-muted-foreground/60 hover:text-foreground hover:bg-accent border border-border/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl"
            >
              {prompt}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

