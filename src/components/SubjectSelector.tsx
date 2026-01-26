import { Subject } from "@/hooks/useCloudStudySessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelect: (subject: Subject) => void;
  onAdd: (name: string) => Promise<Subject | null> | void;
  onRemove: (id: string) => Promise<void> | void;
}

export function SubjectSelector({
  subjects,
  selectedSubject,
  onSelect,
  onAdd,
  onRemove,
}: SubjectSelectorProps) {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (newSubjectName.trim()) {
      setIsLoading(true);
      await onAdd(newSubjectName.trim());
      setNewSubjectName("");
      setIsAdding(false);
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setIsLoading(true);
    await onRemove(id);
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
        <span className="w-6 h-0.5 bg-foreground" />
        Subjects
      </h2>
      
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
        {subjects.map((subject) => {
          const isSelected = selectedSubject?.id === subject.id;
          return (
            <div key={subject.id} className="relative group">
              <Button
                variant={isSelected ? "default" : "outline"}
                onClick={() => onSelect(subject)}
                className={`border-2 shadow-2xs hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all pr-8 ${
                  isSelected ? "shadow-sm" : ""
                }`}
              >
                <span
                  className="w-3 h-3 border border-foreground mr-2 flex-shrink-0"
                  style={{ backgroundColor: subject.color }}
                />
                {subject.name}
                {isSelected && <Check className="w-4 h-4 ml-2" />}
              </Button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(subject.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-2 border-foreground"
                aria-label={`Remove ${subject.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {isAdding ? (
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Input
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Subject name..."
            className="border-2 flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <Button onClick={handleAdd} className="border-2 shadow-2xs" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsAdding(false);
              setNewSubjectName("");
            }}
            className="border-2"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="gap-2 border-2 border-dashed shadow-2xs hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
      )}
    </div>
  );
}
