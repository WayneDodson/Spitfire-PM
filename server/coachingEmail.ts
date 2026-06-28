/**
 * Coaching email templates — all 10 notification types.
 * Uses the same Resend provider as server/email.ts.
 */
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Spitfire PM <support@spitfireitsolutions.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "support@spitfireitsolutions.com";
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
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log("\n─── [COACHING EMAIL DEV FALLBACK] ──────────────────────────");
    console.log(`To:      ${opts.to}`);
    console.log(`Subject: ${opts.subject}`);
    console.log(`Body:    ${opts.text}`);
    console.log("────────────────────────────────────────────────────────────\n");
    return;
  }
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    replyTo: REPLY_TO,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  if (error) {
    console.error("[CoachingEmail] Send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

function emailHeader(): string {
  return `
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="font-size:24px;font-weight:700;color:#0ea5e9;margin:0;">Spitfire PM</h1>
    <p style="color:#64748b;margin:4px 0 0;">1-to-1 Project Management Coaching</p>
  </div>`;
}

function emailFooter(): string {
  return `
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;">
  <p style="color:#94a3b8;font-size:12px;text-align:center;line-height:1.8;">
    Spitfire PM &middot; <a href="${APP_URL}" style="color:#0ea5e9;">${APP_URL}</a><br>
    Questions? Reply to this email or contact us at
    <a href="mailto:support@spitfireitsolutions.com" style="color:#0ea5e9;">support@spitfireitsolutions.com</a>
  </p>`;
}

// ── Calendar link block helper ───────────────────────────────────────────────
function calendarBlock(bookingId: number): string {
  const googleUrl = `${APP_URL}/api/coaching/calendar/${bookingId}-google`; // placeholder — real URL built server-side
  const icsUrl = `${APP_URL}/api/coaching/calendar/${bookingId}.ics`;
  return `
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 12px;font-weight:600;color:#1a1a1a;">&#128197; Add to your calendar</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <a href="${icsUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">&#127822; Apple Calendar</a>
      <a href="${icsUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">&#128231; Outlook (.ics)</a>
    </div>
    <p style="margin:12px 0 0;color:#64748b;font-size:13px;">Google Calendar users: open the .ics file and choose &ldquo;Add to Calendar&rdquo; when prompted, or import it manually from Google Calendar settings.</p>
  </div>`;
}

function wrap(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#1a1a1a;background:#fff;">
${emailHeader()}${body}${emailFooter()}
</body></html>`;
}

// ── 1. Free assessment request received (to user) ─────────────────────────────
export async function sendAssessmentRequestReceived(
  to: string,
  name: string
): Promise<void> {
  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">We have received your request</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">Thank you for requesting a free 20-minute PM Career Assessment with Spitfire PM. We have received your details and will review your request shortly.</p>
  <p style="color:#475569;line-height:1.6;">We aim to respond within 1–2 working days. If your request is accepted, we will send you a link to choose a date and time for your call.</p>
  <p style="color:#94a3b8;font-size:14px;line-height:1.6;"><strong>Please note:</strong> This is an introductory suitability assessment, not a full coaching session. It does not include CV review, mock interviews or scenario training.</p>
  <p style="color:#475569;line-height:1.6;">If you have any questions in the meantime, please reply to this email.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nThank you for requesting a free PM Career Assessment. We have received your details and will review your request within 1–2 working days.\n\nPlease note: this is an introductory suitability assessment, not a full coaching session.\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: "Your PM Career Assessment request — Spitfire PM", html, text });
}

// ── 2. Free assessment accepted (to user) ─────────────────────────────────────
export async function sendAssessmentAccepted(
  to: string,
  name: string,
  bookingLink?: string
): Promise<void> {
  const ctaBlock = bookingLink
    ? `<div style="text-align:center;margin:32px 0;"><a href="${bookingLink}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">Choose Your Date and Time</a></div>`
    : `<p style="color:#475569;line-height:1.6;">We will be in touch shortly with available dates and times. Once your session is confirmed, you will receive a separate email with calendar links.</p>`;

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Your assessment has been accepted</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">We are pleased to confirm that your request for a free 20-minute PM Career Assessment has been accepted.</p>
  ${ctaBlock}
  <p style="color:#475569;line-height:1.6;">During the call we will discuss your current experience, the roles you are targeting and how we may be able to support you.</p>
  <p style="color:#94a3b8;font-size:14px;line-height:1.6;"><strong>Reminder:</strong> This is an introductory assessment call, not a full coaching session.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nYour request for a free PM Career Assessment has been accepted.\n\n${bookingLink ? `Choose your date and time: ${bookingLink}` : "We will be in touch with available times."}\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: "Your PM Career Assessment has been accepted — Spitfire PM", html, text });
}

// ── 3. Free assessment declined (to user) ─────────────────────────────────────
export async function sendAssessmentDeclined(
  to: string,
  name: string,
  reason?: string
): Promise<void> {
  const reasonBlock = reason
    ? `<p style="color:#475569;line-height:1.6;">${reason}</p>`
    : `<p style="color:#475569;line-height:1.6;">Unfortunately, we are not able to accept your request at this time. This may be because the session would not be the most suitable option for your current stage, or because our availability is limited.</p>`;

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Regarding your assessment request</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  ${reasonBlock}
  <p style="color:#475569;line-height:1.6;">You can continue to use the Spitfire PM platform to build your knowledge and practical skills. If your circumstances change, you are welcome to get in touch again.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nThank you for your interest in our PM Career Assessment. Unfortunately, we are not able to accept your request at this time.\n\nYou can continue using the Spitfire PM platform to build your skills.\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: "Regarding your PM Career Assessment request — Spitfire PM", html, text });
}

// ── 4. Paid booking confirmation (to user) ────────────────────────────────────
export async function sendPaidBookingConfirmation(
  to: string,
  name: string,
  serviceName: string,
  scheduledAt?: Date,
  meetingLink?: string,
  bookingId?: number
): Promise<void> {
  const dateStr = scheduledAt
    ? scheduledAt.toLocaleString("en-GB", { timeZone: "Europe/London", dateStyle: "full", timeStyle: "short" })
    : "To be confirmed";

  const meetingBlock = meetingLink
    ? `<p style="color:#475569;line-height:1.6;"><strong>Meeting link:</strong> <a href="${meetingLink}" style="color:#0ea5e9;">${meetingLink}</a></p>`
    : `<p style="color:#475569;line-height:1.6;">A meeting link will be sent to you before the session.</p>`;

  const calendarSection = bookingId && scheduledAt ? calendarBlock(bookingId) : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Booking confirmed</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">Your booking for <strong>${serviceName}</strong> has been confirmed and payment received. Thank you.</p>
  <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 8px;font-weight:600;color:#0369a1;">Session details</p>
    <p style="margin:0 0 4px;color:#475569;"><strong>Service:</strong> ${serviceName}</p>
    <p style="margin:0 0 4px;color:#475569;"><strong>Date and time:</strong> ${dateStr} (London time)</p>
    ${meetingBlock}
  </div>
  ${calendarSection}
  <p style="color:#475569;line-height:1.6;"><strong>Cancellation and rescheduling:</strong> Sessions may be rescheduled with at least 24 hours' notice. Cancellations with less than 24 hours' notice may not be refunded. Missed appointments are non-refundable.</p>
  <p style="color:#475569;line-height:1.6;">If you need to reschedule, please reply to this email as soon as possible.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nYour booking for ${serviceName} is confirmed.\n\nDate and time: ${dateStr} (London time)\n${meetingLink ? `Meeting link: ${meetingLink}` : "A meeting link will be sent before the session."}\n\nCancellations with less than 24 hours' notice may not be refunded.\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: `Booking confirmed: ${serviceName} — Spitfire PM`, html, text });
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
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Payment received</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">We have received your payment of <strong>${amount}</strong> for <strong>${serviceName}</strong>.</p>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 4px;color:#166534;"><strong>Amount paid:</strong> ${amount}</p>
    <p style="margin:0;color:#166534;"><strong>Service:</strong> ${serviceName}</p>
  </div>
  <p style="color:#475569;line-height:1.6;">Please keep this email as your payment record. If you have any questions about your booking, please reply to this email.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nPayment of ${amount} received for ${serviceName}.\n\nPlease keep this email as your payment record.\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: `Payment received: ${serviceName} — Spitfire PM`, html, text });
}

// ── 6. 24-hour reminder (to user) ─────────────────────────────────────────────
export async function send24hReminder(
  to: string,
  name: string,
  serviceName: string,
  scheduledAt: Date,
  meetingLink?: string
): Promise<void> {
  const dateStr = scheduledAt.toLocaleString("en-GB", { timeZone: "Europe/London", dateStyle: "full", timeStyle: "short" });
  const meetingBlock = meetingLink
    ? `<p style="color:#475569;line-height:1.6;"><strong>Meeting link:</strong> <a href="${meetingLink}" style="color:#0ea5e9;">${meetingLink}</a></p>`
    : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Your session is tomorrow</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">This is a reminder that your <strong>${serviceName}</strong> session is scheduled for tomorrow.</p>
  <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 4px;color:#92400e;"><strong>Date and time:</strong> ${dateStr} (London time)</p>
    ${meetingBlock}
  </div>
  <p style="color:#475569;line-height:1.6;">If you need to reschedule, please reply to this email <strong>as soon as possible</strong>. Cancellations with less than 24 hours' notice may not be refunded.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nReminder: your ${serviceName} session is tomorrow.\n\nDate and time: ${dateStr} (London time)\n${meetingLink ? `Meeting link: ${meetingLink}` : ""}\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: `Reminder: your session is tomorrow — Spitfire PM`, html, text });
}

// ── 7. 1-hour reminder (to user) ──────────────────────────────────────────────
export async function send1hReminder(
  to: string,
  name: string,
  serviceName: string,
  scheduledAt: Date,
  meetingLink?: string
): Promise<void> {
  const dateStr = scheduledAt.toLocaleString("en-GB", { timeZone: "Europe/London", timeStyle: "short" });
  const meetingBlock = meetingLink
    ? `<div style="text-align:center;margin:32px 0;"><a href="${meetingLink}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">Join Your Session</a></div>`
    : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Your session starts in 1 hour</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">Your <strong>${serviceName}</strong> session starts at <strong>${dateStr}</strong> (London time) — that is in approximately 1 hour.</p>
  ${meetingBlock}
  <p style="color:#475569;line-height:1.6;">If you are unable to attend, please reply to this email immediately.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nYour ${serviceName} session starts in 1 hour at ${dateStr} (London time).\n\n${meetingLink ? `Join here: ${meetingLink}` : ""}\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: `Your session starts in 1 hour — Spitfire PM`, html, text });
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
  const dateStr = newScheduledAt.toLocaleString("en-GB", { timeZone: "Europe/London", dateStyle: "full", timeStyle: "short" });
  const meetingBlock = meetingLink
    ? `<p style="color:#475569;line-height:1.6;"><strong>Meeting link:</strong> <a href="${meetingLink}" style="color:#0ea5e9;">${meetingLink}</a></p>`
    : `<p style="color:#475569;line-height:1.6;">A meeting link will be sent before the session.</p>`;

  const calendarSection = bookingId ? calendarBlock(bookingId) : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Your session has been rescheduled</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">Your <strong>${serviceName}</strong> session has been rescheduled.</p>
  <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 4px;color:#0369a1;"><strong>New date and time:</strong> ${dateStr} (London time)</p>
    ${meetingBlock}
  </div>
  ${calendarSection}
  <p style="color:#475569;line-height:1.6;">If this time does not work for you, please reply to this email as soon as possible.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nYour ${serviceName} session has been rescheduled to ${dateStr} (London time).\n\n${meetingLink ? `Meeting link: ${meetingLink}` : ""}\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: `Session rescheduled: ${serviceName} — Spitfire PM`, html, text });
}

// ── 9. Cancellation confirmation (to user) ────────────────────────────────────
export async function sendCancellationConfirmation(
  to: string,
  name: string,
  serviceName: string,
  refundNote?: string
): Promise<void> {
  const refundBlock = refundNote
    ? `<p style="color:#475569;line-height:1.6;"><strong>Regarding your payment:</strong> ${refundNote}</p>`
    : "";

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Session cancellation confirmed</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">Your <strong>${serviceName}</strong> session has been cancelled.</p>
  ${refundBlock}
  <p style="color:#475569;line-height:1.6;">If you would like to rebook in the future, please visit <a href="${APP_URL}/one-to-one-coaching" style="color:#0ea5e9;">our coaching page</a> or reply to this email.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nYour ${serviceName} session has been cancelled.\n\n${refundNote ?? ""}\n\nTo rebook: ${APP_URL}/one-to-one-coaching\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: `Session cancelled: ${serviceName} — Spitfire PM`, html, text });
}

// ── 10. Follow-up after session (to user) ─────────────────────────────────────
export async function sendSessionFollowUp(
  to: string,
  name: string,
  serviceName: string
): Promise<void> {
  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">Thank you for your session</h2>
  <p style="color:#475569;line-height:1.6;">Hi ${name},</p>
  <p style="color:#475569;line-height:1.6;">Thank you for taking part in your <strong>${serviceName}</strong> session. We hope it was useful and gave you a clearer picture of your next steps.</p>
  <p style="color:#475569;line-height:1.6;">If you would like to continue working together, we offer further individual sessions and structured coaching packages. There is no pressure — simply get in touch if you feel the time is right.</p>
  <div style="text-align:center;margin:32px 0;">
    <a href="${APP_URL}/one-to-one-coaching" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">View Coaching Options</a>
  </div>
  <p style="color:#475569;line-height:1.6;">You can also continue building your PM knowledge and practical skills on the Spitfire PM platform at any time.</p>
  <p style="color:#475569;line-height:1.6;">Thank you again, and best of luck with your project management journey.</p>
  <p style="color:#475569;line-height:1.6;">— The Spitfire PM Team</p>`);

  const text = `Hi ${name},\n\nThank you for your ${serviceName} session. We hope it was useful.\n\nIf you would like to continue, we offer further sessions and coaching packages — no pressure, just get in touch when the time is right.\n\nView options: ${APP_URL}/one-to-one-coaching\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: `Thank you for your session — Spitfire PM`, html, text });
}

// ── Admin notification: new booking received ─────────────────────────────────
export async function sendAdminBookingNotification(
  adminEmail: string,
  booking: {
    fullName: string;
    email: string;
    serviceName: string;
    jobTitle: string;
    industry: string;
    mainChallenge: string;
    timeline: string;
    interestedInPaid: boolean;
    bookingId: number;
  }
): Promise<void> {
  const adminUrl = `${APP_URL}/admin/coaching`;

  const html = wrap(`
  <h2 style="font-size:20px;font-weight:600;margin-bottom:8px;">New coaching booking received</h2>
  <p style="color:#475569;line-height:1.6;">A new booking request has been submitted.</p>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:24px 0;">
    <p style="margin:0 0 6px;"><strong>Name:</strong> ${booking.fullName}</p>
    <p style="margin:0 0 6px;"><strong>Email:</strong> ${booking.email}</p>
    <p style="margin:0 0 6px;"><strong>Service:</strong> ${booking.serviceName}</p>
    <p style="margin:0 0 6px;"><strong>Job title:</strong> ${booking.jobTitle}</p>
    <p style="margin:0 0 6px;"><strong>Industry:</strong> ${booking.industry}</p>
    <p style="margin:0 0 6px;"><strong>Main challenge:</strong> ${booking.mainChallenge}</p>
    <p style="margin:0 0 6px;"><strong>Timeline:</strong> ${booking.timeline}</p>
    <p style="margin:0;"><strong>Interested in paid coaching:</strong> ${booking.interestedInPaid ? "Yes" : "No"}</p>
  </div>
  <div style="text-align:center;margin:32px 0;">
    <a href="${adminUrl}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">View in Admin Dashboard</a>
  </div>`);

  const text = `New coaching booking #${booking.bookingId}\n\nName: ${booking.fullName}\nEmail: ${booking.email}\nService: ${booking.serviceName}\nJob title: ${booking.jobTitle}\nIndustry: ${booking.industry}\nMain challenge: ${booking.mainChallenge}\nTimeline: ${booking.timeline}\nInterested in paid: ${booking.interestedInPaid ? "Yes" : "No"}\n\nView: ${adminUrl}`;

  await sendEmail({ to: adminEmail, subject: `New coaching request: ${booking.fullName} — Spitfire PM`, html, text });
}
