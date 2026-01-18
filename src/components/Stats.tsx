import { Target, TrendingUp } from "lucide-react";

interface StatsProps {
  todayTotal: number;
  weekTotal: number;
  subjectStats: { name: string; duration: number }[];
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return "0m";
}

export function Stats({ todayTotal, weekTotal, subjectStats }: StatsProps) {
  const maxDuration = Math.max(...subjectStats.map(s => s.duration), 1);

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-6 h-0.5 bg-foreground" />
        Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="border-2 border-foreground p-4 shadow-sm hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Today</p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold">{formatDuration(todayTotal)}</p>
        </div>
        <div className="border-2 border-foreground p-4 shadow-sm hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">This Week</p>
          </div>
          <p className="text-2xl sm:text-3xl font-mono font-bold">{formatDuration(weekTotal)}</p>
        </div>
      </div>

      {subjectStats.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <span className="w-4 h-0.5 bg-muted-foreground" />
            By Subject
          </h3>
          {subjectStats.slice(0, 5).map((stat) => (
            <div key={stat.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate mr-2">{stat.name}</span>
                <span className="font-mono text-xs flex-shrink-0">{formatDuration(stat.duration)}</span>
              </div>
              <div className="h-2 bg-secondary border border-foreground overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-500"
                  style={{ width: `${(stat.duration / maxDuration) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
