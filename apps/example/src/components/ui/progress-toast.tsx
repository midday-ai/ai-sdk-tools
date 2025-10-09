"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "@/components/ai-elements/loader";

interface ProgressToastProps {
  isVisible: boolean;
  stage: string;
  message?: string;
}

export function ProgressToast({
  isVisible,
  stage,
  message,
}: ProgressToastProps) {
  const getStageText = (stage: string) => {
    switch (stage) {
      case "loading":
        return "Initializing...";
      case "processing":
        return "Processing data...";
      case "analyzing":
        return "Analyzing...";
      case "complete":
        return "Complete";
      default:
        return "Processing...";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            className="bg-background/95 backdrop-blur-sm border border-border shadow-lg p-4 min-w-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              {/* Loading indicator */}
              <div className="flex items-center space-x-2">
                <Loader size={16} className="text-primary" />
                <span className="text-xs font-medium text-foreground">
                  {getStageText(stage)}
                </span>
              </div>
            </div>

            {/* Status message */}
            {message && (
              <p className="text-xs text-muted-foreground mt-2">{message}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
