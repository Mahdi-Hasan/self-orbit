export interface JournalEntry {
    id: string;
    rawText?: string;
    transcribedText?: string;
    summary?: string;
    mood?: string;
    keyTopics: string[];
    entryType: "Text" | "Audio";
    audioUrl?: string;
    audioDurationSeconds?: number;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateJournalRequest {
    text: string;
}
