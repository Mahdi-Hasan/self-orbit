import { apiClient } from "./api-client";
import type { Expense, CreateExpenseRequest, Budget, SetBudgetRequest } from "@/types/expense";

export const expenseService = {
    getAll: (params?: { from?: string; to?: string; categoryId?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.from) searchParams.set("from", params.from);
        if (params?.to) searchParams.set("to", params.to);
        if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
        const query = searchParams.toString();
        return apiClient.get<Expense[]>(`/expenses${query ? `?${query}` : ""}`);
    },

    getById: (id: string) => apiClient.get<Expense>(`/expenses/${id}`),

    create: (data: CreateExpenseRequest) =>
        apiClient.post<string>("/expenses", data),

    // Budget operations
    getBudgets: () => apiClient.get<Budget[]>("/budgets"),

    setBudget: (data: SetBudgetRequest) =>
        apiClient.post<string>("/budgets", data),
};
