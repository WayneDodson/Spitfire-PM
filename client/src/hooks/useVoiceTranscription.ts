import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export type VoiceState = "idle" | "recording" | "transcribing" | "done" | "error";

interface UseVoiceTranscriptionOptions {
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
}

export function useVoiceTranscription({ onTranscript, onError }: UseVoiceTranscriptionOptions) {
  const [state, setState] = useState<VoiceState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const transcribeMutation = trpc.simulations.transcribeAudio.useMutation({
    onSuccess: (data: { text: string }) => {
      onTranscript(data.text);
      setState("done");
      setTimeout(() => setState("idle"), 1500);
    },
    onError: (err: { message?: string }) => {
      const msg = err.message ?? "Transcription failed. Please try again.";
      setErrorMsg(msg);
      setState("error");
      onError?.(msg);
      setTimeout(() => setState("idle"), 3000);
    },
  });

  const startRecording = useCallback(async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      // Prefer webm/opus; fall back to whatever the browser supports
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        // Stop all tracks so the browser mic indicator disappears
        streamRef.current?.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });

        // Convert to base64 to send over tRPC JSON
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(",")[1] ?? "";
          setState("transcribing");
          transcribeMutation.mutate({
            audioBase64: base64,
            mimeType: mimeType || "audio/webm",
          });
        };
        reader.readAsDataURL(blob);
      };

      recorder.start(250); // collect data every 250 ms
      setState("recording");
    } catch (err: unknown) {
      const isDomException = err instanceof DOMException;
      const isPermissionDenied = isDomException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      const isNotFound = isDomException && (err.name === "NotFoundError" || err.name === "DevicesNotFoundError");
      const msg = isPermissionDenied
        ? "permission_denied"
        : isNotFound
        ? "no_device"
        : "device_error";
      setErrorMsg(msg);
      setState("error");
      onError?.(msg);
      // Only auto-clear non-permission errors — permission errors stay visible until user acts
      if (!isPermissionDenied) {
        setTimeout(() => setState("idle"), 4000);
      }
    }
  }, [transcribeMutation, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (state === "recording") {
      stopRecording();
    } else if (state === "idle" || state === "done" || state === "error") {
      setErrorMsg(null);
      startRecording();
    }
  }, [state, startRecording, stopRecording]);

  return { state, errorMsg, toggleRecording, startRecording, stopRecording };
}
