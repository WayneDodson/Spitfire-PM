import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  // If already logged in, redirect to scenarios
  useEffect(() => {
    if (user && !loading) {
      setLocation("/scenarios");
    }
  }, [user, loading, setLocation]);

  const handleLogin = () => {
    // Redirect to Manus OAuth login
    window.location.href = getLoginUrl();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Back Button */}
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
          <div className="text-center space-y-2">
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
              Project Pro: The PM Simulator
            </div>
            <h1 className="text-4xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Log in to continue your project management learning journey
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 space-y-6">
            <Button 
              onClick={handleLogin}
              size="lg" 
              className="w-full gap-2"
            >
              Log In with Manus
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => setLocation("/onboarding")}
                className="text-primary hover:underline font-medium"
              >
                Sign up for free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
