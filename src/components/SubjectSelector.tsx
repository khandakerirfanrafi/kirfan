import { Subject } from "@/hooks/useStudySessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelect: (subject: Subject) => void;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
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

  const handleAdd = () => {
    if (newSubjectName.trim()) {
      onAdd(newSubjectName.trim());
      setNewSubjectName("");
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">Subjects</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="relative group">
            <Button
              variant={selectedSubject?.id === subject.id ? "default" : "outline"}
              onClick={() => onSelect(subject)}
              className="border-2 shadow-2xs hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all pr-8"
            >
              <span
                className="w-3 h-3 border border-foreground mr-2"
                style={{ backgroundColor: subject.color }}
              />
              {subject.name}
            </Button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(subject.id);
              }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-foreground"
              aria-label={`Remove ${subject.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="flex gap-2">
          <Input
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Subject name..."
            className="border-2"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <Button onClick={handleAdd} className="border-2 shadow-2xs">
            Add
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
          className="gap-2 border-2 shadow-2xs hover:shadow-xs hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
      )}
    </div>
  );
}
