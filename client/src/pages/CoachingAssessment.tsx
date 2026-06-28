import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AppHeader } from "@/components/AppHeader";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const TIMEZONES = [
  "Europe/London", "Europe/Dublin", "Europe/Paris", "Europe/Berlin", "Europe/Madrid",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney",
];

const INDUSTRIES = [
  "Healthcare / NHS", "IT / Technology", "Finance / Banking", "Construction / Engineering",
  "Education", "Government / Public Sector", "Retail / E-commerce", "Charity / Third Sector",
  "Logistics / Supply Chain", "Marketing / Media", "Legal", "Other",
];

const QUALIFICATIONS = [
  "None yet", "Google Project Management Certificate", "PRINCE2 Foundation",
  "PRINCE2 Practitioner", "APM PMQ", "APM PFQ", "Agile / Scrum certification",
  "PMP", "MSP", "Other",
];

const TIMELINES = [
  "Already applying", "Within 1 month", "1–3 months", "3–6 months", "6–12 months", "12+ months",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)"];

export default function CoachingAssessment() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const serviceSlug = params.get("service") || "free_assessment";
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    industry: "",
    country: "United Kingdom",
    timezone: "Europe/London",
    qualifications: "",
    targetRole: "",
    pmExperience: "",
    mainChallenge: "",
    supportNeeds: "",
    timeline: "",
    interestedInPaid: false,
    preferredDays: [] as string[],
    preferredTimes: [] as string[],
    privacyConsent: false,
    marketingConsent: false,
    bookingConsent: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{ bookingId: number; pricePence: number } | null>(null);
  const [error, setError] = useState("");
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  const checkoutMutation = trpc.coaching.createCoachingCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (e) => {
      setError(e.message);
      setIsRedirectingToPayment(false);
    },
  });

  const submitMutation = trpc.coaching.submitAssessment.useMutation({
    onSuccess: (data) => {
      if (data.requiresPayment && data.bookingId) {
        setPendingPayment({ bookingId: data.bookingId, pricePence: data.pricePence ?? 0 });
      } else {
        setSubmitted(true);
      }
    },
    onError: (e) => {
      if (e.data?.code === "CONFLICT") {
        setError(
          "A free assessment has already been requested with this email address. " +
          "If you believe this is an error or would like to book a paid session, please email coaching@spitfire-pm.com."
        );
      } else {
        setError(e.message);
      }
    },
  });

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.privacyConsent || !form.bookingConsent) {
      setError("Please accept the required consent checkboxes before submitting.");
      return;
    }
    submitMutation.mutate({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone || undefined,
      jobTitle: form.jobTitle,
      industry: form.industry,
      country: form.country,
      timezone: form.timezone,
      qualifications: form.qualifications,
      targetRole: form.targetRole,
      pmExperience: form.pmExperience,
      mainChallenge: form.mainChallenge,
      supportNeeds: form.supportNeeds || undefined,
      timeline: form.timeline,
      interestedInPaid: form.interestedInPaid,
      preferredDays: form.preferredDays.join(", "),
      preferredTimes: form.preferredTimes.join(", "),
      privacyConsent: form.privacyConsent,
      bookingConsent: form.bookingConsent,
      termsAccepted: form.bookingConsent,
    });
  };

  // ── Pending payment state ─────────────────────────────────────────────────
  if (pendingPayment) {
    const priceGBP = (pendingPayment.pricePence / 100).toFixed(2);
    return (
      <div className="min-h-screen bg-background">
        <AppHeader activePath="/one-to-one-coaching" />
        <div className="container max-w-2xl py-24 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold">One Last Step — Complete Payment</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your booking request has been received. To confirm your session, please complete the secure payment of <strong>£{priceGBP}</strong>.
          </p>
          <p className="text-sm text-muted-foreground bg-card border border-border rounded-lg p-4">
            Your session will only be confirmed once payment is received. You will be redirected to a secure Stripe checkout page.
          </p>
          {error && (
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive text-left">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={isRedirectingToPayment || checkoutMutation.isPending}
              onClick={() => {
                setIsRedirectingToPayment(true);
                setError("");
                checkoutMutation.mutate({
                  bookingId: pendingPayment.bookingId,
                  successUrl: `${window.location.origin}/one-to-one-coaching/booking-confirmed?bookingId=${pendingPayment.bookingId}`,
                  cancelUrl: `${window.location.origin}/one-to-one-coaching/assessment`,
                });
              }}
            >
              {(isRedirectingToPayment || checkoutMutation.isPending) ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting to payment…</>
              ) : (
                <>Pay £{priceGBP} Securely</>
              )}
            </Button>
            <Button variant="outline" onClick={() => setLocation("/one-to-one-coaching")}>
              Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Payments are processed securely by Stripe. Spitfire PM does not store your card details.</p>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader activePath="/one-to-one-coaching" />
        <div className="container max-w-2xl py-24 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-cyan-500" />
          </div>
          <h1 className="text-3xl font-bold">Assessment Request Received</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Thank you for submitting your PM Career Assessment request. We will review your details and be in touch within 1–2 working days to confirm your appointment.
          </p>
          <p className="text-sm text-muted-foreground bg-card border border-border rounded-lg p-4">
            Please check your email inbox (and spam folder) for a confirmation message from Spitfire PM.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={() => setLocation("/dashboard")}>Go to Dashboard</Button>
            <Button variant="outline" onClick={() => setLocation("/my-bookings")}>
              View My Bookings
            </Button>
            <Button variant="outline" onClick={() => setLocation("/one-to-one-coaching")}>
              Back to Coaching
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activePath="/one-to-one-coaching" />

      <div className="container max-w-2xl py-12">
        <button
          onClick={() => setLocation("/one-to-one-coaching")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Coaching
        </button>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold">PM Career Assessment Request</h1>
          <p className="text-muted-foreground leading-relaxed">
            Complete this short form so we can understand your background and goals before your free 20-minute assessment call. Submitting this form does not guarantee acceptance — we review each request to ensure the session is suitable and useful.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal details */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Your Details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name <span className="text-red-500">*</span></Label>
                <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Jane Smith" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Telephone number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44 7700 000000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle">Current job title <span className="text-red-500">*</span></Label>
                <Input id="jobTitle" required value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="e.g. Project Coordinator" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Current industry <span className="text-red-500">*</span></Label>
                <Select required value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                <Input id="country" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Time zone <span className="text-red-500">*</span></Label>
              <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </section>

          {/* Background */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Your Background &amp; Goals</h2>

            <div className="space-y-1.5">
              <Label>PM qualifications or training <span className="text-red-500">*</span></Label>
              <Select required value={form.qualifications} onValueChange={(v) => setForm({ ...form, qualifications: v })}>
                <SelectTrigger><SelectValue placeholder="Select your highest qualification" /></SelectTrigger>
                <SelectContent>{QUALIFICATIONS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetRole">Type of PM role you are targeting <span className="text-red-500">*</span></Label>
              <Input id="targetRole" required value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} placeholder="e.g. Junior Project Manager, IT Project Manager" />
            </div>

            {/* PM Experience — required, 50–1500 chars */}
            <div className="space-y-1.5">
              <Label htmlFor="pmExperience">
                Tell us about your project management experience <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Please describe any formal or informal project experience you have. This could include managing work tasks, coordinating people, leading improvements, organising events, supporting system changes, handling deadlines, working with stakeholders or completing project management training.
              </p>
              <Textarea
                id="pmExperience"
                required
                rows={6}
                minLength={50}
                maxLength={1500}
                value={form.pmExperience}
                onChange={(e) => setForm({ ...form, pmExperience: e.target.value })}
                placeholder="For example: I supported a system rollout, coordinated a small team, managed deadlines, worked with suppliers and completed the Google Project Management Certificate."
                className="resize-y min-h-[120px]"
              />
              <p className={`text-xs text-right ${
                form.pmExperience.length < 50 ? "text-muted-foreground" :
                form.pmExperience.length > 1400 ? "text-amber-400" : "text-emerald-400"
              }`}>
                {form.pmExperience.length} / 1500 characters{form.pmExperience.length < 50 && form.pmExperience.length > 0 ? ` (minimum 50)` : ""}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mainChallenge">Main challenge you currently face <span className="text-red-500">*</span></Label>
              <Textarea
                id="mainChallenge"
                required
                rows={4}
                value={form.mainChallenge}
                onChange={(e) => setForm({ ...form, mainChallenge: e.target.value })}
                placeholder="e.g. I struggle to articulate my experience in interviews, or I have a qualification but no direct PM experience..."
              />
            </div>

            {/* Support needs — optional, max 1000 chars */}
            <div className="space-y-1.5">
              <Label htmlFor="supportNeeds">
                What would you most like help with? <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Tell us what you want to improve, such as interview confidence, competency examples, CV positioning, career direction, practical PM knowledge or moving from your current industry into project management.
              </p>
              <Textarea
                id="supportNeeds"
                rows={4}
                maxLength={1000}
                value={form.supportNeeds}
                onChange={(e) => setForm({ ...form, supportNeeds: e.target.value })}
                placeholder="e.g. I want to improve my interview confidence and learn how to present my transferable skills as PM experience."
                className="resize-y min-h-[100px]"
              />
              {form.supportNeeds.length > 0 && (
                <p className={`text-xs text-right ${
                  form.supportNeeds.length > 900 ? "text-amber-400" : "text-muted-foreground"
                }`}>
                  {form.supportNeeds.length} / 1000 characters
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>When do you expect to begin applying for roles? <span className="text-red-500">*</span></Label>
              <Select required value={form.timeline} onValueChange={(v) => setForm({ ...form, timeline: v })}>
                <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                <SelectContent>{TIMELINES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="interestedInPaid"
                checked={form.interestedInPaid}
                onCheckedChange={(c) => setForm({ ...form, interestedInPaid: !!c })}
              />
              <Label htmlFor="interestedInPaid" className="cursor-pointer font-normal">
                I am interested in paid 1-to-1 coaching if the assessment confirms it would help
              </Label>
            </div>
          </section>

          {/* Availability */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Preferred Availability</h2>
            <p className="text-sm text-muted-foreground">Select all that apply. All times are shown in your local time zone.</p>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Preferred days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setForm({ ...form, preferredDays: toggle(form.preferredDays, day) })}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      form.preferredDays.includes(day)
                        ? "bg-cyan-500 border-cyan-500 text-white"
                        : "border-border text-muted-foreground hover:border-cyan-500/50"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Preferred times</Label>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setForm({ ...form, preferredTimes: toggle(form.preferredTimes, time) })}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      form.preferredTimes.includes(time)
                        ? "bg-cyan-500 border-cyan-500 text-white"
                        : "border-border text-muted-foreground hover:border-cyan-500/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Consent */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold border-b border-border pb-2">Consent &amp; Privacy</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacyConsent"
                  checked={form.privacyConsent}
                  onCheckedChange={(c) => setForm({ ...form, privacyConsent: !!c })}
                  className="mt-0.5"
                />
                <Label htmlFor="privacyConsent" className="cursor-pointer font-normal text-sm leading-relaxed">
                  I have read and agree to the{" "}
                  <a href="/privacy" target="_blank" className="text-cyan-500 hover:underline">Privacy Policy</a>
                  {" "}and{" "}
                  <a href="/terms" target="_blank" className="text-cyan-500 hover:underline">Terms &amp; Conditions</a>.
                  I understand how my personal data will be used. <span className="text-red-500">*</span>
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="bookingConsent"
                  checked={form.bookingConsent}
                  onCheckedChange={(c) => setForm({ ...form, bookingConsent: !!c })}
                  className="mt-0.5"
                />
                <Label htmlFor="bookingConsent" className="cursor-pointer font-normal text-sm leading-relaxed">
                  I consent to receive emails related to my assessment request and any subsequent coaching booking. <span className="text-red-500">*</span>
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="marketingConsent"
                  checked={form.marketingConsent}
                  onCheckedChange={(c) => setForm({ ...form, marketingConsent: !!c })}
                  className="mt-0.5"
                />
                <Label htmlFor="marketingConsent" className="cursor-pointer font-normal text-sm leading-relaxed">
                  I would like to receive occasional updates about Spitfire PM coaching and training. <span className="text-muted-foreground">(optional)</span>
                </Label>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
              <p>
                Your information is processed in accordance with UK GDPR. We will only use your details to manage your assessment request and, if you consent, to send you relevant updates. You can withdraw consent at any time by emailing{" "}
                <a href="mailto:coaching@spitfire-pm.com" className="text-cyan-500 hover:underline">coaching@spitfire-pm.com</a>.
              </p>
            </div>
          </section>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</>
            ) : (
              <>Submit Assessment Request <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
