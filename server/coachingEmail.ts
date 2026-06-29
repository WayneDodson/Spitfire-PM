/**
 * Coaching email templates — all 10 notification types.
 * Sender: Spitfire PM Coaching <coaching@spitfire-pm.com>
 * Uses the Resend provider configured via RESEND_API_KEY.
 */
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
// Coaching sender — set COACHING_EMAIL_FROM in your hosting env variables
// Format: "Spitfire PM Coaching <coaching@spitfire-pm.com>"
const FROM_EMAIL =
  process.env.COACHING_EMAIL_FROM ??
  "Spitfire PM Coaching <coaching@spitfire-pm.com>";
// Reply-to for customer emails — defaults to coaching@spitfire-pm.com
const COACHING_REPLY_TO =
  process.env.COACHING_REPLY_TO ??
  "coaching@spitfire-pm.com";
// Admin notification recipient — set ADMIN_EMAIL in your hosting env variables
const ADMIN_EMAIL_DEFAULT =
  process.env.ADMIN_EMAIL ?? "coaching@spitfire-pm.com";
const APP_URL = process.env.APP_URL ?? "https://www.spitfire-pm.com";

function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  return new Resend(RESEND_API_KEY);
}

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log("\n─── [COACHING EMAIL DEV FALLBACK] ──────────────────────────");
    console.log(`To:       ${opts.to}`);
    console.log(`Subject:  ${opts.subject}`);
    console.log(`Reply-To: ${opts.replyTo ?? COACHING_REPLY_TO}`);
    console.log(`Body:\n${opts.text}`);
    console.log("────────────────────────────────────────────────────────────\n");
    return;
  }
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    replyTo: opts.replyTo ?? COACHING_REPLY_TO,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  if (error) {
    console.error("[CoachingEmail] Send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// ── Shared layout helpers ────────────────────────────────────────────────────

function emailHeader(): string {
  return `
  <div style="text-align:center;padding:32px 0 24px;">
    <h1 style="font-size:22px;font-weight:700;color:#0ea5e9;margin:0;letter-spacing:-0.3px;">Spitfire PM</h1>
    <p style="color:#64748b;font-size:13px;margin:4px 0 0;">1-to-1 Project Management Coaching</p>
  </div>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 28px;">`;
}

function emailFooter(): string {
  return `
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:36px 0 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;color:#94a3b8;text-align:center;">
    <tr>
      <td style="padding:0 0 6px;">
        <strong style="color:#64748b;">Spitfire PM</strong> &middot; 1-to-1 Project Management Coaching
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 6px;">
        <a href="${APP_URL}" style="color:#0ea5e9;text-decoration:none;">${APP_URL}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 6px;">
        Email: <a href="mailto:coaching@spitfire-pm.com" style="color:#0ea5e9;text-decoration:none;">coaching@spitfire-pm.com</a>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 0;font-size:11px;color:#cbd5e1;">
        You are receiving this email because you submitted a coaching enquiry or have an active booking with Spitfire PM.<br>
        To update your preferences, reply to this email.
      </td>
    </tr>
  </table>`;
}

function calendarBlock(bookingId: number): string {
  const icsUrl = `${APP_URL}/api/coaching/calendar/${bookingId}.ics`;
  return `
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 12px;font-weight:600;color:#1a1a1a;font-size:15px;">&#128197; Add this session to your calendar</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <a href="${icsUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">&#127822; Apple Calendar</a>
      <a href="${icsUrl}" style="display:inline-block;background:#0369a1;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">&#128231; Outlook (.ics)</a>
    </div>
    <p style="margin:12px 0 0;color:#64748b;font-size:13px;">
      <strong>Google Calendar:</strong> download the .ics file above and import it via Google Calendar &rsaquo; Settings &rsaquo; Import.
      Or visit your <a href="${APP_URL}/my-bookings" style="color:#0ea5e9;">My Bookings</a> page to add it directly.
    </p>
  </div>`;
}

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Spitfire PM</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px 20px 40px;color:#1a1a1a;background:#fff;">
${emailHeader()}${body}${emailFooter()}
</body></html>`;
}

// ── 1. Free assessment request received (to user) ────────────────────────────
export async function sendAssessmentRequestReceived(
  to: string,
  name: string
): Promise<void> {
  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">We have received your assessment request</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">Thank you for requesting a free 20-minute PM Career Assessment with Spitfire PM. We have received your details and will review your request shortly.</p>
  <p style="color:#475569;line-height:1.7;">We aim to respond within <strong>1&ndash;2 working days</strong>. If your request is accepted, we will send you a link to choose a date and time for your call.</p>
  <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin:24px 0;">
    <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">
      <strong>Please note:</strong> This is a 20-minute introductory suitability assessment, not a full coaching session. It does not include CV review, mock interviews or scenario training.
    </p>
  </div>
  <p style="color:#475569;line-height:1.7;">If you have any questions in the meantime, please reply to this email and we will get back to you.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Thank you for requesting a free 20-minute PM Career Assessment with Spitfire PM.

We have received your details and will review your request within 1–2 working days. If accepted, we will send you a link to choose a date and time.

Please note: this is an introductory suitability assessment, not a full coaching session.

If you have any questions, please reply to this email.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: "Your PM Career Assessment request — Spitfire PM",
    html,
    text,
  });
}

// ── 2. Free assessment accepted (to user) ────────────────────────────────────
export async function sendAssessmentAccepted(
  to: string,
  name: string,
  bookingLink?: string,
  bookingId?: number
): Promise<void> {
  const ctaBlock = bookingLink
    ? `<div style="text-align:center;margin:32px 0;">
        <a href="${bookingLink}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">Choose Your Date and Time</a>
       </div>`
    : `<p style="color:#475569;line-height:1.7;">We will be in touch shortly with available dates and times. Once your session is confirmed, you will receive a separate email with calendar links.</p>`;

  const calendarSection = bookingId ? calendarBlock(bookingId) : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Your assessment request has been accepted</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">We are pleased to confirm that your request for a <strong>free 20-minute PM Career Assessment</strong> has been accepted.</p>
  ${ctaBlock}
  ${calendarSection}
  <p style="color:#475569;line-height:1.7;">During the call we will discuss your current experience, the roles you are targeting and how we may be able to support your PM career transition.</p>
  <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin:24px 0;">
    <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">
      <strong>Reminder:</strong> This is a 20-minute introductory assessment call, not a full coaching session.
    </p>
  </div>
  <p style="color:#475569;line-height:1.7;">If you have any questions before the call, please reply to this email.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Your request for a free 20-minute PM Career Assessment has been accepted.

${bookingLink ? `Choose your date and time: ${bookingLink}` : "We will be in touch with available times."}

During the call we will discuss your experience, target roles and how we may be able to support you.

Reminder: this is a 20-minute introductory assessment call, not a full coaching session.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: "Your PM Career Assessment has been accepted — Spitfire PM",
    html,
    text,
  });
}

// ── 3. Free assessment declined (to user) ────────────────────────────────────
export async function sendAssessmentDeclined(
  to: string,
  name: string,
  reason?: string
): Promise<void> {
  const reasonBlock = reason
    ? `<p style="color:#475569;line-height:1.7;">${reason}</p>`
    : `<p style="color:#475569;line-height:1.7;">After reviewing your request, we are not able to accept it at this time. This may be because the session would not be the most suitable option for your current stage, or because our availability is limited.</p>`;

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Regarding your assessment request</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  ${reasonBlock}
  <p style="color:#475569;line-height:1.7;">You can continue to use the Spitfire PM platform to build your knowledge and practical skills at your own pace. If your circumstances change, you are welcome to get in touch again.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Thank you for your interest in our PM Career Assessment.

${reason ?? "After reviewing your request, we are not able to accept it at this time."}

You can continue using the Spitfire PM platform to build your skills. If your circumstances change, please get in touch.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: "Regarding your PM Career Assessment request — Spitfire PM",
    html,
    text,
  });
}

// ── 4. Paid booking confirmation (to user) ───────────────────────────────────
export async function sendPaidBookingConfirmation(
  to: string,
  name: string,
  serviceName: string,
  scheduledAt?: Date,
  meetingLink?: string,
  bookingId?: number
): Promise<void> {
  const dateStr = scheduledAt
    ? scheduledAt.toLocaleString("en-GB", {
        timeZone: "Europe/London",
        dateStyle: "full",
        timeStyle: "short",
      })
    : "To be confirmed";

  const meetingBlock = meetingLink
    ? `<p style="margin:0 0 4px;color:#475569;"><strong>Meeting link:</strong> <a href="${meetingLink}" style="color:#0ea5e9;">${meetingLink}</a></p>`
    : `<p style="margin:0 0 4px;color:#475569;">A meeting link will be sent to you before the session.</p>`;

  const calendarSection = bookingId && scheduledAt ? calendarBlock(bookingId) : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Booking confirmed</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">Your booking for <strong>${serviceName}</strong> has been confirmed and payment received. Thank you.</p>
  <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 8px;font-weight:600;color:#0369a1;font-size:15px;">Session details</p>
    <p style="margin:0 0 4px;color:#475569;"><strong>Service:</strong> ${serviceName}</p>
    <p style="margin:0 0 4px;color:#475569;"><strong>Date and time:</strong> ${dateStr} (London time)</p>
    ${meetingBlock}
  </div>
  ${calendarSection}
  <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin:24px 0;">
    <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">
      <strong>Cancellation and rescheduling:</strong> Sessions may be rescheduled with at least 24 hours' notice. Cancellations with less than 24 hours' notice may not be refunded. Missed appointments are non-refundable.
    </p>
  </div>
  <p style="color:#475569;line-height:1.7;">If you need to reschedule, please reply to this email as soon as possible.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Your booking for ${serviceName} is confirmed.

Date and time: ${dateStr} (London time)
${meetingLink ? `Meeting link: ${meetingLink}` : "A meeting link will be sent before the session."}

Cancellations with less than 24 hours' notice may not be refunded.

If you need to reschedule, please reply to this email as soon as possible.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: `Booking confirmed: ${serviceName} — Spitfire PM`,
    html,
    text,
  });
}

// ── 5. Payment receipt (to user) ─────────────────────────────────────────────
export async function sendPaymentReceipt(
  to: string,
  name: string,
  serviceName: string,
  amountPence: number
): Promise<void> {
  const amount = `£${(amountPence / 100).toFixed(2)}`;

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Payment received</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">We have received your payment of <strong>${amount}</strong> for <strong>${serviceName}</strong>. Thank you.</p>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 4px;color:#166534;font-weight:600;font-size:15px;">Payment summary</p>
    <p style="margin:0 0 4px;color:#166534;"><strong>Amount paid:</strong> ${amount}</p>
    <p style="margin:0;color:#166534;"><strong>Service:</strong> ${serviceName}</p>
  </div>
  <p style="color:#475569;line-height:1.7;">Please keep this email as your payment record. If you have any questions about your booking, please reply to this email.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Payment of ${amount} received for ${serviceName}. Thank you.

Please keep this email as your payment record.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: `Payment received: ${serviceName} — Spitfire PM`,
    html,
    text,
  });
}

// ── 6. 24-hour reminder (to user) ────────────────────────────────────────────
export async function send24hReminder(
  to: string,
  name: string,
  serviceName: string,
  scheduledAt: Date,
  meetingLink?: string
): Promise<void> {
  const dateStr = scheduledAt.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    dateStyle: "full",
    timeStyle: "short",
  });
  const meetingBlock = meetingLink
    ? `<p style="margin:0 0 4px;color:#92400e;"><strong>Meeting link:</strong> <a href="${meetingLink}" style="color:#0ea5e9;">${meetingLink}</a></p>`
    : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Your session is tomorrow</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">This is a reminder that your <strong>${serviceName}</strong> session is scheduled for tomorrow.</p>
  <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 8px;font-weight:600;color:#92400e;font-size:15px;">Session details</p>
    <p style="margin:0 0 4px;color:#92400e;"><strong>Date and time:</strong> ${dateStr} (London time)</p>
    ${meetingBlock}
  </div>
  <p style="color:#475569;line-height:1.7;">If you need to reschedule, please reply to this email <strong>as soon as possible</strong>. Cancellations with less than 24 hours' notice may not be refunded.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Reminder: your ${serviceName} session is tomorrow.

Date and time: ${dateStr} (London time)
${meetingLink ? `Meeting link: ${meetingLink}` : ""}

If you need to reschedule, please reply as soon as possible.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: "Reminder: your session is tomorrow — Spitfire PM",
    html,
    text,
  });
}

// ── 7. 1-hour reminder (to user) ─────────────────────────────────────────────
export async function send1hReminder(
  to: string,
  name: string,
  serviceName: string,
  scheduledAt: Date,
  meetingLink?: string
): Promise<void> {
  const dateStr = scheduledAt.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    timeStyle: "short",
  });
  const meetingBlock = meetingLink
    ? `<div style="text-align:center;margin:32px 0;">
        <a href="${meetingLink}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">Join Your Session Now</a>
       </div>`
    : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Your session starts in 1 hour</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">Your <strong>${serviceName}</strong> session starts at <strong>${dateStr}</strong> (London time) &mdash; that is in approximately 1 hour.</p>
  ${meetingBlock}
  <p style="color:#475569;line-height:1.7;">If you are unable to attend, please reply to this email immediately.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Your ${serviceName} session starts in 1 hour at ${dateStr} (London time).

${meetingLink ? `Join here: ${meetingLink}` : ""}

If you are unable to attend, please reply immediately.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: "Your session starts in 1 hour — Spitfire PM",
    html,
    text,
  });
}

// ── 8. Reschedule confirmation (to user) ─────────────────────────────────────
export async function sendRescheduleConfirmation(
  to: string,
  name: string,
  serviceName: string,
  newScheduledAt: Date,
  meetingLink?: string,
  bookingId?: number
): Promise<void> {
  const dateStr = newScheduledAt.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    dateStyle: "full",
    timeStyle: "short",
  });
  const meetingBlock = meetingLink
    ? `<p style="margin:0 0 4px;color:#0369a1;"><strong>Meeting link:</strong> <a href="${meetingLink}" style="color:#0ea5e9;">${meetingLink}</a></p>`
    : `<p style="margin:0 0 4px;color:#0369a1;">A meeting link will be sent before the session.</p>`;

  const calendarSection = bookingId ? calendarBlock(bookingId) : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Your session has been rescheduled</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">Your <strong>${serviceName}</strong> session has been rescheduled to the new date and time below.</p>
  <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 8px;font-weight:600;color:#0369a1;font-size:15px;">New session details</p>
    <p style="margin:0 0 4px;color:#0369a1;"><strong>Date and time:</strong> ${dateStr} (London time)</p>
    ${meetingBlock}
  </div>
  ${calendarSection}
  <p style="color:#475569;line-height:1.7;">If this time does not work for you, please reply to this email as soon as possible.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Your ${serviceName} session has been rescheduled.

New date and time: ${dateStr} (London time)
${meetingLink ? `Meeting link: ${meetingLink}` : "A meeting link will be sent before the session."}

If this time does not work for you, please reply as soon as possible.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: `Session rescheduled: ${serviceName} — Spitfire PM`,
    html,
    text,
  });
}

// ── 9. Cancellation confirmation (to user) ───────────────────────────────────
export async function sendCancellationConfirmation(
  to: string,
  name: string,
  serviceName: string,
  refundNote?: string
): Promise<void> {
  const refundBlock = refundNote
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin:24px 0;">
        <p style="margin:0;color:#991b1b;font-size:14px;line-height:1.6;"><strong>Regarding your payment:</strong> ${refundNote}</p>
       </div>`
    : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Session cancellation confirmed</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">Your <strong>${serviceName}</strong> session has been cancelled.</p>
  ${refundBlock}
  <p style="color:#475569;line-height:1.7;">If you would like to rebook in the future, please visit <a href="${APP_URL}/one-to-one-coaching" style="color:#0ea5e9;">our coaching page</a> or reply to this email.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Your ${serviceName} session has been cancelled.

${refundNote ? `Regarding your payment: ${refundNote}\n\n` : ""}To rebook in the future: ${APP_URL}/one-to-one-coaching

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: `Session cancelled: ${serviceName} — Spitfire PM`,
    html,
    text,
  });
}

// ── 10. Follow-up after session (to user) ────────────────────────────────────
export async function sendSessionFollowUp(
  to: string,
  name: string,
  serviceName: string
): Promise<void> {
  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;color:#0f172a;">Thank you for your session</h2>
  <p style="color:#475569;line-height:1.7;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.7;">Thank you for taking part in your <strong>${serviceName}</strong> session. We hope it was useful and gave you a clearer picture of your next steps.</p>
  <p style="color:#475569;line-height:1.7;">If you would like to continue working together, we offer further individual sessions and structured coaching packages. There is no pressure &mdash; simply get in touch when you feel the time is right.</p>
  <div style="text-align:center;margin:32px 0;">
    <a href="${APP_URL}/one-to-one-coaching" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">View Coaching Options</a>
  </div>
  <p style="color:#475569;line-height:1.7;">You can also continue building your PM knowledge and practical skills on the Spitfire PM platform at any time.</p>
  <p style="color:#475569;line-height:1.7;">Thank you again, and best of luck with your project management journey.</p>
  <p style="color:#475569;line-height:1.7;">Kind regards,<br><strong>The Spitfire PM Team</strong></p>`);

  const text = `Hi ${name},

Thank you for your ${serviceName} session. We hope it was useful.

If you would like to continue, we offer further sessions and coaching packages — no pressure, just get in touch when the time is right.

View options: ${APP_URL}/one-to-one-coaching

Thank you again, and best of luck with your PM journey.

Kind regards,
The Spitfire PM Team
coaching@spitfire-pm.com
${APP_URL}`;

  await sendEmail({
    to,
    subject: "Thank you for your session — Spitfire PM",
    html,
    text,
  });
}

// ── Admin: new booking notification ─────────────────────────────────────────
export async function sendAdminBookingNotification(
  adminEmail: string,
  booking: {
    fullName: string;
    email: string;
    phone?: string | null;
    serviceName: string;
    jobTitle: string;
    industry: string;
    country?: string | null;
    timezone?: string | null;
    qualifications?: string | null;
    targetRole?: string | null;
    pmExperience?: string | null;
    mainChallenge: string;
    supportNeeds?: string | null;
    timeline: string;
    interestedInPaid: boolean;
    preferredDays?: string | null;
    preferredTimes?: string | null;
    bookingId: number;
  }
): Promise<void> {
  const adminUrl = `${APP_URL}/admin/coaching`;

  const row = (label: string, value: string | null | undefined) =>
    value
      ? `<tr><td style="padding:6px 0;vertical-align:top;width:160px;color:#64748b;font-size:14px;">${label}</td><td style="padding:6px 0;vertical-align:top;color:#1a1a1a;font-size:14px;">${value}</td></tr>`
      : "";

  const longRow = (label: string, value: string | null | undefined) =>
    value
      ? `<div style="margin:16px 0;">
          <p style="margin:0 0 4px;font-weight:600;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
          <p style="margin:0;color:#1a1a1a;font-size:14px;line-height:1.7;white-space:pre-wrap;">${value}</p>
         </div>`
      : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:4px;color:#0f172a;">New coaching request #${booking.bookingId}</h2>
  <p style="color:#64748b;font-size:14px;margin:0 0 24px;">Submitted via ${APP_URL}</p>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
    <p style="margin:0 0 12px;font-weight:600;color:#0f172a;font-size:15px;">Contact details</p>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", booking.fullName)}
      ${row("Email", `<a href="mailto:${booking.email}" style="color:#0ea5e9;">${booking.email}</a>`)}
      ${row("Phone", booking.phone)}
      ${row("Job title", booking.jobTitle)}
      ${row("Industry", booking.industry)}
      ${row("Country", booking.country)}
      ${row("Timezone", booking.timezone)}
    </table>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
    <p style="margin:0 0 12px;font-weight:600;color:#0f172a;font-size:15px;">Background &amp; goals</p>
    <table style="width:100%;border-collapse:collapse;">
      ${row("Service", booking.serviceName)}
      ${row("Qualifications", booking.qualifications)}
      ${row("Target role", booking.targetRole)}
      ${row("Timeline", booking.timeline)}
      ${row("Interested in paid", booking.interestedInPaid ? "Yes" : "No")}
      ${row("Preferred days", booking.preferredDays)}
      ${row("Preferred times", booking.preferredTimes)}
    </table>
    ${longRow("PM experience", booking.pmExperience)}
    ${longRow("Main challenge", booking.mainChallenge)}
    ${longRow("What they want help with", booking.supportNeeds)}
  </div>

  <div style="text-align:center;margin:32px 0;">
    <a href="${adminUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">Review in Admin Dashboard</a>
  </div>`);

  const text = `New coaching request #${booking.bookingId}

Name: ${booking.fullName}
Email: ${booking.email}
Phone: ${booking.phone ?? "—"}
Job title: ${booking.jobTitle}
Industry: ${booking.industry}
Country: ${booking.country ?? "—"}
Timezone: ${booking.timezone ?? "—"}
Service: ${booking.serviceName}
Qualifications: ${booking.qualifications ?? "—"}
Target role: ${booking.targetRole ?? "—"}
Timeline: ${booking.timeline}
Interested in paid: ${booking.interestedInPaid ? "Yes" : "No"}
Preferred days: ${booking.preferredDays ?? "—"}
Preferred times: ${booking.preferredTimes ?? "—"}

PM experience:
${booking.pmExperience ?? "—"}

Main challenge:
${booking.mainChallenge}

What they want help with:
${booking.supportNeeds ?? "—"}

Review: ${adminUrl}`;

  await sendEmail({
    to: adminEmail,
    subject: `New coaching request: ${booking.fullName} (#${booking.bookingId}) — Spitfire PM`,
    html,
    text,
    // Reply-to the applicant so admin can respond directly
    replyTo: booking.email,
  });
}
