import { useAchievements } from "@/hooks/useAchievements";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  Star, 
  Award, 
  Flame, 
  Play, 
  Target, 
  Medal,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  clock: Clock,
  star: Star,
  award: Award,
  flame: Flame,
  play: Play,
  target: Target,
  medal: Medal,
};

export function Achievements() {
  const { achievements, earnedCount, totalCount, loading } = useAchievements();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider">অ্যাচিভমেন্ট</h3>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted border-2 border-border" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider">অ্যাচিভমেন্ট</h3>
        <Badge variant="outline" className="font-mono">
          {earnedCount}/{totalCount}
        </Badge>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {achievements.map((achievement) => {
          const IconComponent = iconMap[achievement.icon] || Trophy;
          
          return (
            <div
              key={achievement.id}
              className={cn(
                "relative p-3 border-2 flex flex-col items-center justify-center text-center transition-all",
                achievement.earned
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30 opacity-50"
              )}
              title={`${achievement.name}: ${achievement.description}`}
            >
              {!achievement.earned && (
                <Lock className="absolute top-1 right-1 w-3 h-3 text-muted-foreground" />
              )}
              <IconComponent 
                className={cn(
                  "w-6 h-6 mb-1",
                  achievement.earned ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className="text-[10px] font-bold uppercase tracking-wide leading-tight">
                {achievement.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
