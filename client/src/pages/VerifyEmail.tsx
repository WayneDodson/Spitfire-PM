import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Status = "loading" | "success" | "error" | "no-token";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("no-token");
      return;
    }

    // Verify the token with the server
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Your email has been verified!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("A network error occurred. Please try again.");
      });
  }, []);

  const handleResend = async () => {
    if (!resendEmail) {
      toast.error("Please enter your email address");
      return;
    }
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      toast.success(data.message || "Verification email sent!");
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Spitfire PM</h1>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-6">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
              <div>
                <h2 className="text-xl font-semibold">Verifying your email…</h2>
                <p className="text-muted-foreground mt-2">Please wait a moment.</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold">Email Verified!</h2>
                <p className="text-muted-foreground mt-2">{message}</p>
              </div>
              <Button className="w-full" onClick={() => setLocation("/dashboard")}>
                Go to Dashboard
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-destructive mx-auto" />
              <div>
                <h2 className="text-xl font-semibold">Verification Failed</h2>
                <p className="text-muted-foreground mt-2">{message}</p>
              </div>
              <div className="space-y-3 text-left">
                <p className="text-sm text-muted-foreground text-center">
                  Enter your email to receive a new verification link:
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  className="w-full"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending…</>
                  ) : (
                    <><Mail className="h-4 w-4 mr-2" />Resend Verification Email</>
                  )}
                </Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => setLocation("/login")}>
                Back to Login
              </Button>
            </>
          )}

          {status === "no-token" && (
            <>
              <Mail className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h2 className="text-xl font-semibold">Check Your Email</h2>
                <p className="text-muted-foreground mt-2">
                  We sent a verification link to your email address. Click the link in that email to verify your account.
                </p>
              </div>
              <div className="space-y-3 text-left">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive it? Enter your email to resend:
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  className="w-full"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending…</>
                  ) : (
                    <><Mail className="h-4 w-4 mr-2" />Resend Verification Email</>
                  )}
                </Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => setLocation("/login")}>
                Back to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
