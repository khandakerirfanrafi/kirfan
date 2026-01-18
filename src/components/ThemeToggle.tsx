import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const saved = localStorage.getItem("akta-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    if (newValue) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("akta-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("akta-theme", "light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      className="border-2 shadow-2xs hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
