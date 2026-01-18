import { trpc } from "@/lib/trpc";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export function XPProgressBar() {
  const { data: stats, isLoading } = trpc.gamification.getMyStats.useQuery();

  if (isLoading || !stats) {
    return (
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">Level {stats.level}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{stats.totalXp} XP</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <Progress value={stats.progressToNextLevel} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {stats.xpForNextLevel - stats.totalXp} XP to Level {stats.level + 1}
          </p>
        </div>

        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-orange-500">🔥</span>
            <span className="font-medium">{stats.currentStreak} day streak!</span>
          </div>
        )}
      </div>
    </Card>
  );
}
