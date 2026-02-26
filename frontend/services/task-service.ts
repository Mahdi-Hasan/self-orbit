import { apiClient } from "./api-client";
import type { TaskItem, CreateTaskRequest, UpdateTaskStatusRequest } from "@/types/task";

export const taskService = {
    getAll: () => apiClient.get<TaskItem[]>("/tasks"),

    getById: (id: string) => apiClient.get<TaskItem>(`/tasks/${id}`),

    create: (data: CreateTaskRequest) =>
        apiClient.post<string>("/tasks", data),

    updateStatus: (id: string, data: UpdateTaskStatusRequest) =>
        apiClient.patch<string>(`/tasks/${id}/status`, data),
};
