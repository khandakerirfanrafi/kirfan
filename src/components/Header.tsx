import { Clock, Keyboard, LogOut, User, Cloud } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function Header() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("লগ আউট হয়েছে");
  };

  return (
    <header className="border-b-4 border-foreground bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-foreground flex items-center justify-center shadow-sm bg-primary text-primary-foreground">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">akta</h1>
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Cloud className="w-3 h-3" />
                Cloud Synced
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Keyboard Shortcuts */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-2 shadow-2xs hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all hidden sm:flex"
                  aria-label="Keyboard shortcuts"
                >
                  <Keyboard className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 border-2 border-foreground shadow-md">
                <h3 className="font-bold mb-3 uppercase text-sm">Shortcuts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Start/Pause</span>
                    <kbd className="px-2 py-0.5 border border-foreground font-mono text-xs">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Stop</span>
                    <kbd className="px-2 py-0.5 border border-foreground font-mono text-xs">Esc</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Reset</span>
                    <kbd className="px-2 py-0.5 border border-foreground font-mono text-xs">R</kbd>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-2 shadow-2xs hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-2 border-foreground">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold uppercase tracking-wide">Account</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  লগ আউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
