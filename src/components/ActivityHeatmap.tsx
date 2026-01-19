import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StudySession {
  id: string;
  subjectName: string;
  duration: number;
  date: Date;
}

interface ActivityHeatmapProps {
  sessions: StudySession[];
  subject?: string;
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

function getIntensityClass(duration: number, maxDuration: number): string {
  if (duration === 0) return "bg-secondary";
  const ratio = duration / maxDuration;
  if (ratio < 0.25) return "bg-primary/30";
  if (ratio < 0.5) return "bg-primary/50";
  if (ratio < 0.75) return "bg-primary/75";
  return "bg-primary";
}

export function ActivityHeatmap({ sessions, subject }: ActivityHeatmapProps) {
  const { weeks, maxDuration, months } = useMemo(() => {
    const today = new Date();
    const weeksCount = 20;
    const daysData: { date: Date; duration: number }[] = [];
    
    // Generate last 20 weeks of days
    for (let w = weeksCount - 1; w >= 0; w--) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + (6 - d)) - today.getDay() + d);
        daysData.push({ date, duration: 0 });
      }
    }
    
    // Fill in session data
    const filteredSessions = subject 
      ? sessions.filter(s => s.subjectName === subject)
      : sessions;
    
    filteredSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayIndex = daysData.findIndex(d => 
        d.date.toDateString() === sessionDate.toDateString()
      );
      if (dayIndex !== -1) {
        daysData[dayIndex].duration += session.duration;
      }
    });
    
    // Calculate max duration for intensity
    const maxDur = Math.max(...daysData.map(d => d.duration), 1);
    
    // Group into weeks
    const weeksArr: { date: Date; duration: number }[][] = [];
    for (let i = 0; i < daysData.length; i += 7) {
      weeksArr.push(daysData.slice(i, i + 7));
    }
    
    // Get month labels
    const monthsArr: { name: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeksArr.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay && firstDay.date.getMonth() !== lastMonth) {
        lastMonth = firstDay.date.getMonth();
        monthsArr.push({
          name: firstDay.date.toLocaleDateString('en', { month: 'short' }),
          weekIndex
        });
      }
    });
    
    return { weeks: weeksArr, maxDuration: maxDur, months: monthsArr };
  }, [sessions, subject]);

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-6 h-0.5 bg-foreground" />
        Activity
        {subject && <span className="text-primary">• {subject}</span>}
      </h2>
      
      <div className="border-2 border-foreground p-3 sm:p-4 overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-1 ml-8 text-xs text-muted-foreground">
          {months.map((month, i) => (
            <div 
              key={i} 
              className="flex-shrink-0"
              style={{ 
                marginLeft: i === 0 ? 0 : `${(month.weekIndex - (months[i-1]?.weekIndex || 0) - 1) * 14}px`,
                width: '28px'
              }}
            >
              {month.name}
            </div>
          ))}
        </div>
        
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] text-xs text-muted-foreground mr-1">
            {dayLabels.map((label, i) => (
              <div key={i} className="h-[12px] leading-[12px]">{label}</div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <TooltipProvider delayDuration={100}>
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <Tooltip key={dayIndex}>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-[12px] h-[12px] border border-foreground/20 cursor-pointer hover:ring-1 hover:ring-foreground transition-all ${getIntensityClass(day.duration, maxDuration)}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-bold">{formatDuration(day.duration)}</p>
                        <p className="text-muted-foreground">
                          {day.date.toLocaleDateString('en', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="w-[12px] h-[12px] bg-secondary border border-foreground/20" />
          <div className="w-[12px] h-[12px] bg-primary/30 border border-foreground/20" />
          <div className="w-[12px] h-[12px] bg-primary/50 border border-foreground/20" />
          <div className="w-[12px] h-[12px] bg-primary/75 border border-foreground/20" />
          <div className="w-[12px] h-[12px] bg-primary border border-foreground/20" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
