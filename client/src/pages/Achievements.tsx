import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Trophy, Flame, Target, Users, Star } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Achievements() {
  const { user, isAuthenticated } = useAuth();
  const { data: allAchievements, isLoading: loadingAll } = trpc.gamification.getAllAchievements.useQuery();
  const { data: myAchievements, isLoading: loadingMy } = trpc.gamification.getMyAchievements.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: stats } = trpc.gamification.getMyStats.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Trophy className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">Login to track your progress and unlock achievements!</p>
          <a
            href={getLoginUrl()}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  if (loadingAll || loadingMy) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-primary animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  const unlockedIds = new Set(myAchievements?.map(a => a.achievement.id) || []);
  
  const categorizeAchievements = (category: string) => {
    return allAchievements?.filter(a => a.category === category) || [];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone': return <Target className="h-5 w-5" />;
      case 'streak': return <Flame className="h-5 w-5" />;
      case 'mastery': return <Trophy className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      case 'special': return <Star className="h-5 w-5" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  const AchievementCard = ({ achievement, unlocked, unlockedAt }: any) => (
    <Card className={`relative overflow-hidden transition-all ${
      unlocked ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30' : 'opacity-60'
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-4xl ${unlocked ? '' : 'grayscale'}`}>
              {achievement.icon}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {achievement.title}
                {!unlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </div>
          </div>
          <Badge variant={unlocked ? "default" : "secondary"}>
            {achievement.xpReward} XP
          </Badge>
        </div>
      </CardHeader>
      {unlocked && unlockedAt && (
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Unlocked {new Date(unlockedAt).toLocaleDateString()}
          </p>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="container py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Back button */}
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and unlock rewards
          </p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <Trophy className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{myAchievements?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </Card>
            <Card className="text-center p-4">
              <Target className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{stats.totalXp}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </Card>
            <Card className="text-center p-4">
              <Flame className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{stats.currentStreak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </Card>
            <Card className="text-center p-4">
              <Star className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-2xl font-bold">{stats.level}</p>
              <p className="text-sm text-muted-foreground">Level</p>
            </Card>
          </div>
        )}

        {/* Achievements by Category */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="milestone">Milestones</TabsTrigger>
            <TabsTrigger value="streak">Streaks</TabsTrigger>
            <TabsTrigger value="mastery">Mastery</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="special">Special</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {allAchievements?.map(achievement => {
              const unlocked = unlockedIds.has(achievement.id);
              const unlockedData = myAchievements?.find(a => a.achievement.id === achievement.id);
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlocked}
                  unlockedAt={unlockedData?.unlockedAt}
                />
              );
            })}
          </TabsContent>

          {['milestone', 'streak', 'mastery', 'social', 'special'].map(category => (
            <TabsContent key={category} value={category} className="space-y-4 mt-6">
              <div className="flex items-center gap-2 mb-4">
                {getCategoryIcon(category)}
                <h2 className="text-xl font-bold capitalize">{category} Achievements</h2>
              </div>
              {categorizeAchievements(category).map(achievement => {
                const unlocked = unlockedIds.has(achievement.id);
                const unlockedData = myAchievements?.find(a => a.achievement.id === achievement.id);
                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={unlocked}
                    unlockedAt={unlockedData?.unlockedAt}
                  />
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
