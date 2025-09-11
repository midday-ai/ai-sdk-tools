import { useMemo, useState } from "react";
import {
  type ModelId,
  contextHealth,
  costFromUsage,
  getContextWindow,
  modelMeta,
  normalizeUsage,
  percentOfContextUsed,
  shouldCompact,
  tokensRemaining,
  tokensToCompact,
} from "tokenlens";
import type { AIEvent } from "../types";

interface ContextCircleProps {
  events: AIEvent[];
  modelId?: ModelId;
  className?: string;
}

interface UsageData {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export function ContextCircle({
  events,
  modelId,
  className = "",
}: ContextCircleProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Extract usage data from events
  const usageData = useMemo((): UsageData | null => {
    // Look for usage data in finish events or message-complete events
    const finishEvents = events.filter(
      (event) => event.type === "finish" || event.type === "message-complete",
    );

    if (finishEvents.length === 0) return null;

    const latestFinish = finishEvents[finishEvents.length - 1];
    if (!latestFinish) return null;

    const usage = latestFinish.data?.usage || latestFinish.data?.usageMetadata;

    if (!usage) return null;

    // Normalize usage data to TokenLens format
    const normalizedUsage = normalizeUsage(usage);

    return {
      inputTokens:
        (normalizedUsage as any).input_tokens ||
        (normalizedUsage as any).inputTokens ||
        0,
      outputTokens:
        (normalizedUsage as any).completion_tokens ||
        (normalizedUsage as any).outputTokens ||
        0,
      totalTokens:
        (normalizedUsage as any).total_tokens ||
        (normalizedUsage as any).totalTokens ||
        0,
    };
  }, [events]);

  // Estimate usage from text-delta events if no explicit usage data
  const estimatedUsage = useMemo((): UsageData | null => {
    if (usageData) return null;

    const textDeltas = events.filter((event) => event.type === "text-delta");
    if (textDeltas.length === 0) return null;

    // Estimate tokens from character count (rough approximation)
    const totalCharacters = textDeltas.reduce((sum, event) => {
      const delta = event.data?.delta || "";
      return sum + delta.length;
    }, 0);

    // Rough estimation: 4 characters ≈ 1 token
    const estimatedTokens = Math.ceil(totalCharacters / 4);

    return {
      inputTokens: 0, // We can't distinguish input vs output from text-delta
      outputTokens: estimatedTokens,
      totalTokens: estimatedTokens,
    };
  }, [events, usageData]);

  const currentUsage = usageData || estimatedUsage;

  // Get model metadata
  const modelInfo = useMemo(() => {
    if (!modelId) return null;
    try {
      return modelMeta(modelId);
    } catch {
      return null;
    }
  }, [modelId]);

  // Calculate context metrics
  const contextMetrics = useMemo(() => {
    if (!currentUsage || !modelId) return null;

    try {
      const usage = {
        inputTokens: currentUsage.inputTokens,
        outputTokens: currentUsage.outputTokens,
        totalTokens: currentUsage.totalTokens,
      };

      const percentUsed = percentOfContextUsed({
        id: modelId,
        usage,
        reserveOutput: 256,
      });
      const remaining = tokensRemaining({
        id: modelId,
        usage,
        reserveOutput: 256,
      });
      const health = contextHealth({ modelId, usage });
      const needsCompaction = shouldCompact({ modelId, usage });
      const tokensToRemove = needsCompaction
        ? tokensToCompact({ modelId, usage })
        : 0;
      const cost = costFromUsage({ id: modelId, usage });
      const contextWindow = modelInfo ? getContextWindow(modelId) : undefined;

      return {
        percentUsed,
        remaining,
        health,
        needsCompaction,
        tokensToRemove,
        cost,
        contextWindow,
      };
    } catch {
      return null;
    }
  }, [currentUsage, modelId, modelInfo]);

  if (!contextMetrics || contextMetrics === null) {
    const modelInfo = modelId
      ? (() => {
          try {
            return modelMeta(modelId);
          } catch {
            return null;
          }
        })()
      : null;

    return (
      <div
        className={`ai-devtools-context-circle ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="ai-devtools-context-layout">
          {/* Percentage Text */}
          <div className="ai-devtools-context-percentage-text">0%</div>

          {/* Circle */}
          <div className="ai-devtools-context-circle-small">
            <svg
              width="20"
              height="20"
              className="ai-devtools-context-svg-small"
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="#666666"
                strokeWidth="1.5"
                className="ai-devtools-context-bg-small"
              />
            </svg>
          </div>
        </div>

        {/* Hover Tooltip with Default Values */}
        {isHovered && (
          <div className="ai-devtools-context-tooltip">
            <div className="ai-devtools-context-tooltip-content">
              {/* Progress Section */}
              <div className="ai-devtools-context-tooltip-progress-section">
                <div className="ai-devtools-context-tooltip-progress-header">
                  <span className="ai-devtools-context-tooltip-percentage">
                    0%
                  </span>
                  <span className="ai-devtools-context-tooltip-token-count">
                    0 / {modelInfo?.maxTokens?.toLocaleString() || "128K"}
                  </span>
                </div>
                <div className="ai-devtools-context-tooltip-progress-bar">
                  <div
                    className="ai-devtools-context-tooltip-progress-fill"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>

              {/* Input/Output Section */}
              <div className="ai-devtools-context-tooltip-usage-section">
                <div className="ai-devtools-context-tooltip-usage-row">
                  <span className="ai-devtools-context-tooltip-usage-label">
                    Input
                  </span>
                  <span className="ai-devtools-context-tooltip-usage-value">
                    0 • $0.0000
                  </span>
                </div>
                <div className="ai-devtools-context-tooltip-usage-row">
                  <span className="ai-devtools-context-tooltip-usage-label">
                    Output
                  </span>
                  <span className="ai-devtools-context-tooltip-usage-value">
                    0 • $0.0000
                  </span>
                </div>
              </div>

              {/* Total Cost Section */}
              <div className="ai-devtools-context-tooltip-cost-section">
                <span className="ai-devtools-context-tooltip-cost-label">
                  Total cost
                </span>
                <span className="ai-devtools-context-tooltip-cost-value">
                  $0.0000
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const {
    percentUsed,
    remaining,
    health,
    needsCompaction,
    tokensToRemove,
    cost,
    contextWindow,
  } = contextMetrics;

  // Calculate circle progress (0-100%)
  const circleProgress = Math.min(percentUsed * 100, 100);
  const circumference = 2 * Math.PI * 8; // radius = 8 for small circle
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (circleProgress / 100) * circumference;

  return (
    <div
      className={`ai-devtools-context-circle ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Percentage and Circle Layout */}
      <div className="ai-devtools-context-layout">
        {/* Percentage Text */}
        <div className="ai-devtools-context-percentage-text">
          {Math.round(percentUsed * 100) || "0.1"}%
        </div>

        {/* Circle */}
        <div className="ai-devtools-context-circle-small">
          <svg width="20" height="20" className="ai-devtools-context-svg-small">
            {/* Background circle */}
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="#666666"
              strokeWidth="1.5"
              className="ai-devtools-context-bg-small"
            />
            {/* Progress circle */}
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="#cccccc"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="ai-devtools-context-progress-small"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>
        </div>
      </div>

      {/* Hover Tooltip with Details */}
      {isHovered && (
        <div className="ai-devtools-context-tooltip">
          <div className="ai-devtools-context-tooltip-content">
            {/* Progress Section */}
            <div className="ai-devtools-context-tooltip-progress-section">
              <div className="ai-devtools-context-tooltip-progress-header">
                <span className="ai-devtools-context-tooltip-percentage">
                  {percentUsed * 100 < 1
                    ? "0.1"
                    : Math.round(percentUsed * 100)}
                  %
                </span>
                <span className="ai-devtools-context-tooltip-token-count">
                  {currentUsage?.totalTokens?.toLocaleString() || "0"} /{" "}
                  {typeof contextWindow === "number"
                    ? (contextWindow as number).toLocaleString()
                    : (contextWindow as any)?.combinedMax?.toLocaleString() ||
                      "128K"}
                </span>
              </div>
              <div className="ai-devtools-context-tooltip-progress-bar">
                <div
                  className="ai-devtools-context-tooltip-progress-fill"
                  style={{ width: `${Math.min(percentUsed * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Input/Output Section */}
            {currentUsage && (
              <div className="ai-devtools-context-tooltip-usage-section">
                <div className="ai-devtools-context-tooltip-usage-row">
                  <span className="ai-devtools-context-tooltip-usage-label">
                    Input
                  </span>
                  <span className="ai-devtools-context-tooltip-usage-value">
                    {currentUsage.inputTokens > 1000
                      ? `${Math.round(currentUsage.inputTokens / 1000)}K`
                      : currentUsage.inputTokens}{" "}
                    • $
                    {(
                      currentUsage.inputTokens *
                      (modelInfo?.pricePerTokenIn || 0)
                    ).toFixed(4)}
                  </span>
                </div>
                <div className="ai-devtools-context-tooltip-usage-row">
                  <span className="ai-devtools-context-tooltip-usage-label">
                    Output
                  </span>
                  <span className="ai-devtools-context-tooltip-usage-value">
                    {currentUsage.outputTokens > 1000
                      ? `${Math.round(currentUsage.outputTokens / 1000)}K`
                      : currentUsage.outputTokens}{" "}
                    • $
                    {(
                      currentUsage.outputTokens *
                      (modelInfo?.pricePerTokenOut || 0)
                    ).toFixed(4)}
                  </span>
                </div>
              </div>
            )}

            {/* Total Cost Section */}
            {currentUsage && (
              <div className="ai-devtools-context-tooltip-cost-section">
                <span className="ai-devtools-context-tooltip-cost-label">
                  Total cost
                </span>
                <span className="ai-devtools-context-tooltip-cost-value">
                  $
                  {(
                    currentUsage.inputTokens *
                      (modelInfo?.pricePerTokenIn || 0) +
                    currentUsage.outputTokens *
                      (modelInfo?.pricePerTokenOut || 0)
                  ).toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
