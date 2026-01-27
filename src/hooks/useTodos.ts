import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching todos:", error);
      return;
    }

    setTodos(
      data.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        createdAt: new Date(t.created_at),
      }))
    );
  }, [user]);

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTodos();
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user, fetchTodos]);

  // Add todo
  const addTodo = useCallback(
    async (title: string) => {
      if (!user || !title.trim()) return null;

      const { data, error } = await supabase
        .from("todos")
        .insert({
          user_id: user.id,
          title: title.trim(),
        })
        .select()
        .single();

      if (error) {
        toast.error("টুডু যোগ করতে ব্যর্থ");
        console.error("Error adding todo:", error);
        return null;
      }

      const newTodo: Todo = {
        id: data.id,
        title: data.title,
        completed: data.completed,
        createdAt: new Date(data.created_at),
      };

      setTodos((prev) => [newTodo, ...prev]);
      return newTodo;
    },
    [user]
  );

  // Toggle todo
  const toggleTodo = useCallback(
    async (id: string) => {
      if (!user) return;

      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", id);

      if (error) {
        toast.error("টুডু আপডেট করতে ব্যর্থ");
        console.error("Error toggling todo:", error);
        return;
      }

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    },
    [user, todos]
  );

  // Delete todo
  const deleteTodo = useCallback(
    async (id: string) => {
      if (!user) return;

      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) {
        toast.error("টুডু মুছতে ব্যর্থ");
        console.error("Error deleting todo:", error);
        return;
      }

      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [user]
  );

  // Stats
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    completedCount,
    pendingCount,
    refetch: fetchTodos,
  };
}
