/**
 * calendarUtils.ts
 * Pure helpers for generating calendar event data.
 * No database dependency — accepts plain values, returns strings.
 */

export interface CalendarEventParams {
  title: string;
  description: string;
  location?: string;
  startUtc: Date;
  /** Duration in minutes */
  durationMinutes: number;
  /** Unique identifier for the event (used in ICS UID field) */
  uid: string;
  /** Organiser email shown in ICS */
  organiserEmail?: string;
  /** Optional meeting link — appended to description and used as URL */
  meetingLink?: string;
}

// ── ICS timestamp format: 20250101T120000Z ────────────────────────────────────
function toIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

// ── Escape ICS text values per RFC 5545 ──────────────────────────────────────
function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// ── Fold long ICS lines at 75 octets (RFC 5545 §3.1) ─────────────────────────
function foldLine(line: string): string {
  const MAX = 75;
  if (line.length <= MAX) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    chunks.push((i === 0 ? "" : " ") + line.slice(i, i + (i === 0 ? MAX : MAX - 1)));
    i += i === 0 ? MAX : MAX - 1;
  }
  return chunks.join("\r\n");
}

/**
 * Generate a standards-compliant ICS file string (RFC 5545).
 * Compatible with Apple Calendar, Google Calendar (import), and Outlook.
 */
export function generateIcs(params: CalendarEventParams): string {
  const endUtc = new Date(params.startUtc.getTime() + params.durationMinutes * 60 * 1000);
  const now = new Date();

  const descriptionParts = [params.description];
  if (params.meetingLink) {
    descriptionParts.push(`\nJoin meeting: ${params.meetingLink}`);
  }
  const fullDescription = descriptionParts.join("");

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Spitfire PM//Coaching Session//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    foldLine(`UID:${escapeIcs(params.uid)}`),
    foldLine(`DTSTAMP:${toIcsDate(now)}`),
    foldLine(`DTSTART:${toIcsDate(params.startUtc)}`),
    foldLine(`DTEND:${toIcsDate(endUtc)}`),
    foldLine(`SUMMARY:${escapeIcs(params.title)}`),
    foldLine(`DESCRIPTION:${escapeIcs(fullDescription)}`),
  ];

  if (params.location) {
    lines.push(foldLine(`LOCATION:${escapeIcs(params.location)}`));
  }
  if (params.meetingLink) {
    lines.push(foldLine(`URL:${params.meetingLink}`));
  }
  if (params.organiserEmail) {
    lines.push(foldLine(`ORGANIZER;CN=Spitfire PM:mailto:${params.organiserEmail}`));
  }

  lines.push("STATUS:CONFIRMED");
  lines.push("TRANSP:OPAQUE");
  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

/**
 * Build a Google Calendar "add event" URL.
 * Opens directly in the browser — no download required.
 */
export function buildGoogleCalendarUrl(params: CalendarEventParams): string {
  const endUtc = new Date(params.startUtc.getTime() + params.durationMinutes * 60 * 1000);

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");

  const descriptionParts = [params.description];
  if (params.meetingLink) {
    descriptionParts.push(`\n\nJoin meeting: ${params.meetingLink}`);
  }

  const qp = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates: `${fmt(params.startUtc)}/${fmt(endUtc)}`,
    details: descriptionParts.join(""),
    ...(params.location ? { location: params.location } : {}),
  });

  return `https://calendar.google.com/calendar/render?${qp.toString()}`;
}

/**
 * Build an Outlook Web "add event" URL.
 */
export function buildOutlookUrl(params: CalendarEventParams): string {
  const endUtc = new Date(params.startUtc.getTime() + params.durationMinutes * 60 * 1000);

  const descriptionParts = [params.description];
  if (params.meetingLink) {
    descriptionParts.push(`\n\nJoin meeting: ${params.meetingLink}`);
  }

  const qp = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: params.title,
    startdt: params.startUtc.toISOString(),
    enddt: endUtc.toISOString(),
    body: descriptionParts.join(""),
    ...(params.location ? { location: params.location } : {}),
  });

  return `https://outlook.live.com/calendar/0/action/compose?${qp.toString()}`;
}
