export interface TaskItem {
    id: string;
    title: string;
    description?: string;
    status: "Pending" | "InProgress" | "Completed" | "Cancelled";
    priority: "Urgent" | "High" | "Medium" | "Low";
    deadline?: string;
    completedAt?: string;
    tags: string[];
    estimatedDuration?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateTaskRequest {
    rawText: string;
    timezone?: string;
}

export interface UpdateTaskStatusRequest {
    status: string;
}
