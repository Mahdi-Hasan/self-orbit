"use client";

import { useState, useEffect } from "react";
import { promptStorage, extractVariables, fillTemplate, type Prompt, type ContextSnippet } from "./prompt-storage";

interface PromptEditorProps {
    prompt?: Prompt;
    onSave: (prompt: Prompt) => void;
    onCancel: () => void;
}

export default function PromptEditor({ prompt, onSave, onCancel }: PromptEditorProps) {
    const [title, setTitle] = useState(prompt?.title ?? "");
    const [content, setContent] = useState(prompt?.content ?? "");
    const [category, setCategory] = useState(prompt?.category ?? "General");
    const [tags, setTags] = useState(prompt?.tags.join(", ") ?? "");
    const [versionNote, setVersionNote] = useState("");

    const [categories, setCategories] = useState<string[]>([]);
    const [variables, setVariables] = useState<string[]>([]);
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});

    useEffect(() => {
        setCategories(promptStorage.getCategories());
        setCategories(cats => [...new Set(cats).add(prompt?.category ?? "General").add("General")]);
    }, [prompt]);

    useEffect(() => {
        const vars = extractVariables(content);
        setVariables(vars);
        if (!prompt) {
            const newValues: Record<string, string> = {};
            vars.forEach(v => newValues[v] = "");
            setVariableValues(newValues);
        }
    }, [content, prompt]);

    const handleVariableChange = (varName: string, value: string) => {
        setVariableValues({ ...variableValues, [varName]: value });
    };

    const filledContent = fillTemplate(content, variableValues);
    const tagsList = tags.split(",").map((t) => t.trim()).filter(Boolean);

    const handleSave = () => {
        const updates = {
            title,
            content,
            category,
            tags: tagsList,
            versionNote,
        };

        if (prompt && prompt.id) {
            const updated = promptStorage.updatePrompt(prompt.id, updates);
            if (updated) onSave(updated);
        } else {
            const created = promptStorage.createPrompt(updates);
            onSave(created);
        }
    };

    const snippetCategories = promptStorage.getSnippetCategories();
    const snippets = promptStorage.getSnippets();
    const [selectedSnippets, setSelectedSnippets] = useState<ContextSnippet[]>([]);

    const insertSnippet = (snippet: ContextSnippet) => {
        setContent((prev) => prev + "\n\n" + snippet.content);
        setSelectedSnippets([...selectedSnippets, snippet]);
    };

    return (
        <div className="prompt-editor-container">
            <h4 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {prompt?.id ? "Edit Prompt" : "Create Prompt"}
            </h4>

            <div className="prompt-editor-field">
                <div className="prompt-editor-label">Title</div>
                <input
                    className="prompt-editor-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Prompt title..."
                />
            </div>

            <div className="prompt-editor-field">
                <div className="prompt-editor-label">Category</div>
                <select
                    className="prompt-editor-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="prompt-editor-field">
                <div className="prompt-editor-label">Content (use {{variable}} for placeholders)</div>
                <textarea
                    className="prompt-editor-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your prompt with {{variable}} placeholders..."
                />
            </div>

            <div className="prompt-editor-field">
                <div className="prompt-editor-label">Tags</div>
                <input
                    className="prompt-editor-input"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tag1, tag2, tag3..."
                />
            </div>

            {variables.length > 0 && (
                <div className="prompt-variables">
                    <div className="prompt-variables-title">Variables</div>
                    <div className="prompt-variable-inputs">
                        {variables.map((v) => (
                            <div key={v} className="prompt-variable-input">
                                <label>{`{{${v}}}`}</label>
                                <input
                                    value={variableValues[v] ?? ""}
                                    onChange={(e) => handleVariableChange(v, e.target.value)}
                                    placeholder={`Value for ${v}...`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {prompt && prompt.id && (
                <div className="prompt-editor-field">
                    <div className="prompt-editor-label">Version Note</div>
                    <input
                        className="prompt-editor-input"
                        value={versionNote}
                        onChange={(e) => setVersionNote(e.target.value)}
                        placeholder="What changed in this version..."
                    />
                </div>
            )}

            {Object.values(variableValues).some((v) => v?.length > 0) && (
                <div style={{ marginBottom: 16 }}>
                    <div className="prompt-editor-label">Preview (with filled variables)</div>
                    <div className="prompt-preview">{filledContent}</div>
                </div>
            )}

            <div className="prompt-editor-field">
                <div className="prompt-editor-label">Context Snippets</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    {snippets.map((s) => (
                        <button
                            key={s.id}
                            className="btn btn-secondary"
                            onClick={() => insertSnippet(s)}
                            style={{ fontSize: 11, padding: "4px 8px" }}
                        >
                            {s.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tool-controls">
                <button className="btn btn-primary" onClick={handleSave}>{prompt?.id ? "Save Changes" : "Create"}</button>
                <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}