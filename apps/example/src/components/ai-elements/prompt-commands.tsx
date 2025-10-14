"use client";

import {
  type ChangeEvent,
  type ComponentProps,
  createContext,
  type KeyboardEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { InputGroupTextarea } from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Optional import - don't throw if missing
const usePromptInputController = (): {
  textInput: {
    value: string;
    setInput: (v: string) => void;
    clear: () => void;
  };
} | null => {
  // This is a workaround to avoid requiring PromptInputProvider
  // We'll manage state ourselves if provider is not present
  return null;
};

export interface AgentMetadata {
  name: string;
  description: string;
  tools: string[];
}

export interface ToolMetadata {
  name: string;
  description: string;
  agent: string;
}

export interface CommandMetadata {
  agents: AgentMetadata[];
  tools: ToolMetadata[];
}

export interface CommandSelection {
  agentChoice?: string;
  toolChoice?: string;
}

export interface SelectedPill {
  type: "agent" | "tool";
  value: string;
  label: string;
}

// ============================================================================
// Context
// ============================================================================

interface PromptCommandsContextValue {
  metadata: CommandMetadata;
  selection: CommandSelection;
  setSelection: (selection: CommandSelection) => void;
  pills: SelectedPill[];
  setPills: (pills: SelectedPill[]) => void;
  removePill: (index: number) => void;
  clearPills: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  trigger: "@" | "/" | null;
  setTrigger: (trigger: "@" | "/" | null) => void;
  filter: string;
  setFilter: (filter: string) => void;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onSubmit?: () => void;
  onToolSubmit?: (toolName: string, toolDescription: string) => void;
  onAgentSelect?: (agentName: string) => void;
}

const PromptCommandsContext = createContext<PromptCommandsContextValue | null>(
  null,
);

function usePromptCommands() {
  const ctx = useContext(PromptCommandsContext);
  if (!ctx) {
    throw new Error(
      "usePromptCommands must be used within PromptCommands component",
    );
  }
  return ctx;
}

// ============================================================================
// Main Provider Component
// ============================================================================

export interface PromptCommandsProps {
  metadata: CommandMetadata;
  onSelectionChange?: (selection: CommandSelection) => void;
  onSubmit?: () => void;
  onToolSubmit?: (toolName: string, toolDescription: string) => void;
  onAgentSelect?: (agentName: string) => void;
  children: React.ReactNode;
}

export function PromptCommands({
  metadata,
  onSelectionChange,
  onSubmit,
  onToolSubmit,
  onAgentSelect,
  children,
}: PromptCommandsProps) {
  const [selection, setSelectionState] = useState<CommandSelection>({});
  const [pills, setPills] = useState<SelectedPill[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [trigger, setTrigger] = useState<"@" | "/" | null>(null);
  const [filter, setFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const setSelection = useCallback(
    (newSelection: CommandSelection) => {
      setSelectionState(newSelection);
      onSelectionChange?.(newSelection);
    },
    [onSelectionChange],
  );

  const removePill = useCallback((index: number) => {
    setPills((prev) => {
      const newPills = prev.filter((_, i) => i !== index);
      return newPills;
    });
  }, []);

  const clearPills = useCallback(() => {
    setPills([]);
  }, []);

  // Update selection when pills change
  useEffect(() => {
    const agentPill = pills.find((p) => p.type === "agent");
    const toolPill = pills.find((p) => p.type === "tool");
    setSelection({
      agentChoice: agentPill?.value,
      toolChoice: toolPill?.value,
    });
  }, [pills, setSelection]);

  const value = useMemo<PromptCommandsContextValue>(
    () => ({
      metadata,
      selection,
      setSelection,
      pills,
      setPills,
      removePill,
      clearPills,
      isOpen,
      setIsOpen,
      trigger,
      setTrigger,
      filter,
      setFilter,
      anchorEl,
      setAnchorEl,
      selectedIndex,
      setSelectedIndex,
      onSubmit,
      onToolSubmit,
      onAgentSelect,
    }),
    [
      metadata,
      selection,
      setSelection,
      pills,
      removePill,
      clearPills,
      isOpen,
      trigger,
      filter,
      anchorEl,
      selectedIndex,
      onSubmit,
      onToolSubmit,
      onAgentSelect,
    ],
  );

  return (
    <PromptCommandsContext.Provider value={value}>
      {children}
    </PromptCommandsContext.Provider>
  );
}

// ============================================================================
// Enhanced Textarea with Command Detection
// ============================================================================

export type PromptCommandsTextareaProps = ComponentProps<
  typeof InputGroupTextarea
> & {
  onSelectionSubmit?: (selection: CommandSelection) => void;
  onToolSubmit?: (toolName: string, toolDescription: string) => void;
};

export function PromptCommandsTextarea({
  onKeyDown,
  onChange,
  className,
  placeholder = "What would you like to know?",
  onSelectionSubmit,
  onToolSubmit,
  ...props
}: PromptCommandsTextareaProps) {
  const controller = usePromptInputController();
  const commands = usePromptCommands();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const triggerPositionRef = useRef<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Detect @ or / triggers
  const detectTrigger = useCallback(
    (value: string, cursorPos: number) => {
      // Get text before cursor
      const textBeforeCursor = value.substring(0, cursorPos);

      // Check for @ at start or after whitespace
      const atMatch = textBeforeCursor.match(/@(\w*)$/);
      if (atMatch) {
        triggerPositionRef.current = cursorPos - atMatch[0].length;
        commands.setTrigger("@");
        commands.setFilter(atMatch[1] || "");
        commands.setSelectedIndex(0);
        commands.setIsOpen(true);
        return;
      }

      // Check for / at start of input
      const slashMatch = textBeforeCursor.match(/^\/(\w*)$/);
      if (slashMatch) {
        triggerPositionRef.current = 0;
        commands.setTrigger("/");
        commands.setFilter(slashMatch[1] || "");
        commands.setSelectedIndex(0);
        commands.setIsOpen(true);
        return;
      }

      // No trigger found - close palette if it's open
      if (commands.isOpen) {
        commands.setIsOpen(false);
        commands.setTrigger(null);
        commands.setFilter("");
      }
    },
    [commands],
  );

  // Get total items count for navigation
  const getTotalItems = useCallback(() => {
    if (!commands.isOpen) return 0;

    let total = 0;
    if (commands.trigger === "@" || commands.trigger === "/") {
      total += commands.metadata.agents.filter((agent) =>
        agent.name.toLowerCase().includes(commands.filter.toLowerCase()),
      ).length;
    }
    if (commands.trigger === "/") {
      total += commands.metadata.tools.filter((tool) =>
        tool.name.toLowerCase().includes(commands.filter.toLowerCase()),
      ).length;
    }
    return total;
  }, [commands]);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      // Handle backspace to remove pills when input is empty
      if (
        e.key === "Backspace" &&
        !commands.isOpen &&
        e.currentTarget.value === "" &&
        commands.pills.length > 0
      ) {
        e.preventDefault();
        commands.removePill(commands.pills.length - 1);
        return;
      }

      // When palette is open, handle navigation
      if (commands.isOpen) {
        if (e.key === "Escape") {
          commands.setIsOpen(false);
          commands.setTrigger(null);
          commands.setSelectedIndex(0);
          e.preventDefault();
          return;
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          const total = getTotalItems();
          const nextIndex = (commands.selectedIndex + 1) % total;
          commands.setSelectedIndex(nextIndex);
          return;
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          const total = getTotalItems();
          const prevIndex = (commands.selectedIndex - 1 + total) % total;
          commands.setSelectedIndex(prevIndex);
          return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          // Trigger selection of current item
          const textarea = e.currentTarget;
          const selectEvent = new CustomEvent("selectItem", {
            detail: { index: commands.selectedIndex },
          });
          textarea.dispatchEvent(selectEvent);
          return;
        }

        if (e.key === "Tab") {
          e.preventDefault();
          const total = getTotalItems();
          const nextIndex = (commands.selectedIndex + 1) % total;
          commands.setSelectedIndex(nextIndex);
          return;
        }

        // Let other keys through for typing
        return;
      }

      if (e.key === "Enter") {
        if (e.nativeEvent.isComposing) return;
        if (e.shiftKey) return;
        e.preventDefault();

        // Submit with current selection
        if (onSelectionSubmit) {
          onSelectionSubmit(commands.selection);
        }

        e.currentTarget.form?.requestSubmit();
      }

      onKeyDown?.(e);
    },
    [commands, getTotalItems, onKeyDown, onSelectionSubmit],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPos = e.target.selectionStart;

      if (controller) {
        controller.textInput.setInput(value);
      }
      onChange?.(e);

      // Detect triggers
      detectTrigger(value, cursorPos);
    },
    [controller, onChange, detectTrigger],
  );

  // Set anchor element for popover positioning
  useEffect(() => {
    if (wrapperRef.current) {
      commands.setAnchorEl(wrapperRef.current);
    }
  }, [commands]);


  const handlePaste: React.ClipboardEventHandler<HTMLTextAreaElement> = () => {
    // Allow default paste behavior
    // Future: could handle pasted content with commands
  };

  const controlledProps = controller
    ? {
        value: controller.textInput.value,
        onChange: handleChange,
      }
    : {
        // When no controller, pass through the value from props
        onChange: handleChange,
      };

  // Adjust placeholder based on whether we have pills
  const effectivePlaceholder = (() => {
    if (commands.pills.length > 0) {
      const agentPill = commands.pills.find(p => p.type === "agent");
      const toolPill = commands.pills.find(p => p.type === "tool");
      
      if (agentPill) {
        return `Ask ${agentPill.label}...`;
      } else if (toolPill) {
        return `Use ${toolPill.label}...`;
      }
    }
    return placeholder;
  })();

  return (
    <Popover open={commands.isOpen} onOpenChange={commands.setIsOpen}>
      <PopoverTrigger asChild>
        <div ref={wrapperRef} className="relative w-full">
          <div className="flex items-start flex-wrap">
            {commands.pills.length > 0 &&
              commands.pills.map((pill) => (
                <div
                  key={`${pill.type}-${pill.value}`}
                  className="inline-flex items-center px-1.5 py-0.5 text-sm bg-accent text-accent-foreground ml-2 mt-2.5"
                >
                  <span>{pill.label}</span>
                </div>
              ))}
            <div className="flex-1 min-w-0">
              <InputGroupTextarea
                ref={textareaRef}
                className={className}
                name="message"
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={effectivePlaceholder}
                {...props}
                {...controlledProps}
              />
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PromptCommandsPaletteContent />
    </Popover>
  );
}

function PromptCommandsPaletteContent() {
  const commands = usePromptCommands();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (
      type: "agent" | "tool",
      value: string,
      _data: AgentMetadata | ToolMetadata,
    ) => {
      const wrapper = commands.anchorEl as HTMLDivElement;
      if (!wrapper) return;

      const textarea = wrapper.querySelector("textarea");
      if (!textarea) return;

      const currentValue = textarea.value;
      const cursorPos = textarea.selectionStart;

      // Close palette and clear state FIRST to prevent re-triggering
      commands.setIsOpen(false);
      commands.setTrigger(null);
      commands.setSelectedIndex(0);
      commands.setFilter("");

      // Remove the trigger and filter text completely (pill will show the selection)
      const textBefore = currentValue.substring(0, cursorPos);
      const textAfter = currentValue.substring(cursorPos);

      let newValue: string;

      if (type === "agent") {
        // Remove @filter completely
        const newTextBefore = textBefore.replace(/@(\w*)$/, "");
        newValue = newTextBefore + textAfter;
      } else {
        // Remove /filter completely
        const newTextBefore = textBefore.replace(/^\/(\w*)$/, "");
        newValue = newTextBefore + textAfter;
      }

      // Add pill FIRST (before updating textarea to avoid re-triggering)
      const label = type === "agent" ? `@${value}` : `/${value}`;
      const existingPills = commands.pills.filter((p) => p.type !== type);
      commands.setPills([...existingPills, { type, value, label }]);

      // Update textarea value and trigger React's onChange
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, newValue);
      } else {
        textarea.value = newValue;
      }

      // Dispatch native input event that React will pick up
      const inputEvent = new Event("input", { bubbles: true });
      textarea.dispatchEvent(inputEvent);

      // For tools/commands, submit immediately
      if (type === "tool") {
        setTimeout(() => {
          // Call the tool submit callback if provided
          if (commands.onToolSubmit) {
            commands.onToolSubmit(value, _data.description);
          } else if (commands.onSubmit) {
            commands.onSubmit();
          } else {
            // Fallback to form submit if no callbacks provided
            const form = textarea.closest("form");
            if (form) {
              form.requestSubmit();
            }
          }
        }, 10);
      } else {
        // For agents, call the agent select callback and focus back on textarea
        if (commands.onAgentSelect) {
          commands.onAgentSelect(value);
        }
        setTimeout(() => {
          textarea.focus();
          const cursorPosition = newValue.length - textAfter.length;
          textarea.setSelectionRange(cursorPosition, cursorPosition);
        }, 10);
      }
    },
    [commands],
  );

  // Filter items based on trigger and filter text
  const filteredAgents = useMemo(() => {
    if (commands.trigger !== "@") return [];
    return commands.metadata.agents.filter((agent) =>
      agent.name.toLowerCase().includes(commands.filter.toLowerCase()),
    );
  }, [commands.metadata.agents, commands.filter, commands.trigger]);

  const filteredTools = useMemo(() => {
    if (commands.trigger !== "/") return [];
    return commands.metadata.tools.filter((tool) =>
      tool.name.toLowerCase().includes(commands.filter.toLowerCase()),
    );
  }, [commands.metadata.tools, commands.filter, commands.trigger]);

  // Combined items list for selection
  const allItems = useMemo(() => {
    const items: Array<{
      type: "agent" | "tool";
      value: string;
      data: AgentMetadata | ToolMetadata;
    }> = [];
    for (const agent of filteredAgents) {
      items.push({ type: "agent", value: agent.name, data: agent });
    }
    for (const tool of filteredTools) {
      items.push({ type: "tool", value: tool.name, data: tool });
    }
    return items;
  }, [filteredAgents, filteredTools]);

  // Listen for selectItem custom event from textarea
  useEffect(() => {
    const wrapper = commands.anchorEl as HTMLDivElement;
    if (!wrapper) return;

    const textarea = wrapper.querySelector("textarea");
    if (!textarea) return;

    const handleSelectItem = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      const item = allItems[customEvent.detail.index];
      if (item) {
        handleSelect(item.type, item.value, item.data);
      }
    };

    textarea.addEventListener("selectItem", handleSelectItem);
    return () => textarea.removeEventListener("selectItem", handleSelectItem);
  }, [commands.anchorEl, allItems, handleSelect]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedRef = itemRefs.current[commands.selectedIndex];
    if (selectedRef) {
      selectedRef.scrollIntoView({ block: "nearest" });
    }
  }, [commands.selectedIndex]);

  // Only show if palette is open AND there are items to show
  if (!commands.isOpen || allItems.length === 0) return null;

  return (
    <PopoverContent
      className="p-0 max-h-[300px] overflow-y-auto w-[var(--radix-popover-trigger-width)] rounded-none"
      align="center"
      side="bottom"
      alignOffset={0}
      sideOffset={55}
      avoidCollisions={false}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <div className="py-1">
        {filteredAgents.length > 0 && (
          <div>
            {filteredAgents.map((agent, index) => {
              const globalIndex = index;
              return (
                <button
                  key={agent.name}
                  type="button"
                  ref={(el) => {
                    itemRefs.current[globalIndex] = el;
                  }}
                  className={cn(
                    "px-2 py-2 cursor-pointer text-left w-full",
                    globalIndex === commands.selectedIndex
                      ? "bg-accent"
                      : "hover:bg-accent/50",
                  )}
                  onClick={() => handleSelect("agent", agent.name, agent)}
                >
                  <div className="font-medium text-sm">@{agent.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {agent.description}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {filteredTools.length > 0 && (
          <div>
            {filteredTools.map((tool, index) => {
              const globalIndex = filteredAgents.length + index;
              return (
                <button
                  key={tool.name}
                  type="button"
                  ref={(el) => {
                    itemRefs.current[globalIndex] = el;
                  }}
                  className={cn(
                    "px-2 py-2 cursor-pointer text-left w-full",
                    globalIndex === commands.selectedIndex
                      ? "bg-accent"
                      : "hover:bg-accent/50",
                  )}
                  onClick={() => handleSelect("tool", tool.name, tool)}
                >
                  <div className="font-medium text-sm">{tool.description}</div>
                  <div className="text-xs text-muted-foreground">
                    /{tool.name}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </PopoverContent>
  );
}

// Legacy export for backwards compatibility (palette is now integrated into textarea)
export function PromptCommandsPalette() {
  return null;
}

export function useCommandSelection(): CommandSelection {
  const commands = usePromptCommands();
  return commands.selection;
}

export function useCommandActions() {
  const commands = usePromptCommands();
  return {
    clearPills: commands.clearPills,
    removePill: commands.removePill,
  };
}
