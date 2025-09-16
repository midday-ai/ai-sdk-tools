"use client";

interface DevtoolsButtonProps {
  onToggle: () => void;
  eventCount: number;
  hasNewEvents: boolean;
  className?: string;
}

export function DevtoolsButton({
  onToggle,
  eventCount,
  hasNewEvents,
  className = "",
}: DevtoolsButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`ai-devtools-button ${hasNewEvents ? "receiving-events" : ""} ${className}`}
      title={`ai-devtools [${eventCount}]`}
    >
      {/* AI SDK Tools Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 95 83"
        className="ai-devtools-button-icon"
      >
        <title>AI SDK Tools Logo</title>
        <path fill="url(#a)" d="m22 .5 16 52L31 83H0L22 .5Z" />
        <path fill="#D9D9D9" d="M62 .5H30l13 41.25L56 83h31L62 .5Z" />
        <defs>
          <linearGradient
            id="a"
            x1={21.5}
            x2={21.5}
            y1={0.5}
            y2={83}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#737373" />
            <stop offset={1} stopColor="#D9D9D9" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
}
