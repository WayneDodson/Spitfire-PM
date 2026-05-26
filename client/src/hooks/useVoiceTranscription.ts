import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export type VoiceState = "idle" | "recording" | "transcribing" | "done" | "error";

interface UseVoiceTranscriptionOptions {
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
}

/** Pick the best supported MIME type for MediaRecorder, or empty string for browser default. */
function pickMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/mp4",
    "", // browser default — always works
  ];
  for (const mime of candidates) {
    if (!mime || MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return "";
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

  /** Tear down any active stream/recorder without throwing. */
  const cleanup = useCallback(() => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (_) { /* ignore */ }
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch (_) { /* ignore */ }
    mediaRecorderRef.current = null;
    streamRef.current = null;
    chunksRef.current = [];
  }, []);

  const reportError = useCallback((code: string) => {
    setErrorMsg(code);
    setState("error");
    onError?.(code);
    if (code !== "permission_denied") {
      setTimeout(() => setState("idle"), 4000);
    }
  }, [onError]);

  const startRecording = useCallback(async () => {
    setErrorMsg(null);
    cleanup();

    // ── 1. Acquire microphone stream ──────────────────────────────────────────
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: unknown) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        reportError("permission_denied");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        reportError("no_device");
      } else if (name === "NotReadableError" || name === "TrackStartError") {
        // Device is in use by another app
        reportError("in_use");
      } else {
        reportError("device_error");
      }
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];

    // ── 2. Create MediaRecorder ───────────────────────────────────────────────
    const mimeType = pickMimeType();
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch (_) {
      // Some browsers reject the mimeType even after isTypeSupported — fall back to default
      try {
        recorder = new MediaRecorder(stream);
      } catch (err2) {
        cleanup();
        console.error("[useVoiceTranscription] MediaRecorder init failed:", err2);
        reportError("device_error");
        return;
      }
    }

    mediaRecorderRef.current = recorder;

    // ── 3. Wire events ────────────────────────────────────────────────────────
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onerror = (e) => {
      console.error("[useVoiceTranscription] MediaRecorder error:", e);
      cleanup();
      reportError("device_error");
    };

    recorder.onstop = () => {
      // Release the mic indicator in the browser
      streamRef.current?.getTracks().forEach((t) => t.stop());

      const effectiveMime = recorder.mimeType || mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: effectiveMime });

      if (blob.size === 0) {
        reportError("empty_recording");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1] ?? "";
        if (!base64) {
          reportError("device_error");
          return;
        }
        setState("transcribing");
        transcribeMutation.mutate({
          audioBase64: base64,
          mimeType: effectiveMime,
        });
      };
      reader.onerror = () => reportError("device_error");
      reader.readAsDataURL(blob);
    };

    // ── 4. Start ──────────────────────────────────────────────────────────────
    try {
      recorder.start(250);
      setState("recording");
    } catch (err) {
      console.error("[useVoiceTranscription] recorder.start() failed:", err);
      cleanup();
      reportError("device_error");
    }
  }, [cleanup, reportError, transcribeMutation]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error("[useVoiceTranscription] recorder.stop() failed:", err);
        cleanup();
        reportError("device_error");
      }
    }
  }, [cleanup, reportError]);

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
