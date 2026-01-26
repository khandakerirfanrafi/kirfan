import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RotateCcw } from "lucide-react";

interface PomodoroSettingsType {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreak: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
}

interface PomodoroSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: PomodoroSettingsType;
  onUpdateSettings: (updates: Partial<PomodoroSettingsType>) => void;
  onResetSettings: () => void;
}

export function PomodoroSettings({
  open,
  onOpenChange,
  settings,
  onUpdateSettings,
  onResetSettings,
}: PomodoroSettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-foreground">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wide">Pomodoro Settings</DialogTitle>
          <DialogDescription>
            Customize your focus and break intervals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Work Duration */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm uppercase tracking-wide">Focus Duration</Label>
              <span className="font-mono font-bold">{settings.workDuration} min</span>
            </div>
            <Slider
              value={[settings.workDuration]}
              onValueChange={([value]) => onUpdateSettings({ workDuration: value })}
              min={5}
              max={60}
              step={5}
              className="w-full"
            />
          </div>

          {/* Short Break Duration */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm uppercase tracking-wide">Short Break</Label>
              <span className="font-mono font-bold">{settings.shortBreakDuration} min</span>
            </div>
            <Slider
              value={[settings.shortBreakDuration]}
              onValueChange={([value]) => onUpdateSettings({ shortBreakDuration: value })}
              min={1}
              max={15}
              step={1}
              className="w-full"
            />
          </div>

          {/* Long Break Duration */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm uppercase tracking-wide">Long Break</Label>
              <span className="font-mono font-bold">{settings.longBreakDuration} min</span>
            </div>
            <Slider
              value={[settings.longBreakDuration]}
              onValueChange={([value]) => onUpdateSettings({ longBreakDuration: value })}
              min={5}
              max={30}
              step={5}
              className="w-full"
            />
          </div>

          {/* Sessions Before Long Break */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm uppercase tracking-wide">Sessions Until Long Break</Label>
              <span className="font-mono font-bold">{settings.sessionsBeforeLongBreak}</span>
            </div>
            <Slider
              value={[settings.sessionsBeforeLongBreak]}
              onValueChange={([value]) => onUpdateSettings({ sessionsBeforeLongBreak: value })}
              min={2}
              max={8}
              step={1}
              className="w-full"
            />
          </div>

          <div className="border-t-2 border-foreground pt-4 space-y-4">
            {/* Auto Start Break */}
            <div className="flex items-center justify-between">
              <Label className="text-sm uppercase tracking-wide">Auto-start Breaks</Label>
              <Switch
                checked={settings.autoStartBreak}
                onCheckedChange={(checked) => onUpdateSettings({ autoStartBreak: checked })}
              />
            </div>

            {/* Auto Start Work */}
            <div className="flex items-center justify-between">
              <Label className="text-sm uppercase tracking-wide">Auto-start Focus</Label>
              <Switch
                checked={settings.autoStartWork}
                onCheckedChange={(checked) => onUpdateSettings({ autoStartWork: checked })}
              />
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between">
              <Label className="text-sm uppercase tracking-wide">Sound Notifications</Label>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => onUpdateSettings({ soundEnabled: checked })}
              />
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={onResetSettings}
            className="w-full gap-2 border-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
