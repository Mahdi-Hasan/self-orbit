/**
 * Utility functions for formatting and data manipulation.
 */

export function formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
}

export function truncate(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}…`;
}

export function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
        Urgent: "#ef4444",
        High: "#f97316",
        Medium: "#eab308",
        Low: "#22c55e",
    };
    return colors[priority] ?? "#6b7280";
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        Pending: "#6366f1",
        InProgress: "#3b82f6",
        Completed: "#10b981",
        Cancelled: "#6b7280",
        Draft: "#6366f1",
        Confirmed: "#10b981",
        Archived: "#6b7280",
    };
    return colors[status] ?? "#6b7280";
}
