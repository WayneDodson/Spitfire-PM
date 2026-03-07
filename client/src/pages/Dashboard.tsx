import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { 
  Award, 
  BookOpen,
  CheckCircle2, 
  Clock, 
  Copy, 
  CreditCard, 
  Layers,
  Lock, 
  Share2, 
  TrendingUp,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { XPProgressBar } from "@/components/XPProgressBar";
import { OnboardingModal } from "@/components/OnboardingModal";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Fetch user data
  const { data: levels } = trpc.levels.getAll.useQuery();
  const { data: levelProgress } = trpc.levels.getMyProgress.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: referralData } = trpc.referrals.getMyReferralCount.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const userProgress = levelProgress?.progress;
  const referralCount = referralData?.count || 0;
  const hasActiveSubscription = levelProgress?.hasActiveSubscription || false;

  // Show onboarding modal if user has no display name
  useEffect(() => {
    if (user && !user.displayName) {
      setShowOnboarding(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const completedLevels = userProgress?.filter((p: any) => p.completed).length || 0;
  const totalLevels = 7;
  const overallProgress = (completedLevels / totalLevels) * 100;
  
  // Find current level (first incomplete level or last completed level)
  const currentLevelProgress = userProgress?.find((p: any) => !p.completed) || 
                                userProgress?.find((p: any) => p.completed) ||
                                null;
  const currentLevelPercent = currentLevelProgress?.progressPercent || 0;

  const referralLink = user?.referralCode 
    ? `${window.location.origin}/?ref=${user.referralCode}`
    : "";

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getLevelStatus = (level: any) => {
    const progress = userProgress?.find((p: any) => p.levelId === level.id);
    
    if (progress?.completed) return "completed";
    if (progress && !progress.completed) return "in_progress";
    
    // Check access
    if (level.accessType === "free") return "unlocked";
    if (level.accessType === "referral") {
      return referralCount >= 1 ? "unlocked" : "locked";
    }
    if (level.accessType === "paid") {
      return hasActiveSubscription ? "unlocked" : "locked";
    }
    
    return "locked";
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Project Pro</h1>
            <nav className="hidden md:flex gap-6">
              <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => setLocation("/")}>
                Home
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/achievements")}>
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/glossary")}>
              <BookOpen className="h-4 w-4 mr-2" />
              Glossary
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/frameworks")}>
              <Layers className="h-4 w-4 mr-2" />
              Frameworks
            </Button>
            <ThemeToggle />
            <div className="text-sm text-right">
              <p className="font-medium">{user?.displayName || user?.name}</p>
              <p className="text-muted-foreground text-xs">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold">Welcome back, {(user?.displayName || user?.name)?.split(" ")[0]}!</h2>
            <p className="text-xl text-muted-foreground">
              Continue your journey to becoming a professional project manager
            </p>
          </div>
          <XPProgressBar />
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(currentLevelPercent)}%</div>
              <Progress value={currentLevelPercent} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {currentLevelProgress ? 
                  `Level ${levels?.find((l: any) => l.id === currentLevelProgress.levelId)?.orderIndex || 1} progress` :
                  "Start your first level"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedLevels * 6}h</div>
              <p className="text-xs text-muted-foreground mt-2">
                {42 - (completedLevels * 6)}h remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralCount}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {referralCount >= 1 ? "Level 2 unlocked!" : "1 needed for Level 2"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hasActiveSubscription ? "Active" : "Free"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {hasActiveSubscription ? "£20/month" : "Upgrade for Levels 3-7"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Section */}
        {!hasActiveSubscription && completedLevels >= 1 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Unlock Level 2 Free!
              </CardTitle>
              <CardDescription>
                Share Project Pro with a friend and unlock Level 2 when they sign up
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm"
                />
                <Button onClick={copyReferralLink} variant="outline">
                  {copiedLink ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                You've referred {referralCount} {referralCount === 1 ? "person" : "people"} so far
              </p>
            </CardContent>
          </Card>
        )}

        {/* Levels Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Your Learning Path</h3>
            {!hasActiveSubscription && completedLevels >= 1 && (
              <Button onClick={() => toast.info("Stripe integration coming soon!")}>
                Upgrade to Pro - £20/month
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels?.map((level: any) => {
              const status = getLevelStatus(level);
              const progress = userProgress?.find((p: any) => p.levelId === level.id);
              const isLocked = status === "locked";
              const isCompleted = status === "completed";
              const isInProgress = status === "in_progress";

              return (
                <Card 
                  key={level.id}
                  className={`relative overflow-hidden ${
                    isLocked ? "opacity-60" : ""
                  } ${isCompleted ? "border-green-500/50 bg-green-500/5" : ""}`}
                >
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Level {level.orderIndex}</p>
                        <CardTitle className="text-lg">{level.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {level.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {level.estimatedHours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {level.accessType === "free" ? "Free" : 
                         level.accessType === "referral" ? "1 Referral" : "Pro"}
                      </div>
                    </div>

                    {isInProgress && progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{progress.progressPercent}%</span>
                        </div>
                        <Progress value={progress.progressPercent} />
                      </div>
                    )}

                    <Button 
                      className="w-full"
                      disabled={isLocked}
                      onClick={() => {
                        if (isLocked) {
                          if (level.accessType === "referral") {
                            toast.info("Refer 1 friend to unlock this level!");
                          } else {
                            toast.info("Subscribe to Pro to unlock this level!");
                          }
                        } else {
                          setLocation(`/level/${level.id}`);
                        }
                      }}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </>
                      ) : isCompleted ? (
                        "Review Level"
                      ) : isInProgress ? (
                        "Continue Learning"
                      ) : (
                        "Start Level"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      {/* Resources Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Learning Resources</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setLocation("/glossary")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">PM Glossary</CardTitle>
                  <CardDescription>60+ essential project management terms</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setLocation("/frameworks")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Frameworks Reference</CardTitle>
                  <CardDescription>Waterfall, Agile, Scrum, PRINCE2 & more</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
      </div>
    </div>

    {/* Onboarding Modal */}
    <OnboardingModal 
      open={showOnboarding} 
      onComplete={() => {
        setShowOnboarding(false);
        // Refresh user data to get updated display name
        window.location.reload();
      }} 
    />
    </>
  );
}
