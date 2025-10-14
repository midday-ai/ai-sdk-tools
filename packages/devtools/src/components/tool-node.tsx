"use client";

import { Build as BuildIcon } from "@mui/icons-material";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import { memo } from "react";

interface ToolNodeData {
  name: string;
  description?: string;
  label: string;
}

function ToolNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as ToolNodeData;
  const { name, description } = nodeData;

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
        className="tool-node"
        style={{
          background: "#18181b",
          border: `1px solid #3f3f46`,
          borderRadius: 0,
          padding: "16px 18px",
          minWidth: 200,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Label: TOOL */}
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
          TOOL
        </div>

        {/* Header: Name and Icon */}
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
          <div style={{ color: "#f59e0b", display: "flex", fontSize: 14 }}>
            <BuildIcon sx={{ fontSize: 16 }} />
          </div>
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: 13,
              color: "#a1a1aa",
            }}
          >
            {description}
          </div>
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
    </>
  );
}

export const ToolNode = memo(ToolNodeComponent);
