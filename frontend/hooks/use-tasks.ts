"use client";

import { useState, useEffect, useCallback } from "react";
import { taskService } from "@/services/task-service";
import type { TaskItem } from "@/types/task";

export function useTasks() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await taskService.getAll();
            setTasks(response.data ?? []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { tasks, loading, error, refetch: fetchTasks };
}
