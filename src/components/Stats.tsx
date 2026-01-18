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
  return `${minutes}m`;
}

export function Stats({ todayTotal, weekTotal, subjectStats }: StatsProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-foreground p-4 shadow-sm">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Today</p>
          <p className="text-2xl sm:text-3xl font-mono font-bold">{formatDuration(todayTotal)}</p>
        </div>
        <div className="border-2 border-foreground p-4 shadow-sm">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">This Week</p>
          <p className="text-2xl sm:text-3xl font-mono font-bold">{formatDuration(weekTotal)}</p>
        </div>
      </div>

      {subjectStats.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            By Subject
          </h3>
          {subjectStats.slice(0, 5).map((stat) => (
            <div key={stat.name} className="flex items-center justify-between">
              <span className="font-medium">{stat.name}</span>
              <span className="font-mono text-sm">{formatDuration(stat.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
