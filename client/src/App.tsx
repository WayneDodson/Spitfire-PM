import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
