import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Assessment from "./pages/Assessment";
import LearningPath from "./pages/LearningPath";
import Tutorial from "./pages/Tutorial";
import ScenarioSelection from "./pages/ScenarioSelection";
import Scenario from "./pages/Scenario";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import Level from "./pages/Level";
import Achievements from "./pages/Achievements";
import Glossary from "./pages/Glossary";
import Frameworks from "./pages/Frameworks";
import Subscription from "./pages/Subscription";
import VerifyEmail from "./pages/VerifyEmail";
import AdminCancellations from "./pages/AdminCancellations";
import MindsetHub from "./pages/MindsetHub";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LevelAssessment from "./pages/LevelAssessment";
import { TrialBanner } from "./components/TrialBanner";
import { FounderAccessModal } from "./components/FounderAccessModal";
import FocusResetProvider from "./components/FocusResetProvider";
import { useAuth } from "./_core/hooks/useAuth";
import { trpc } from "./lib/trpc";
import { useState, useEffect, useRef } from "react";

// Pages where the trial banner should NOT appear
const BANNER_EXCLUDED_PATHS = ["/", "/login", "/subscribe", "/verify-email", "/forgot-password", "/reset-password"];

// Pages where the focus reset system should NOT be active (public/auth pages)
const FOCUS_RESET_EXCLUDED_PATHS = ["/", "/login", "/subscribe", "/verify-email", "/onboarding", "/forgot-password", "/reset-password"];

function TrialAwareLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [founderModalOpen, setFounderModalOpen] = useState(false);
  const prevFounderEarned = useRef<boolean | null>(null);

  const showBanner = isAuthenticated && !BANNER_EXCLUDED_PATHS.includes(location);
  const enableFocusReset = isAuthenticated && !FOCUS_RESET_EXCLUDED_PATHS.includes(location);

  const { data: trial } = trpc.trial.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  });

  // Detect when Founder Access is newly earned and show celebration modal
  useEffect(() => {
    if (!trial) return;
    if (prevFounderEarned.current === null) {
      prevFounderEarned.current = trial.founderAccessEarned;
      return;
    }
    if (!prevFounderEarned.current && trial.founderAccessEarned) {
      setFounderModalOpen(true);
    }
    prevFounderEarned.current = trial.founderAccessEarned;
  }, [trial?.founderAccessEarned]);

  return (
    <FocusResetProvider enabled={enableFocusReset}>
      <div className="min-h-screen flex flex-col">
        {showBanner && <TrialBanner />}
        <div className="flex-1">{children}</div>
        <FounderAccessModal
          open={founderModalOpen}
          onClose={() => setFounderModalOpen(false)}
        />
      </div>
    </FocusResetProvider>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/login"} component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/learning-path" component={LearningPath} />
      <Route path="/tutorial/:id" component={Tutorial} />
      <Route path="/scenarios" component={ScenarioSelection} />
      <Route path="/scenario/:id" component={Scenario} />
      <Route path="/level/:id" component={Level} />
      <Route path="/lesson/:id" component={Lesson} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/frameworks" component={Frameworks} />
      <Route path="/subscribe" component={Subscription} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/mindset" component={MindsetHub} />
      <Route path="/level/:levelId/assessment" component={LevelAssessment} />
      <Route path="/admin/cancellations" component={AdminCancellations} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <TrialAwareLayout>
            <Router />
          </TrialAwareLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
