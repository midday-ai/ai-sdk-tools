"use client";

import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import type { AgentNode as AgentNodeData } from "../types";

interface AgentNodeComponentData extends AgentNodeData {
  label: string;
}

function AgentNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as AgentNodeComponentData;
  const {
    name,
    status,
    duration,
    // toolCallCount,
    // model,
    // routingStrategy,
    // matchScore,
    // round,
  } = nodeData;

  // Status icon and color
  const getStatusIcon = () => {
    switch (status) {
      case "executing":
        return <PlayArrowIcon sx={{ fontSize: 16 }} />;
      case "completed":
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case "error":
        return <ErrorIcon sx={{ fontSize: 16 }} />;
      default:
        return <ScheduleIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "executing":
        return "#f59e0b"; // orange/yellow accent
      case "completed":
        return "#4b5563"; // darker gray
      case "error":
        return "#f59e0b"; // orange for visibility
      default:
        return "#374151"; // dark gray
    }
  };

  const statusColor = getStatusColor();
  // const isActive = status === "executing";

  return (
    <>
      {/* Input handle (left for horizontal layout) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#3f3f46",
          width: 10,
          height: 10,
          border: "2px solid #18181b",
        }}
      />

      {/* Node content */}
      <div
        className="agent-node"
        style={{
          background: "#18181b",
          border: `1px solid #3f3f46`,
          borderRadius: 12,
          padding: "16px 18px",
          minWidth: 200,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Label: AGENT */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#71717a",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          AGENT
        </div>

        {/* Header: Name and Status Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 15,
              color: "#f4f4f5",
            }}
          >
            {name}
          </div>
          <div style={{ color: statusColor, display: "flex", fontSize: 14 }}>
            {getStatusIcon()}
          </div>
        </div>

        {/* Agent ID or description */}
        <div
          style={{
            fontSize: 13,
            color: "#a1a1aa",
            marginBottom: duration !== undefined ? 12 : 0,
            fontFamily: "monospace",
          }}
        >
          {name.toLowerCase().replace(/\s+/g, "-")}
        </div>

        {/* Duration */}
        {duration !== undefined && (
          <>
            <div
              style={{
                height: 1,
                background: "#27272a",
                margin: "12px 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
              }}
            >
              <span style={{ color: "#71717a" }}>Duration</span>
              <span style={{ color: "#f4f4f5", fontWeight: 500 }}>
                {duration.toFixed(2)}s
              </span>
            </div>
          </>
        )}
      </div>

      {/* Output handle (right for horizontal layout) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#3f3f46",
          width: 10,
          height: 10,
          border: "2px solid #18181b",
        }}
      />

      {/* Add pulse animation styles inline */}
      <style>
        {`
          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px ${statusColor}40, 0 4px 6px -1px rgb(0 0 0 / 0.3);
            }
            50% {
              box-shadow: 0 0 30px ${statusColor}60, 0 4px 6px -1px rgb(0 0 0 / 0.3);
            }
          }
        `}
      </style>
    </>
  );
}

export const AgentNode = memo(AgentNodeComponent);
