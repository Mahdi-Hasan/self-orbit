// TypeScript interfaces matching backend DTOs

export interface Expense {
    id: string;
    amount: number;
    currency: string;
    description: string;
    merchant?: string;
    expenseDate: string;
    status: "Draft" | "Confirmed" | "Archived";
    categoryId: string;
    categoryName?: string;
    tags: string[];
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateExpenseRequest {
    rawText: string;
    currency?: string;
    categoryId?: string;
    notes?: string;
}

export interface Budget {
    id: string;
    limitAmount: number;
    currency: string;
    currentSpend: number;
    period: "Daily" | "Weekly" | "Monthly" | "Yearly";
    categoryId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    remainingAmount: number;
    utilizationPercentage: number;
}

export interface SetBudgetRequest {
    limitAmount: number;
    currency: string;
    period: "Daily" | "Weekly" | "Monthly" | "Yearly";
    categoryId: string;
}
