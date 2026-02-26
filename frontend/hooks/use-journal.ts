"use client";

import { useState, useEffect, useCallback } from "react";
import { journalService } from "@/services/journal-service";
import type { JournalEntry } from "@/types/journal";

export function useJournal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        try {
            setLoading(true);
            const response = await journalService.getAll();
            setEntries(response.data ?? []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load journal entries");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    return { entries, loading, error, refetch: fetchEntries };
}
