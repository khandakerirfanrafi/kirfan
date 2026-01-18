import { StudySession } from "@/hooks/useStudySessions";
import { formatDistanceToNow } from "date-fns";

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
  const recentSessions = sessions.slice(0, 10);

  if (recentSessions.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">Recent Sessions</h2>
        <p className="text-muted-foreground">No sessions yet. Start tracking!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">Recent Sessions</h2>
      
      <div className="space-y-2">
        {recentSessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-3 border-2 border-foreground bg-card shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 border border-foreground flex-shrink-0"
                style={{ backgroundColor: session.subjectColor }}
              />
              <span className="font-medium">{session.subjectName}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-mono font-bold">{formatDuration(session.duration)}</span>
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(session.date), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
