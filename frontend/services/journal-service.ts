import { apiClient } from "./api-client";
import type { JournalEntry, CreateJournalRequest } from "@/types/journal";

export const journalService = {
    getAll: () => apiClient.get<JournalEntry[]>("/journal"),

    getById: (id: string) => apiClient.get<JournalEntry>(`/journal/${id}`),

    create: (data: CreateJournalRequest) =>
        apiClient.post<string>("/journal", data),

    uploadAudio: (file: File) =>
        apiClient.upload<string>("/journal/audio", file),
};
