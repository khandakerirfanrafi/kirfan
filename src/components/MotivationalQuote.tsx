import { memo } from "react";
import { Quote } from "lucide-react";
import { useMotivationalQuote } from "@/hooks/useMotivationalQuote";

export const MotivationalQuote = memo(function MotivationalQuote() {
  const quote = useMotivationalQuote();

  return (
    <div className="border-2 border-dashed border-muted-foreground/50 p-4 bg-secondary/30">
      <div className="flex gap-3">
        <Quote className="w-5 h-5 flex-shrink-0 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm italic leading-relaxed">"{quote.text}"</p>
          <p className="text-xs text-muted-foreground">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
});
