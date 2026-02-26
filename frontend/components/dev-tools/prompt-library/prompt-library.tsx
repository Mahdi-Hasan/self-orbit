"use client";

import { useState, useEffect } from "react";
import { promptStorage, type Prompt, type PromptVersion, type ContextSnippet } from "./prompt-storage";
import PromptEditor from "./prompt-editor";

export default function PromptLibrary() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>(undefined);
    const [showVersions, setShowVersions] = useState(false);

    useEffect(() => {
        const loadPrompts = () => {
            const all = promptStorage.getPrompts();
            setPrompts(all);
        };
        loadPrompts();
    }, []);

    const filteredPrompts = prompts.filter((p) => {
        const categoryMatch = !selectedCategory || p.category === selectedCategory;
        const searchMatch =
            !searchQuery ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return categoryMatch && searchMatch;
    });

    const categories = ["General", "Refactoring", "Unit Tests", ...(new Set(prompts.map((p) => p.category)))].filter((c, i, a) => a.indexOf(c) === i);

    const handleSavePrompt = (prompt: Prompt) => {
        setIsEditing(false);
        setEditingPrompt(undefined);
        const all = promptStorage.getPrompts();
        const exists = all.some((p) => p.id === prompt.id);
        if (!exists) {
            setPrompts([...all, prompt]);
        } else {
            setPrompts(all.map((p) => (p.id === prompt.id ? prompt : p)));
        }
    };

    const handleEditPrompt = (prompt: Prompt) => {
        setEditingPrompt(prompt);
        setIsEditing(true);
    };

    const handleDeletePrompt = (id: string) => {
        if (!confirm("Delete this prompt?")) return;
        promptStorage.deletePrompt(id);
        setPrompts(prompts.filter((p) => p.id !== id));
        if (selectedPromptId === id) setSelectedPromptId(null);
    };

    const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);

    const handleCreateSnippet = () => {
        const title = prompt(`Enter snippet name:`);
        if (!title) return;
        const content = prompt("Enter snippet content:");
        if (!content) return;

        const snippet = promptStorage.createSnippet({ title, content, category: "Custom" });
        alert(`Snippet "${title}" created!`);
    };

    if (isEditing) {
        return (
            <PromptEditor
                prompt={editingPrompt}
                onSave={handleSavePrompt}
                onCancel={() => {
                    setIsEditing(false);
                    setEditingPrompt(undefined);
                }}
            />
        );
    }

    return (
        <div className="prompt-library-container">
            {/* Left Sidebar – Categories */}
            <div className="prompt-sidebar">
                <div className="prompt-sidebar-section">
                    <div className="prompt-sidebar-title">Categories</div>
                    <div className="prompt-category-list">
                        <button
                            className={`prompt-category ${selectedCategory === null ? "active" : ""}`}
                            onClick={() => setSelectedCategory(null)}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`prompt-category ${selectedCategory === cat ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="prompt-sidebar-section">
                    <div className="prompt-sidebar-title">Actions</div>
                    <button className="btn btn-primary" style={{ width: "100%", marginBottom: 8 }} onClick={() => setEditingPrompt(true)}>
                        + New Prompt
                    </button>
                    <button className="btn btn-secondary" style={{ width: "100%", fontSize: 11, padding: "8px" }} onClick={handleCreateSnippet}>
                        + Create Snippet
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="prompt-main">
                {/* Search */}
                <div style={{ marginBottom: 16 }}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search prompts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Prompt List */}
                <div className="prompt-list">
                    {filteredPrompts.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                            No prompts found
                        </div>
                    ) : (
                        filteredPrompts.map((prompt) => (
                            <div key={prompt.id} className="prompt-item" onClick={() => setSelectedPromptId(prompt.id)}>
                                <div className="prompt-item-info">
                                    <div className="prompt-item-title">{prompt.title}</div>
                                    <div className="prompt-item-meta">
                                        {prompt.category} • {prompt.tags.join(", ")}
                                    </div>
                                </div>
                                <div className="prompt-item-actions" onClick={(e) => e.stopPropagation()}>
                                    <button className="prompt-item-btn" onClick={() => handleEditPrompt(prompt)}>✏️</button>
                                    <button className="prompt-item-btn" onClick={() => handleDeletePrompt(prompt.id)}>🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Selected Prompt Detail */}
                {selectedPrompt && (
                    <div style={{ marginTop: 20 }}>
                        <div className="card">
                            <h3 style={{ marginBottom: 8 }}>{selectedPrompt.title}</h3>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                                Updated {new Date(selectedPrompt.updatedAt).toLocaleString()}
                            </div>
                            <div className="code-display" style={{ fontSize: 13, lineHeight: 1.6 }}>
                                {selectedPrompt.content}
                            </div>

                            {selectedPrompt.versions.length > 1 && (
                                <div className="prompt-versions">
                                    <h4 style={{ fontSize: 12, marginBottom: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        Version History ({selectedPrompt.versions.length})
                                    </h4>
                                    <div className="prompt-version-list">
                                        {selectedPrompt.versions.slice().reverse().map((v, i) => (
                                            <div key={v.id} className="prompt-version-item">
                                                <div className="prompt-version-info">
                                                    <span style={{ fontWeight: 600 }}>v{selectedPrompt.versions.length - i}</span>
                                                    <span className="prompt-version-date">
                                                        {new Date(v.createdAt).toLocaleString()}
                                                    </span>
                                                    <span className="prompt-version-note">{v.note}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}