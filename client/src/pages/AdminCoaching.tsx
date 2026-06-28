import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppHeader } from "@/components/AppHeader";
import {
  CheckCircle2, XCircle, Clock, Download, RefreshCw, Mail, Loader2,
  ChevronDown, ChevronUp, Plus, Trash2, Star, Save, X, Calendar,
  Package, Edit3,
} from "lucide-react";
import { toast } from "sonner";

type BookingStatus = "pending_review" | "accepted" | "declined" | "payment_pending" | "confirmed" | "scheduled" | "completed" | "no_show" | "cancelled" | "rescheduled";

const STATUS_COLORS: Record<string, string> = {
  pending_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  accepted: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  confirmed: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  declined: "bg-red-500/10 text-red-400 border-red-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-muted text-muted-foreground border-border",
  no_show: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  payment_pending: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  rescheduled: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Booking row ───────────────────────────────────────────────────────────────
function BookingRow({ booking, onRefresh }: { booking: any; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [sendEmailType, setSendEmailType] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState(
    booking.scheduledAt ? new Date(booking.scheduledAt).toISOString().slice(0, 16) : ""
  );
  const [meetingLink, setMeetingLink] = useState(booking.meetingLink ?? "");
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);

  const updateMutation = trpc.coaching.adminUpdateBooking.useMutation({
    onSuccess: () => { toast.success("Booking updated"); onRefresh(); },
    onError: (e) => toast.error(e.message),
  });

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateMutation.mutate({ bookingId: booking.id, status: "accepted", sendEmailType: "accepted" });
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showDeclineInput) { setShowDeclineInput(true); setExpanded(true); return; }
    updateMutation.mutate({ bookingId: booking.id, status: "declined", sendEmailType: "declined", declineReason: declineReason || undefined });
    setShowDeclineInput(false);
  };

  const handleSaveSchedule = () => {
    updateMutation.mutate({
      bookingId: booking.id,
      scheduledAt: scheduledAt || undefined,
      meetingLink: meetingLink || undefined,
    });
  };

  const handleStatusChange = (v: string) => {
    updateMutation.mutate({ bookingId: booking.id, status: v as BookingStatus });
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    updateMutation.mutate({ bookingId: booking.id, adminNotes: note });
    setNote("");
  };

  const handleResend = () => {
    if (!sendEmailType) { toast.error("Select an email type first"); return; }
    updateMutation.mutate({ bookingId: booking.id, sendEmailType: sendEmailType as any });
    setSendEmailType("");
  };

  const handleToggleEligibility = () => {
    updateMutation.mutate({ bookingId: booking.id, freeAssessmentEligibleAgain: !booking.freeAssessmentEligibleAgain });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground truncate">{booking.fullName}</span>
            <StatusBadge status={booking.status} />
          </div>
          <div className="text-sm text-muted-foreground mt-0.5 flex flex-wrap gap-3">
            <span>{booking.email}</span>
            {booking.scheduledAt && (
              <span className="text-cyan-400">
                {new Date(booking.scheduledAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            )}
            <span className="text-xs opacity-60">
              Submitted {new Date(booking.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {(booking.status === "pending_review" || booking.status === "pending") && (
            <>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-7 px-3"
                onClick={handleAccept}
                disabled={updateMutation.isPending}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-7 px-3"
                onClick={handleDecline}
                disabled={updateMutation.isPending}
              >
                <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
              </Button>
            </>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              {booking.phone && <p><span className="text-muted-foreground">Phone:</span> {booking.phone}</p>}
              {booking.jobTitle && <p><span className="text-muted-foreground">Job title:</span> {booking.jobTitle}</p>}
              {booking.industry && <p><span className="text-muted-foreground">Industry:</span> {booking.industry}</p>}
              {booking.country && <p><span className="text-muted-foreground">Country:</span> {booking.country} ({booking.timezone})</p>}
              {booking.qualifications && <p><span className="text-muted-foreground">Qualifications:</span> {booking.qualifications}</p>}
              {booking.targetRole && <p><span className="text-muted-foreground">Target role:</span> {booking.targetRole}</p>}
            </div>
            <div className="space-y-1">
              {booking.timeline && <p><span className="text-muted-foreground">Timeline:</span> {booking.timeline}</p>}
              {booking.preferredDays && <p><span className="text-muted-foreground">Preferred days:</span> {booking.preferredDays}</p>}
              {booking.preferredTimes && <p><span className="text-muted-foreground">Preferred times:</span> {booking.preferredTimes}</p>}
              <p><span className="text-muted-foreground">Interested in paid:</span> {booking.interestedInPaid ? "Yes" : "No"}</p>
              {booking.amountPaidPence > 0 && (
                <p><span className="text-muted-foreground">Amount paid:</span> £{(booking.amountPaidPence / 100).toFixed(2)}</p>
              )}
            </div>
          </div>

          {booking.mainChallenge && (
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <p className="text-muted-foreground text-xs mb-1 font-medium">Main challenge</p>
              <p className="text-foreground">{booking.mainChallenge}</p>
            </div>
          )}

          {booking.adminNotes && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-sm">
              <p className="text-amber-400 text-xs mb-1 font-medium">Admin notes</p>
              <p className="text-foreground whitespace-pre-wrap">{booking.adminNotes}</p>
            </div>
          )}

          {/* Actions row */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Select value={booking.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["pending_review","accepted","declined","payment_pending","confirmed","scheduled","completed","no_show","cancelled","rescheduled"] as BookingStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Resend email */}
            <div className="flex gap-1">
              <Select value={sendEmailType} onValueChange={setSendEmailType}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Email type…" />
                </SelectTrigger>
                <SelectContent>
                  {["accepted","declined","reschedule","cancellation","follow_up"].map((t) => (
                    <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleResend} disabled={updateMutation.isPending}>
                <Mail className="h-3 w-3 mr-1" /> Send
              </Button>
            </div>

            {booking.serviceId && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={handleToggleEligibility}
                disabled={updateMutation.isPending}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {booking.freeAssessmentEligibleAgain ? "Revoke re-eligibility" : "Allow free again"}
              </Button>
            )}
          </div>

          {/* Schedule + meeting link */}
          <div className="grid sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Scheduled date &amp; time</label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="text-sm h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Meeting link (Zoom / Teams / Google Meet)</label>
              <Input
                type="url"
                placeholder="https://zoom.us/j/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="text-sm h-8"
              />
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs w-full sm:w-auto"
            onClick={handleSaveSchedule}
            disabled={updateMutation.isPending}
          >
            <Calendar className="h-3 w-3 mr-1" /> Save schedule &amp; meeting link
          </Button>

          {/* Decline reason input */}
          {showDeclineInput && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Optional reason for declining (sent to client)…"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="text-sm h-8 flex-1"
              />
              <Button size="sm" className="h-8 text-xs bg-red-500 hover:bg-red-600 text-white" onClick={handleDecline} disabled={updateMutation.isPending}>
                Confirm decline
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowDeclineInput(false)}>Cancel</Button>
            </div>
          )}

          {/* Add note */}
          <div className="flex gap-2">
            <Textarea
              rows={2}
              placeholder="Add a private admin note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-sm"
            />
            <Button
              size="sm"
              className="self-end"
              onClick={handleAddNote}
              disabled={!note.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Testimonial section ───────────────────────────────────────────────────────
function TestimonialSection() {
  const [newForm, setNewForm] = useState({ authorName: "", authorTitle: "", content: "" });
  const [showAdd, setShowAdd] = useState(false);

  const { data: testimonials = [], refetch } = trpc.coaching.adminGetTestimonials.useQuery();
  const addMutation = trpc.coaching.adminAddTestimonial.useMutation({
    onSuccess: () => { toast.success("Testimonial added"); setShowAdd(false); setNewForm({ authorName: "", authorTitle: "", content: "" }); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.coaching.adminDeleteTestimonial.useMutation({
    onSuccess: () => { toast.success("Testimonial deleted"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Testimonials</h3>
        <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add testimonial
        </Button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Author name</Label>
              <Input value={newForm.authorName} onChange={(e) => setNewForm({ ...newForm, authorName: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Author title (optional)</Label>
              <Input value={newForm.authorTitle} onChange={(e) => setNewForm({ ...newForm, authorTitle: e.target.value })} placeholder="Junior Project Manager" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Testimonial content</Label>
            <Textarea rows={3} value={newForm.content} onChange={(e) => setNewForm({ ...newForm, content: e.target.value })} placeholder="What the client said…" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => addMutation.mutate({ ...newForm, isVisible: true })} disabled={!newForm.authorName || !newForm.content || addMutation.isPending}>
              {addMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />} Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}><X className="h-3.5 w-3.5 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      {testimonials.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">
          No testimonials yet. Add genuine testimonials from satisfied clients.
        </p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-xl p-4 flex gap-3">
              <Star className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground italic">"{t.content}"</p>
                <p className="text-xs text-muted-foreground mt-1">{t.authorName}{t.authorTitle ? ` · ${t.authorTitle}` : ""}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={() => deleteMutation.mutate({ id: t.id })}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Services / Pricing section ───────────────────────────────────────────────
function ServicesSection() {
  const { data: services = [], refetch } = trpc.coaching.adminGetServices.useQuery();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const updateMutation = trpc.coaching.adminUpdateService.useMutation({
    onSuccess: () => {
      toast.success("Package updated");
      setEditingId(null);
      refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const startEdit = (svc: any) => {
    setEditingId(svc.id);
    setForm({
      name: svc.name ?? "",
      shortDescription: svc.shortDescription ?? "",
      pricePence: svc.pricePence ?? 0,
      durationMinutes: svc.durationMinutes ?? 60,
      normalPricePence: svc.normalPricePence ?? "",
      foundingLabel: svc.foundingLabel ?? "",
      savingsText: svc.savingsText ?? "",
      bestFor: svc.bestFor ?? "",
      isFoundingPriceActive: svc.isFoundingPriceActive ?? false,
      foundingPlacesTotal: svc.foundingPlacesTotal ?? "",
      foundingPlacesRemaining: svc.foundingPlacesRemaining ?? "",
      featureNote: svc.featureNote ?? "",
      features: Array.isArray(svc.features)
        ? svc.features.join("\n")
        : (() => { try { return JSON.parse(svc.features).join("\n"); } catch { return svc.features ?? ""; } })(),
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    const featuresArr = (form.features as string)
      .split("\n")
      .map((f: string) => f.trim())
      .filter(Boolean);
    updateMutation.mutate({
      id: editingId,
      name: form.name || undefined,
      shortDescription: form.shortDescription || undefined,
      pricePence: form.pricePence !== "" ? Number(form.pricePence) : undefined,
      durationMinutes: form.durationMinutes !== "" ? Number(form.durationMinutes) : undefined,
      normalPricePence: form.normalPricePence !== "" ? Number(form.normalPricePence) : null,
      foundingLabel: form.foundingLabel !== "" ? form.foundingLabel : null,
      savingsText: form.savingsText !== "" ? form.savingsText : null,
      bestFor: form.bestFor !== "" ? form.bestFor : null,
      isFoundingPriceActive: Boolean(form.isFoundingPriceActive),
      foundingPlacesTotal: form.foundingPlacesTotal !== "" ? Number(form.foundingPlacesTotal) : null,
      foundingPlacesRemaining: form.foundingPlacesRemaining !== "" ? Number(form.foundingPlacesRemaining) : null,
      featureNote: form.featureNote !== "" ? form.featureNote : null,
      features: JSON.stringify(featuresArr),
    });
  };

  const field = (key: string, label: string, type: "text" | "number" | "textarea" | "checkbox" = "text") => (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {type === "textarea" ? (
        <Textarea
          rows={5}
          className="text-sm"
          value={form[key] ?? ""}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : type === "checkbox" ? (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id={`field-${key}`}
            checked={Boolean(form[key])}
            onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
            className="w-4 h-4 accent-cyan-500"
          />
          <label htmlFor={`field-${key}`} className="text-sm text-foreground">{label}</label>
        </div>
      ) : (
        <Input
          type={type}
          className="text-sm h-8"
          value={form[key] ?? ""}
          onChange={(e) => setForm({ ...form, [key]: type === "number" ? e.target.value : e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Coaching Packages &amp; Pricing</h3>
        <p className="text-xs text-muted-foreground">Click Edit to update any package</p>
      </div>

      {services.filter((s: any) => s.slug !== "free_assessment").map((svc: any) => (
        <div key={svc.id} className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">{svc.name}</span>
                {svc.isFoundingPriceActive && (
                  <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded px-2 py-0.5">Founding active</span>
                )}
                {!svc.isActive && (
                  <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/30 rounded px-2 py-0.5">Inactive</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                £{(svc.pricePence / 100).toFixed(2)}
                {svc.normalPricePence ? ` · Normally £${(svc.normalPricePence / 100).toFixed(2)}` : ""}
                {svc.bestFor ? ` · ${svc.bestFor}` : ""}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="flex-shrink-0 h-8"
              onClick={() => editingId === svc.id ? setEditingId(null) : startEdit(svc)}
            >
              {editingId === svc.id ? <><X className="h-3.5 w-3.5 mr-1" /> Cancel</> : <><Edit3 className="h-3.5 w-3.5 mr-1" /> Edit</>}
            </Button>
          </div>

          {/* Edit form */}
          {editingId === svc.id && (
            <div className="border-t border-border p-4 space-y-4 bg-background/50">
              <div className="grid sm:grid-cols-2 gap-3">
                {field("name", "Package name")}
                {field("durationMinutes", "Duration (minutes)", "number")}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {field("pricePence", "Current price (pence, e.g. 14900 = £149)", "number")}
                {field("normalPricePence", "Normal/RRP price (pence, blank = hide)", "number")}
              </div>
              {field("shortDescription", "Package description", "textarea")}
              <div className="grid sm:grid-cols-2 gap-3">
                {field("bestFor", "Best-for label (e.g. Best for one immediate challenge)")}
                {field("foundingLabel", "Founding label (e.g. Founding Client Price, blank = hide)")}
              </div>
              {field("savingsText", "Savings text (e.g. Save £28 compared with three individual sessions)")}
              <div className="grid sm:grid-cols-3 gap-3">
                {field("foundingPlacesTotal", "Total founding places (blank = hide)", "number")}
                {field("foundingPlacesRemaining", "Remaining founding places (blank = hide)", "number")}
                <div className="flex items-end pb-1">
                  {field("isFoundingPriceActive", "Founding pricing is active", "checkbox")}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Package features (one per line)</Label>
                <Textarea
                  rows={6}
                  className="text-sm font-mono"
                  value={form.features ?? ""}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="Interview preparation&#10;CV review&#10;Mock interview"
                />
              </div>
              {field("featureNote", "Note below feature list (e.g. suitability note, blank = hide)")}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={saveEdit}
                  disabled={updateMutation.isPending}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                  Save changes
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                  <X className="h-3.5 w-3.5 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 text-xs text-amber-300 space-y-1">
        <p className="font-semibold">Founding Client Pricing note</p>
        <p>When &ldquo;Founding pricing is active&rdquo; is checked, the founding label and normal price will be shown on the public coaching page. Uncheck to hide founding pricing for a package without deleting the data.</p>
        <p>Prices are stored in pence (100 = £1). The Stripe payment amount is taken from &ldquo;Current price (pence)&rdquo; — update this if you change the price.</p>
      </div>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function AdminCoaching() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tab, setTab] = useState<"bookings" | "testimonials" | "services">("bookings");

  const { data: bookingsData, refetch, isLoading } = trpc.coaching.adminGetBookings.useQuery(
    { status: statusFilter === "all" ? undefined : statusFilter },
    { enabled: user?.role === "admin" }
  );
  const bookings = bookingsData?.bookings ?? [];

  const { data: csvData, refetch: refetchCsv } = trpc.coaching.adminExportCsv.useQuery(
    { status: statusFilter === "all" ? undefined : statusFilter },
    { enabled: false }
  );

  const handleExport = async () => {
    const result = await refetchCsv();
    const csv = result.data?.csv;
    if (!csv) { toast.error("No data to export"); return; }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coaching-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
    </div>
  );

  if (!user || user.role !== "admin") {
    setLocation("/dashboard");
    return null;
  }

  const pendingCount = bookings.filter((b: any) => b.status === "pending_review" || b.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activePath="/admin/coaching" />

      <div className="container max-w-5xl py-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Coaching Admin</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage assessment requests, bookings and testimonials.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: bookings.length, color: "text-foreground" },
            { label: "Pending", value: pendingCount, color: "text-amber-400" },
            { label: "Confirmed", value: bookings.filter((b: any) => b.status === "confirmed" || b.status === "scheduled").length, color: "text-cyan-400" },
            { label: "Completed", value: bookings.filter((b: any) => b.status === "completed").length, color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/30 rounded-lg p-1 w-fit">
          {(["bookings", "testimonials", "services"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {t === "bookings" && pendingCount > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "bookings" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground">Filter by status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {["pending_review","accepted","declined","payment_pending","confirmed","scheduled","completed","no_show","cancelled","rescheduled"].map((s) => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="ghost" onClick={() => refetch()} className="h-8">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
                <Clock className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No bookings found for this filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking: any) => (
                  <BookingRow key={booking.id} booking={booking} onRefresh={refetch} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "testimonials" && <TestimonialSection />}
        {tab === "services" && <ServicesSection />}
      </div>
    </div>
  );
}
