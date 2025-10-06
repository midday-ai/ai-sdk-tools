"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { followupQuestionsArtifact } from "@/ai/artifacts/followup-questions";

interface FollowupQuestionsProps {
  onQuestionClick?: (question: string) => void;
}

export function FollowupQuestions({ onQuestionClick }: FollowupQuestionsProps) {
  const followupData = useArtifact(followupQuestionsArtifact);

  if (!followupData?.data?.questions || followupData?.data?.questions?.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 px-4">
      <div className="flex flex-wrap gap-2">
        {followupData.data.questions.slice(0, 4).map((question, index) => (
          <button
            key={index}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors border border-gray-200 dark:border-gray-600"
            onClick={() => {
              onQuestionClick?.(question);
              console.log("Follow-up question clicked:", question);
            }}
          >
            {question}
          </button>
        ))}
      </div>
      
    </div>
  );
}
