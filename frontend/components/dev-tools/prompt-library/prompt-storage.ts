export interface Prompt {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    versions: PromptVersion[];
    createdAt: string;
    updatedAt: string;
}

export interface PromptVersion {
    id: string;
    content: string;
    note: string;
    createdAt: string;
}

export interface ContextSnippet {
    id: string;
    title: string;
    content: string;
    category: string;
}

const STORAGE_KEY = "self-orbit:prompt-library";
const SNIPPETS_KEY = "self-orbit:prompt-snippets";

export const promptStorage = {
    // Prompts CRUD
    getPrompts: (): Prompt[] => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    savePrompts: (prompts: Prompt[]) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    },

    createPrompt: (prompt: Omit<Prompt, "id" | "versions" | "createdAt" | "updatedAt">): Prompt => {
        const prompts = promptStorage.getPrompts();
        const newPrompt: Prompt = {
            ...prompt,
            id: crypto.randomUUID(),
            versions: [{
                id: crypto.randomUUID(),
                content: prompt.content,
                note: "Initial version",
                createdAt: new Date().toISOString(),
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        prompts.push(newPrompt);
        promptStorage.savePrompts(prompts);
        return newPrompt;
    },

    updatePrompt: (id: string, updates: Partial<Omit<Prompt, "id" | "versions" | "createdAt">>): Prompt | null => {
        const prompts = promptStorage.getPrompts();
        const idx = prompts.findIndex((p) => p.id === id);
        if (idx === -1) return null;

        const oldPrompt = prompts[idx];
        const newContent = updates.content ?? oldPrompt.content;

        // Create new version if content changed
        const newVersions = newContent !== oldPrompt.content
            ? [...oldPrompt.versions, {
                id: crypto.randomUUID(),
                content: newContent,
                note: updates.versionNote || "Updated",
                createdAt: new Date().toISOString(),
            },
            ]
            : oldPrompt.versions;

        prompts[idx] = {
            ...oldPrompt,
            ...updates,
            versions: newVersions,
            updatedAt: new Date().toISOString(),
        };

        promptStorage.savePrompts(prompts);
        return prompts[idx];
    },

    deletePrompt: (id: string): boolean => {
        const prompts = promptStorage.getPrompts();
        const filtered = prompts.filter((p) => p.id !== id);
        promptStorage.savePrompts(filtered);
        return filtered.length < prompts.length;
    },

    getCategories: (): string[] => {
        const prompts = promptStorage.getPrompts();
        return [...new Set(prompts.map((p) => p.category)).add("General").add("Refactoring").add("Unit Tests")];
    },

    // Snippets CRUD
    getSnippets: (): ContextSnippet[] => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(SNIPPETS_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    saveSnippets: (snippets: ContextSnippet[]) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(SNIPPETS_KEY, JSON.stringify(snippets));
    },

    createSnippet: (snippet: Omit<ContextSnippet, "id">): ContextSnippet => {
        const snippets = promptStorage.getSnippets();
        const newSnippet: ContextSnippet = { ...snippet, id: crypto.randomUUID() };
        snippets.push(newSnippet);
        promptStorage.saveSnippets(snippets);
        return newSnippet;
    },

    deleteSnippet: (id: string): boolean => {
        const snippets = promptStorage.getSnippets();
        const filtered = snippets.filter((s) => s.id !== id);
        promptStorage.saveSnippets(filtered);
        return filtered.length < snippets.length;
    },

    getSnippetCategories: (): string[] => {
        const snippets = promptStorage.getSnippets();
        return [...new Set(snippets.map((s) => s.category)).add("System").add("Style Guides")];
    },
};

// Extract variable placeholders from prompt
export const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map((m) => m.replace(/\{|\}/g, "")))];
};

// Fill variables in template
export const fillTemplate = (content: string, values: Record<string, string>): string => {
    let filled = content;
    Object.entries(values).forEach(([key, value]) => {
        filled = filled.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    });
    return filled;
};