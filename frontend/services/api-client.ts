/**
 * Typed API client with error handling.
 * All requests go through the gateway via Next.js rewrites.
 */

import type { ApiResponse } from "@/types/api";

const BASE_URL = "/api/v1";

class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            code: "UNKNOWN",
            message: "An unexpected error occurred",
        }));
        throw new ApiError(response.status, error.code, error.message);
    }

    return response.json();
}

export const apiClient = {
    get: <T>(endpoint: string) => request<T>(endpoint),

    post: <T>(endpoint: string, data: unknown) =>
        request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    patch: <T>(endpoint: string, data: unknown) =>
        request<T>(endpoint, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    delete: <T>(endpoint: string) =>
        request<T>(endpoint, { method: "DELETE" }),

    upload: <T>(endpoint: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return request<T>(endpoint, {
            method: "POST",
            headers: {},
            body: formData,
        });
    },
};

export { ApiError };
