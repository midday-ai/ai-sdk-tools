"use client";

import {
  Background,
  type Edge,
  MarkerType,
  type Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import dagre from "dagre";
import { useCallback, useEffect, useMemo } from "react";
import "@xyflow/react/dist/style.css";
import type { AgentFlowData, AIEvent } from "../types";
import { AgentNode } from "./agent-node";
import { ToolNode } from "./tool-node";

interface AgentFlowVisualizationProps {
  events: AIEvent[];
}

const nodeTypes = {
  agentNode: AgentNode,
  toolNode: ToolNode,
} as const;

// Auto-layout using dagre
function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction = "LR",
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 220;
  const nodeHeight = 180;
  const isHorizontal = direction === "LR";

  dagreGraph.setGraph({ rankdir: direction, ranksep: 250, nodesep: 120 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // Shift dagre node position (anchor=center) to top-left
      // to match React Flow node anchor point (top-left)
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

// Process events into agent flow data
function processAgentEvents(events: AIEvent[]): AgentFlowData {
  const agentMap = new Map<
    string,
    {
      name: string;
      status: "idle" | "executing" | "completed" | "error";
      startTime?: number;
      endTime?: number;
      toolCallCount: number;
      routingStrategy?: "programmatic" | "llm";
      matchScore?: number;
      round?: number;
      model?: string;
    }
  >();
  const handoffs: Array<{
    id: string;
    from: string;
    to: string;
    reason?: string;
    routingStrategy?: "programmatic" | "llm";
    timestamp: number;
  }> = [];
  const toolMap = new Map<
    string,
    {
      name: string;
      agent?: string;
      description?: string;
      callCount: number;
    }
  >();
  let totalRounds = 0;
  let isActive = false;
  let currentAgent: string | undefined;

  for (const event of events) {
    switch (event.type) {
      case "agent-start": {
        const agentName = event.metadata?.agent;
        if (agentName) {
          currentAgent = agentName;
          const existing = agentMap.get(agentName);
          agentMap.set(agentName, {
            name: agentName,
            status: "executing",
            // Preserve original startTime if it exists (don't overwrite on subsequent starts)
            startTime: existing?.startTime || event.timestamp,
            endTime: existing?.endTime,
            toolCallCount: existing?.toolCallCount || 0,
            routingStrategy: event.metadata?.routingStrategy,
            matchScore: event.metadata?.matchScore,
            round: event.metadata?.round,
            model: event.metadata?.model || existing?.model,
          });
          isActive = true;
        }
        break;
      }

      case "agent-finish": {
        const agentName = event.metadata?.agent;
        if (agentName && agentMap.has(agentName)) {
          const agent = agentMap.get(agentName);
          if (agent) {
            agentMap.set(agentName, {
              ...agent,
              status: "completed",
              endTime: event.timestamp,
              model: event.metadata?.model || agent.model,
            });
          }
        }
        break;
      }

      case "agent-error": {
        const agentName = event.metadata?.agent;
        if (agentName && agentMap.has(agentName)) {
          const agent = agentMap.get(agentName);
          if (agent) {
            agentMap.set(agentName, {
              ...agent,
              status: "error",
              endTime: event.timestamp,
            });
          }
        }
        break;
      }

      case "agent-handoff": {
        const fromAgent = event.metadata?.fromAgent;
        const toAgent = event.metadata?.toAgent;
        if (fromAgent && toAgent) {
          handoffs.push({
            id: `handoff-${handoffs.length}`,
            from: fromAgent,
            to: toAgent,
            reason: event.metadata?.reason,
            routingStrategy: event.metadata?.routingStrategy,
            timestamp: event.timestamp,
          });

          // Set routing strategy on the target agent
          if (toAgent && event.metadata?.routingStrategy) {
            const targetAgent = agentMap.get(toAgent);
            if (targetAgent) {
              agentMap.set(toAgent, {
                ...targetAgent,
                routingStrategy: event.metadata.routingStrategy,
              });
            } else {
              // Create placeholder for target agent if it doesn't exist yet
              agentMap.set(toAgent, {
                name: toAgent,
                status: "idle",
                toolCallCount: 0,
                routingStrategy: event.metadata.routingStrategy,
              });
            }
          }
        }
        break;
      }

      case "agent-complete": {
        totalRounds = event.metadata?.totalRounds || totalRounds;
        isActive = false;
        break;
      }

      case "tool-call-start": {
        // Track tool calls and create tool nodes
        const toolName = event.metadata?.toolName || event.data?.toolName;
        const agentName = currentAgent || event.metadata?.agent;

        // Filter out internal orchestration tools from visualization
        const isInternalTool = toolName === "handoff_to_agent"

        // Only track valid tool names (not undefined, empty, "unknown", or internal)
        if (
          toolName &&
          toolName !== "unknown" &&
          toolName.trim() !== "" &&
          !isInternalTool
        ) {
          const existing = toolMap.get(toolName);
          toolMap.set(toolName, {
            name: toolName,
            agent: agentName,
            description: event.metadata?.description || `${toolName} tool`,
            callCount: (existing?.callCount || 0) + 1,
          });

          // Also increment agent's tool call count
          if (agentName && agentMap.has(agentName)) {
            const agent = agentMap.get(agentName);
            if (agent) {
              agentMap.set(agentName, {
                ...agent,
                toolCallCount: agent.toolCallCount + 1,
              });
            }
          }
        }
        break;
      }

      case "finish": {
        // Try to extract model from response metadata
        if (currentAgent && agentMap.has(currentAgent)) {
          const agent = agentMap.get(currentAgent);
          const responseModel =
            event.data?.response?.model || event.data?.model;
          if (agent && responseModel) {
            agentMap.set(currentAgent, {
              ...agent,
              model: responseModel,
            });
          }
        }
        break;
      }
    }
  }

  const nodes = Array.from(agentMap.entries()).map(([id, data]) => ({
    id,
    ...data,
    duration:
      data.startTime && data.endTime
        ? (data.endTime - data.startTime) / 1000
        : undefined,
  }));

  const tools = Array.from(toolMap.entries()).map(([id, data]) => ({
    id,
    ...data,
  }));

  const firstEvent = events.find(
    (e) => e.type === "agent-start" || e.type === "agent-handoff",
  );
  const lastEvent = [...events]
    .reverse()
    .find((e) => e.type === "agent-finish" || e.type === "agent-complete");

  const totalDuration =
    firstEvent && lastEvent
      ? (lastEvent.timestamp - firstEvent.timestamp) / 1000
      : 0;

  return {
    nodes,
    tools,
    handoffs,
    totalRounds,
    totalDuration,
    isActive,
  };
}

export function AgentFlowVisualization({
  events,
}: AgentFlowVisualizationProps) {
  const agentFlowData = useMemo(() => processAgentEvents(events), [events]);

  // Convert agent flow data to ReactFlow nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    const agentNodes = agentFlowData.nodes.map((node, index) => ({
      id: node.id,
      type: "agentNode",
      position: { x: index * 300, y: 50 },
      data: {
        ...node,
        label: node.name,
      },
    }));

    const toolNodes = agentFlowData.tools.map((tool) => {
      // Position tool nodes below their associated agents
      const agentIndex = agentFlowData.nodes.findIndex(
        (n) => n.id === tool.agent,
      );
      return {
        id: `tool-${tool.id}`,
        type: "toolNode",
        position: { x: agentIndex >= 0 ? agentIndex * 300 : 0, y: 280 },
        data: {
          ...tool,
          label: tool.name,
          description: `A ${tool.name} tool`,
        },
      };
    });

    return [...agentNodes, ...toolNodes];
  }, [agentFlowData.nodes, agentFlowData.tools]);

  const initialEdges: Edge[] = useMemo(() => {
    // Agent handoff edges
    const handoffEdges = agentFlowData.handoffs.map((handoff) => {
      // Format label as "Routing (strategy)"
      const label = handoff.routingStrategy
        ? `Routing (${handoff.routingStrategy})`
        : handoff.reason || "Handoff";

      return {
        id: handoff.id,
        source: handoff.from,
        target: handoff.to,
        type: "smoothstep",
        animated: true,
        label,
        style: { stroke: "#3f3f46", strokeWidth: 1.5 },
        labelStyle: {
          fill: "#71717a",
          fontSize: 10,
          fontWeight: 500,
        },
        labelBgStyle: { fill: "#18181b", fillOpacity: 0.95 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: "#3f3f46",
        },
      };
    });

    // Agent to tool edges
    const toolEdges = agentFlowData.tools.map((tool) => ({
      id: `edge-${tool.agent}-${tool.id}`,
      source: tool.agent || "",
      target: `tool-${tool.id}`,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#3f3f46", strokeWidth: 1, strokeDasharray: "5,5" },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: "#3f3f46",
      },
    }));

    return [...handoffEdges, ...toolEdges];
  }, [agentFlowData.handoffs, agentFlowData.tools]);

  // Apply dagre layout to nodes (LR = left-to-right tree layout)
  const layoutedElements = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, "LR");
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    layoutedElements.nodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    layoutedElements.edges,
  );

  // Update nodes and edges when data changes
  useEffect(() => {
    const newLayout = getLayoutedElements(initialNodes, initialEdges, "LR");
    setNodes(newLayout.nodes);
    setEdges(newLayout.edges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onInit = useCallback(() => {
    // Optional: Add any initialization logic
  }, []);

  // Show empty state if no agent events
  if (agentFlowData.nodes.length === 0) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
        }}
      >
        <div className="ai-devtools-state-explorer-empty-content">
          <div className="ai-devtools-state-explorer-empty-title">
            No Agent Activity
          </div>
          <div className="ai-devtools-state-explorer-empty-description">
            Start a conversation with an agent-based
            <br /> system to see the orchestration flow here
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%", background: "#000000" }}>
      {/* ReactFlow canvas */}
      <div style={{ height: "100%", width: "100%", position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3, maxZoom: 0.8 }}
          minZoom={0.3}
          maxZoom={2}
          nodesConnectable={false}
          edgesReconnectable={false}
          edgesFocusable={false}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
          }}
        >
          <Background
            color="#3f3f46"
            gap={24}
            size={1}
            style={{ background: "#000000" }}
          />
        </ReactFlow>
        
        {/* Agent Stats Footer */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "24px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 12px",
          fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
          fontSize: "10px",
          color: "#cccccc"
        }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: 600, color: "#ffffff" }}>{agentFlowData.nodes.length}</span>
              <span style={{ color: "#666666" }}>Agents</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: 600, color: "#ffffff" }}>{agentFlowData.handoffs.length}</span>
              <span style={{ color: "#666666" }}>Handoffs</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: 600, color: "#ffffff" }}>{agentFlowData.totalRounds}</span>
              <span style={{ color: "#666666" }}>Rounds</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: 600, color: "#ffffff" }}>
                {agentFlowData.totalDuration > 0 
                  ? `${(agentFlowData.totalDuration / 1000).toFixed(2)}s`
                  : "0s"
                }
              </span>
              <span style={{ color: "#666666" }}>Duration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add pulse animation styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          /* Dark mode ReactFlow overrides */
          .react-flow__node {
            cursor: pointer;
          }
          
          .react-flow__edge-path {
            stroke: #3f3f46;
          }
          
          .react-flow__edge-text {
            fill: #71717a;
          }
          
          .react-flow__background {
            background: #000000;
          }
          
          .react-flow__pane {
            cursor: default;
          }
          
          /* Hide ReactFlow attribution */
          .react-flow__panel.react-flow__attribution {
            display: none;
          }
        `}
      </style>
    </div>
  );
}
