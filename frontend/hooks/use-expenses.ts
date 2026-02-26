"use client";

import { useState, useEffect, useCallback } from "react";
import { expenseService } from "@/services/expense-service";
import type { Expense, Budget } from "@/types/expense";

export function useExpenses(params?: { from?: string; to?: string; categoryId?: string }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await expenseService.getAll(params);
            setExpenses(response.data ?? []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load expenses");
        } finally {
            setLoading(false);
        }
    }, [params?.from, params?.to, params?.categoryId]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    return { expenses, loading, error, refetch: fetchExpenses };
}

export function useBudgets() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        expenseService
            .getBudgets()
            .then((res) => setBudgets(res.data ?? []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return { budgets, loading };
}
