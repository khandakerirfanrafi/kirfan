import { Clock } from "lucide-react";

export function Header() {
  return (
    <header className="border-b-4 border-foreground bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-foreground flex items-center justify-center shadow-sm">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">akta</h1>
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
              Study Time Tracker
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
