import { StudySession } from "@/hooks/useStudySessions";
import { formatDistanceToNow } from "date-fns";
import { History } from "lucide-react";

interface SessionHistoryProps {
  sessions: StudySession[];
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const recentSessions = sessions.slice(0, 8);

  if (recentSessions.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
          <span className="w-6 h-0.5 bg-foreground" />
          Recent Sessions
        </h2>
        <div className="border-2 border-dashed border-muted-foreground/50 p-6 text-center">
          <History className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No sessions yet</p>
          <p className="text-muted-foreground text-xs mt-1">Start tracking to see your history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-6 h-0.5 bg-foreground" />
        Recent Sessions
      </h2>
      
      <div className="space-y-2">
        {recentSessions.map((session, index) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-3 border-2 border-foreground bg-card shadow-2xs hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-3 h-3 border border-foreground flex-shrink-0"
                style={{ backgroundColor: session.subjectColor }}
              />
              <span className="font-medium truncate">{session.subjectName}</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-sm flex-shrink-0">
              <span className="font-mono font-bold">{formatDuration(session.duration)}</span>
              <span className="text-muted-foreground text-xs hidden sm:inline">
                {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
