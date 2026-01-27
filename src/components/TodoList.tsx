import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export function TodoList() {
  const { todos, loading, addTodo, toggleTodo, deleteTodo, pendingCount } = useTodos();
  const [newTodo, setNewTodo] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    setIsAdding(true);
    await addTodo(newTodo);
    setNewTodo("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAdding) {
      handleAdd();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <ListTodo className="w-4 h-4" />
            টুডু লিস্ট
          </h3>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-muted border-2 border-border" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <ListTodo className="w-4 h-4" />
          টুডু লিস্ট
        </h3>
        {pendingCount > 0 && (
          <Badge variant="secondary" className="font-mono">
            {pendingCount} বাকি
          </Badge>
        )}
      </div>

      {/* Add new todo */}
      <div className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="নতুন টাস্ক যোগ করুন..."
          className="border-2 border-foreground bg-background text-sm"
          disabled={isAdding}
        />
        <Button
          onClick={handleAdd}
          disabled={!newTodo.trim() || isAdding}
          size="icon"
          variant="outline"
          className="border-2 border-foreground shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Todo list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {todos.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed border-border">
            কোনো টাস্ক নেই। উপরে নতুন টাস্ক যোগ করুন।
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "flex items-center gap-3 p-3 border-2 transition-all group",
                todo.completed
                  ? "border-border bg-muted/30"
                  : "border-foreground bg-background"
              )}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="border-2 border-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span
                className={cn(
                  "flex-1 text-sm transition-all",
                  todo.completed && "line-through text-muted-foreground"
                )}
              >
                {todo.title}
              </span>
              <Button
                onClick={() => deleteTodo(todo.id)}
                size="icon"
                variant="ghost"
                className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
