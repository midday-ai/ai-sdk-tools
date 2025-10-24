"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  VoiceButton,
  type VoiceButtonState,
} from "@/components/ui/voice-button";

interface VoiceInputButtonProps {
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  onTranscriptionChange?: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onAudioStreamChange?: (stream: MediaStream | null) => void;
  className?: string;
}

export function VoiceInputButton({
  textareaRef,
  onTranscriptionChange,
  onRecordingStateChange,
  onAudioStreamChange,
  className,
}: VoiceInputButtonProps) {
  const [state, setState] = useState<VoiceButtonState>("idle");
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Notify parent of recording state changes
  useEffect(() => {
    onRecordingStateChange?.(state === "recording");
  }, [state, onRecordingStateChange]);

  // Notify parent of audio stream changes
  useEffect(() => {
    onAudioStreamChange?.(audioStream);
  }, [audioStream, onAudioStreamChange]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      // Try to use a more compatible audio format
      let options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options = { mimeType: "audio/webm;codecs=opus" };
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        options = { mimeType: "audio/webm" };
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        options = { mimeType: "audio/mp4" };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop the audio stream
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        setAudioStream(null);

        // Create audio blob from recorded chunks
        const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        setState("processing");

        try {
          // Send raw audio blob to server (more efficient than base64 in JSON)
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const response = await fetch("/api/transcription", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Transcription API error:", errorData);
            throw new Error(errorData.error || "Transcription failed");
          }

          const { transcription } = await response.json();

          // Add transcription to textarea
          if (textareaRef?.current && transcription) {
            const textarea = textareaRef.current;
            const currentValue = textarea.value;
            const newValue =
              currentValue + (currentValue ? " " : "") + transcription;

            textarea.value = newValue;
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            onTranscriptionChange?.(newValue);

            setState("success");
          } else {
            setState("error");
            toast.error("No transcription received");
          }
        } catch (error) {
          console.error("Transcription error:", error);
          setState("error");
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to transcribe audio",
          );
        }
      };

      mediaRecorder.start();
      setState("recording");
    } catch (error) {
      console.error("Failed to start recording:", error);
      setState("error");
      toast.error("Failed to access microphone");
    }
  }, [textareaRef, onTranscriptionChange]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [state]);

  const handlePress = useCallback(() => {
    if (state === "idle") {
      startRecording();
    } else if (state === "recording") {
      stopRecording();
    }
  }, [state, startRecording, stopRecording]);

  return (
    <VoiceButton
      state={state}
      onPress={handlePress}
      className={className}
      size="icon"
    />
  );
}
