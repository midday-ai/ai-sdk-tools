"use client";

import { CheckIcon, Loader2Icon, MicIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LiveWaveform } from "./live-waveform";

export type VoiceButtonState =
  | "idle"
  | "recording"
  | "processing"
  | "success"
  | "error";

export interface VoiceButtonProps
  extends Omit<ButtonProps, "onClick" | "children"> {
  state?: VoiceButtonState;
  onPress?: () => void;
  label?: React.ReactNode;
  trailing?: React.ReactNode;
  icon?: React.ReactNode;
  waveformClassName?: string;
  feedbackDuration?: number;
  audioStream?: MediaStream | null;
}

export const VoiceButton = React.forwardRef<
  HTMLButtonElement,
  VoiceButtonProps
>(
  (
    {
      state = "idle",
      onPress,
      label,
      trailing,
      icon,
      variant = "outline",
      size = "default",
      className,
      waveformClassName,
      feedbackDuration = 1500,
      audioStream,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalState, setInternalState] =
      React.useState<VoiceButtonState>(state);

    // Sync internal state with prop
    React.useEffect(() => {
      setInternalState(state);
    }, [state]);

    // Auto-transition from success/error back to idle
    React.useEffect(() => {
      if (internalState === "success" || internalState === "error") {
        const timeout = setTimeout(() => {
          setInternalState("idle");
        }, feedbackDuration);
        return () => clearTimeout(timeout);
      }
    }, [internalState, feedbackDuration]);

    const getStateIcon = () => {
      switch (internalState) {
        case "idle":
          return icon || <MicIcon className="size-4" />;
        case "recording":
          return (
            <LiveWaveform
              className={cn("text-current", waveformClassName)}
              audioStream={audioStream}
            />
          );
        case "processing":
          return <Loader2Icon className="size-4 animate-spin" />;
        case "success":
          return <CheckIcon className="size-4" />;
        case "error":
          return <XIcon className="size-4" />;
      }
    };

    const isIconButton = size === "icon" && !label && !trailing;

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        className={cn(
          "transition-all",
          internalState === "recording" && "bg-accent text-accent-foreground",
          internalState === "success" && "bg-green-100 dark:bg-green-900/20",
          internalState === "error" && "bg-red-100 dark:bg-red-900/20",
          className,
        )}
        onClick={onPress}
        disabled={disabled || internalState === "processing"}
        aria-label={isIconButton ? `Voice input - ${internalState}` : undefined}
        {...props}
      >
        {isIconButton ? (
          getStateIcon()
        ) : (
          <>
            {label && <span className="flex-1 text-left">{label}</span>}
            <span className="flex items-center justify-center">
              {getStateIcon()}
            </span>
            {trailing && (
              <span className="text-muted-foreground text-xs opacity-70">
                {trailing}
              </span>
            )}
          </>
        )}
      </Button>
    );
  },
);

VoiceButton.displayName = "VoiceButton";
