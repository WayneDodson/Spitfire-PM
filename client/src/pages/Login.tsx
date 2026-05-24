import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, BookOpen, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, loading, refresh } = useAuth();
  // Capture referral code from URL (?ref=CODE)
  const referralCode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("ref") || "";
    // Sanitise: allow only uppercase alphanumeric, max 32 chars (matches server-side Zod schema)
    return raw.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 32);
  }, []);
  const [mode, setMode] = useState<"login" | "register">(referralCode ? "register" : "login");
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !loading) {
      setLocation("/dashboard");
    }
  }, [user, loading, setLocation]);

  // Listen for Google auth events from the global callback in index.html
  useEffect(() => {
    const handleGoogleSuccess = async () => {
      toast.success("Signed in with Google!");
      await refresh();
      setLocation("/dashboard");
    };

    const handleGoogleError = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      toast.error(detail || "Google sign-in failed");
    };

    window.addEventListener("google-auth-success", handleGoogleSuccess);
    window.addEventListener("google-auth-error", handleGoogleError);

    return () => {
      window.removeEventListener("google-auth-success", handleGoogleSuccess);
      window.removeEventListener("google-auth-error", handleGoogleError);
    };
  }, [refresh, setLocation]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { identifier, password }
          : { email: identifier, password, displayName, referralCode: referralCode || undefined };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Authentication failed");
        return;
      }

      toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
      await refresh();
      setLocation("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the Google button once the component mounts
  useEffect(() => {
    const tryRender = () => {
      const fn = (window as any).initGoogleSignIn;
      if (fn) fn();
    };
    // Try immediately, and retry after a short delay in case the GSI script hasn't loaded yet
    tryRender();
    const timer = setTimeout(tryRender, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container flex items-center justify-center min-h-screen py-20">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          {referralCode && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                You were invited! Create an account to help your friend unlock Level 2.
              </p>
            </div>
          )}

          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Log in to continue your PM learning journey"
                : "Start mastering project management today"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
            {/* Google Sign-In — rendered by Google Identity Services for maximum browser compatibility */}
            <div id="google-signin-button" className="w-full flex justify-center" />

              <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with email / username
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Your Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {mode === "login" ? "Email or Username" : "Email Address"}
                </Label>
                <Input
                  id="identifier"
                  type={mode === "login" ? "text" : "email"}
                  placeholder={mode === "login" ? "you@example.com or Admin" : "you@example.com"}
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "username" : "email"}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      mode === "register" ? "At least 8 characters" : "Your password"
                    }
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Toggle mode */}
            <div className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Free tier note */}
          {mode === "register" && (
            <p className="text-center text-xs text-muted-foreground">
              Level 1 is completely free. No credit card required.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
