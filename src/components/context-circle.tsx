import { useMemo, useState } from "react";
import {
  getUsage,
} from "tokenlens/helpers";
import { getModels, } from "tokenlens/models";
import type { AIEvent } from "../types";
import type { LanguageModelUsage } from "ai";
import { ProviderModel, getModelMeta } from "tokenlens";

interface ContextCircleProps {
  events: AIEvent[];
  modelId?: string;
  className?: string;
}

const providers = getModels()

export function ContextCircle({
  events,
  modelId,
  className = "",
}: ContextCircleProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Extract usage data from events
  const usageData = useMemo((): LanguageModelUsage | null => {
    // Look for usage data in finish events or message-complete events
    const finishEvents = events.filter(
      (event) => event.type === "finish" || event.type === "message-complete",
    );

    if (finishEvents.length === 0) return null;

    const latestFinish = finishEvents[finishEvents.length - 1];
    if (!latestFinish) return null;

    const usage = latestFinish.data?.usage as LanguageModelUsage || latestFinish.data?.usageMetadata;

    if (!usage.inputTokens || !usage.outputTokens || !usage.totalTokens) return null;

    return {
      inputTokens:
        usage.inputTokens,
      outputTokens:
        usage.outputTokens,
      totalTokens:
        usage.totalTokens,
    };
  }, [events]);

  // Estimate usage from text-delta events if no explicit usage data
  const estimatedUsage = useMemo((): LanguageModelUsage | null => {
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


  const modelMeta = useMemo(() => {
    if (!modelId) return null;
    return getModelMeta({ model: modelId, providers }) as ProviderModel;
  }, [modelId]);

  // Calculate context metrics
  const contextMetrics = useMemo(() => {
    if (!currentUsage || !modelId) return null;

    const modelMeta = getUsage({ modelId, usage: currentUsage, providers });
    if (!modelMeta) return null;

    try {
      const percentUsed = modelMeta.context?.totalMax ? modelMeta.context.totalMax / (currentUsage.totalTokens || 0) : 0;
      const contextWindow = modelMeta.context?.totalMax || 0;

      return {
        percentUsed,
        contextWindow,
      };
    } catch {
      return null;
    }
  }, [currentUsage, modelId]);

  if (!contextMetrics || contextMetrics === null) {

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
                    0 / {modelMeta?.limit?.context?.toLocaleString() || "128K"}
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
                    : (contextWindow as number).toLocaleString() ||
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
                    {currentUsage.inputTokens && currentUsage.inputTokens > 1000
                      ? `${Math.round(currentUsage.inputTokens / 1000)}K`
                      : currentUsage.inputTokens}{" "}
                    • $
                    {(
                      currentUsage.inputTokens && currentUsage.inputTokens > 0 ?
                        currentUsage.inputTokens *
                        (modelMeta?.cost?.input || 0) : 0
                    ).toFixed(4)}

                  </span>
                </div>
                <div className="ai-devtools-context-tooltip-usage-row">
                  <span className="ai-devtools-context-tooltip-usage-label">
                    Output
                  </span>
                  <span className="ai-devtools-context-tooltip-usage-value">
                    {currentUsage.outputTokens && currentUsage.outputTokens > 1000
                      ? `${Math.round(currentUsage.outputTokens / 1000)}K`
                      : currentUsage.outputTokens}{" "}
                    • $
                    {(
                      (currentUsage.outputTokens || 0) *
                      (modelMeta?.cost?.output || 0)
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
                    (currentUsage.inputTokens || 0) *
                    (modelMeta?.cost?.input || 0) +
                    (currentUsage.outputTokens || 0) *
                    (modelMeta?.cost?.output || 0)
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
