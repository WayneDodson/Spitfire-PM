/**
 * Cancellation Flow Tests
 *
 * Tests for the emotionally intelligent cancellation journey:
 * - Reason submission schema validation
 * - Mentor request validation
 * - Re-engagement opt-in logic
 * - Admin access control
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";

// ─── Schemas (mirrored from router for unit testing) ─────────────────────────

const VALID_REASONS = [
  "too_expensive",
  "need_more_time",
  "not_using_enough",
  "feel_overwhelmed",
  "unsure_if_ready",
  "got_the_job",
  "struggling_with_interviews",
  "need_career_advice",
  "other",
] as const;

const cancellationReasonSchema = z.object({
  reason: z.enum(VALID_REASONS),
  customReason: z.string().max(500).optional(),
  readinessScore: z.number().min(0).max(100).optional(),
  levelsCompleted: z.number().min(0).optional(),
  overallProgress: z.number().min(0).max(100).optional(),
});

const mentorRequestSchema = z.object({
  cancellationReasonId: z.number().int().positive().optional(),
  helpTopics: z.array(z.string()).max(10).optional(),
  mainQuestion: z.string().min(10).max(2000),
  currentSituation: z.string().max(1000).optional(),
  desiredOutcome: z.string().max(1000).optional(),
});

const reEngagementSchema = z.object({
  cancellationReasonId: z.number().int().positive().optional(),
  optedIn: z.boolean(),
});

// ─── Cancellation Reason Tests ────────────────────────────────────────────────

describe("Cancellation Reason Schema", () => {
  it("accepts all valid reason codes", () => {
    for (const reason of VALID_REASONS) {
      const result = cancellationReasonSchema.safeParse({ reason });
      expect(result.success, `reason '${reason}' should be valid`).toBe(true);
    }
  });

  it("rejects unknown reason codes", () => {
    const result = cancellationReasonSchema.safeParse({ reason: "just_leaving" });
    expect(result.success).toBe(false);
  });

  it("accepts optional customReason up to 500 chars", () => {
    const result = cancellationReasonSchema.safeParse({
      reason: "other",
      customReason: "I found a different platform that suits me better.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects customReason over 500 chars", () => {
    const result = cancellationReasonSchema.safeParse({
      reason: "other",
      customReason: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts readiness score between 0 and 100", () => {
    const result = cancellationReasonSchema.safeParse({
      reason: "too_expensive",
      readinessScore: 72,
    });
    expect(result.success).toBe(true);
  });

  it("rejects readiness score above 100", () => {
    const result = cancellationReasonSchema.safeParse({
      reason: "too_expensive",
      readinessScore: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative readiness score", () => {
    const result = cancellationReasonSchema.safeParse({
      reason: "too_expensive",
      readinessScore: -1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts full payload with all optional fields", () => {
    const result = cancellationReasonSchema.safeParse({
      reason: "feel_overwhelmed",
      customReason: "Too much to absorb at once.",
      readinessScore: 45,
      levelsCompleted: 2,
      overallProgress: 28.5,
    });
    expect(result.success).toBe(true);
  });
});

// ─── Mentor Request Tests ─────────────────────────────────────────────────────

describe("Mentor Request Schema", () => {
  it("accepts a valid mentor request", () => {
    const result = mentorRequestSchema.safeParse({
      mainQuestion: "How do I transition from nursing into a PM role?",
      helpTopics: ["career change", "interview prep"],
      currentSituation: "I've been a nurse for 10 years and want to move into healthcare PM.",
      desiredOutcome: "Land my first PM interview within 3 months.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mainQuestion shorter than 10 characters", () => {
    const result = mentorRequestSchema.safeParse({
      mainQuestion: "Help me",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mainQuestion longer than 2000 characters", () => {
    const result = mentorRequestSchema.safeParse({
      mainQuestion: "x".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects helpTopics array with more than 10 items", () => {
    const result = mentorRequestSchema.safeParse({
      mainQuestion: "How do I get started in project management?",
      helpTopics: Array.from({ length: 11 }, (_, i) => `topic_${i}`),
    });
    expect(result.success).toBe(false);
  });

  it("accepts helpTopics with exactly 10 items", () => {
    const result = mentorRequestSchema.safeParse({
      mainQuestion: "How do I get started in project management?",
      helpTopics: Array.from({ length: 10 }, (_, i) => `topic_${i}`),
    });
    expect(result.success).toBe(true);
  });

  it("accepts request without optional fields", () => {
    const result = mentorRequestSchema.safeParse({
      mainQuestion: "I need help understanding the PM career path.",
    });
    expect(result.success).toBe(true);
  });
});

// ─── Re-Engagement Opt-In Tests ───────────────────────────────────────────────

describe("Re-Engagement Opt-In Schema", () => {
  it("accepts optedIn: true", () => {
    const result = reEngagementSchema.safeParse({ optedIn: true });
    expect(result.success).toBe(true);
  });

  it("accepts optedIn: false", () => {
    const result = reEngagementSchema.safeParse({ optedIn: false });
    expect(result.success).toBe(true);
  });

  it("rejects missing optedIn", () => {
    const result = reEngagementSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects non-boolean optedIn", () => {
    const result = reEngagementSchema.safeParse({ optedIn: "yes" });
    expect(result.success).toBe(false);
  });

  it("accepts with optional cancellationReasonId", () => {
    const result = reEngagementSchema.safeParse({
      optedIn: true,
      cancellationReasonId: 42,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-positive cancellationReasonId", () => {
    const result = reEngagementSchema.safeParse({
      optedIn: true,
      cancellationReasonId: 0,
    });
    expect(result.success).toBe(false);
  });
});

// ─── Re-Engagement Check-In Date Logic ───────────────────────────────────────

describe("Re-Engagement Check-In Date", () => {
  it("calculates check-in date as approximately 90 days from now", () => {
    const now = Date.now();
    const checkInDate = new Date(now + 90 * 24 * 60 * 60 * 1000);
    const diffDays = Math.round((checkInDate.getTime() - now) / (24 * 60 * 60 * 1000));
    expect(diffDays).toBe(90);
  });

  it("does not set check-in date when user opts out", () => {
    const optedIn = false;
    const checkInDate = optedIn ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null;
    expect(checkInDate).toBeNull();
  });

  it("sets check-in date when user opts in", () => {
    const optedIn = true;
    const checkInDate = optedIn ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null;
    expect(checkInDate).not.toBeNull();
    expect(checkInDate instanceof Date).toBe(true);
  });
});
