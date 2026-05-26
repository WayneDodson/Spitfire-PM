import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Crown,
  Shield,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Fetch subscription status
  const { data: subData, isLoading: subLoading } = trpc.stripe.getSubscriptionStatus.useQuery();

  // Fetch trial status
  const { data: trialData } = trpc.trial.getStatus.useQuery();

  // Change password mutation
  const changePasswordMutation = trpc.profile.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(null);
    },
    onError: (err) => {
      setPasswordError(err.message);
    },
  });

  // Create Stripe billing portal session
  const portalMutation = trpc.stripe.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data?.url) window.open(data.url, "_blank");
    },
    onError: () => {
      toast.error("Unable to open billing portal. Please try again.");
    },
  });

  const handleManageBilling = () => {
    portalMutation.mutate({ returnUrl: `${window.location.origin}/profile` });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword, confirmPassword });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const isEmailUser = (user as any).authProvider === "email";
  const memberSince = user.createdAt
    ? new Date(user.createdAt as any).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "Unknown";

  const sub = subData?.subscription;
  const hasActiveSub = subData?.hasSubscription;
  const renewalDate = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const trialActive = trialData?.trialActive;
  const trialExpired = trialData?.trialExpired;
  const daysRemaining = trialData?.daysRemaining ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="text-foreground/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Dashboard
          </Button>
          <Separator orientation="vertical" className="h-5 bg-white/10" />
          <h1 className="font-semibold text-foreground">My Profile</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Account Information */}
        <Card className="bg-white/5 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-cyan-400" />
              Account Information
            </CardTitle>
            <CardDescription className="text-foreground/50">Your account details and login method.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-foreground/40 uppercase tracking-wide">Display Name</p>
                <p className="text-foreground font-medium">{(user as any).displayName || (user as any).name || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-foreground/40 uppercase tracking-wide">Username</p>
                <p className="text-foreground font-medium">{(user as any).username || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-foreground/40 uppercase tracking-wide flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </p>
                <p className="text-foreground font-medium">{(user as any).email || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-foreground/40 uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Member Since
                </p>
                <p className="text-foreground font-medium">{memberSince}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-foreground/40 uppercase tracking-wide">Login Method</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      isEmailUser
                        ? "border-cyan-400/30 text-cyan-300 bg-cyan-400/10"
                        : "border-purple-400/30 text-purple-300 bg-purple-400/10"
                    }
                  >
                    {isEmailUser ? "Email & Password" : (user as any).authProvider === "google" ? "Google" : "Manus OAuth"}
                  </Badge>
                </div>
              </div>
              {(user as any).role === "admin" && (
                <div className="space-y-1">
                  <p className="text-xs text-foreground/40 uppercase tracking-wide">Role</p>
                  <Badge variant="outline" className="border-rose-400/30 text-rose-300 bg-rose-400/10">
                    <Shield className="h-3 w-3 mr-1" /> Admin
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="bg-white/5 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5 text-cyan-400" />
              Subscription
            </CardTitle>
            <CardDescription className="text-foreground/50">Your current plan and billing details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subLoading ? (
              <div className="h-16 flex items-center">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : hasActiveSub ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Active Subscription</p>
                    <p className="text-sm text-foreground/60">
                      {sub?.cancelAtPeriodEnd
                        ? `Cancels on ${renewalDate}`
                        : renewalDate
                        ? `Renews on ${renewalDate}`
                        : "Full access to all course materials"}
                    </p>
                  </div>
                </div>
                {(trialData as any)?.founderAccessEarned && (
                  <div className="flex items-center gap-2 text-sm text-amber-300">
                    <Crown className="h-4 w-4 text-amber-400" />
                    Loyalty Access pricing applied
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageBilling}
                  disabled={portalMutation.isPending}
                  className="border-border/70 text-foreground/70 hover:text-white hover:border-white/40 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  {portalMutation.isPending ? "Opening…" : "Manage Billing"}
                </Button>
              </div>
            ) : trialActive ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-amber-400/10 border border-amber-400/20 rounded-xl">
                  <Crown className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Free Trial Active</p>
                    <p className="text-sm text-foreground/60">
                      {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining — access to first 6 lessons of Level 1
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setLocation("/subscribe")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-foreground border-0"
                >
                  <Crown className="h-4 w-4 mr-1.5" />
                  Upgrade to Full Access
                </Button>
              </div>
            ) : trialExpired ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-rose-400/10 border border-rose-400/20 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Trial Expired</p>
                    <p className="text-sm text-foreground/60">Subscribe to regain access to all course materials.</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setLocation("/subscribe")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-foreground border-0"
                >
                  <Crown className="h-4 w-4 mr-1.5" />
                  Subscribe Now
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-border rounded-xl">
                <AlertCircle className="h-5 w-5 text-foreground/40 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">No Active Subscription</p>
                  <p className="text-sm text-foreground/60">Subscribe to access all 7 levels and 168 lessons.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password — only for email/password users */}
        {isEmailUser && (
          <Card className="bg-white/5 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lock className="h-5 w-5 text-cyan-400" />
                Change Password
              </CardTitle>
              <CardDescription className="text-foreground/50">
                Must include uppercase, lowercase, a number, and a special character.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword" className="text-foreground/70">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="bg-white/5 border-border text-foreground placeholder:text-foreground/30 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-foreground/70">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="bg-white/5 border-border text-foreground placeholder:text-foreground/30 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-foreground/70">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-white/5 border-border text-foreground placeholder:text-foreground/30 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {passwordError && (
                  <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-3 py-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {passwordError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-foreground border-0"
                >
                  {changePasswordMutation.isPending ? "Updating…" : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Social login — password change not available */}
        {!isEmailUser && (
          <Card className="bg-white/5 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lock className="h-5 w-5 text-foreground/40" />
                Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/50">
                You signed in with {(user as any).authProvider === "google" ? "Google" : "OAuth"}. Password management is handled by your login provider.
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
