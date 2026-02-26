"use client";

import { useState } from "react";

export default function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const handleFormat = () => {
        try {
            const parsed = typeof input === "string" ? JSON.parse(input) : input;
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setError("");
        } catch (e) {
            setOutput("");
            setError(e instanceof Error ? e.message : "Invalid JSON");
        }
    };

    const handleMinify = () => {
        try {
            const parsed = typeof input === "string" ? JSON.parse(input) : input;
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError("");
        } catch (e) {
            setOutput("");
            setError(e instanceof Error ? e.message : "Invalid JSON");
        }
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
        setError("");
    };

    return (
        <>
            <div className="tool-io">
                <div className="tool-io-panel">
                    <div className="tool-io-label">Input</div>
                    <textarea
                        className="tool-io-area"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste messy JSON here..."
                        rows={14}
                    />
                </div>
                <div className="tool-io-panel">
                    <div className="tool-io-label">Output</div>
                    {error ? (
                        <div className="code-display error">{error}</div>
                    ) : output ? (
                        <div className={`code-display ${output ? "success" : ""}`}>
                            {output}
                        </div>
                    ) : (
                        <div style={{ color: "var(--text-muted)" }}>Output will appear here</div>
                    )}
                </div>
            </div>

            <div className="tool-controls">
                <button className="btn btn-primary" onClick={handleFormat}>
                    Prettify
                </button>
                <button className="btn btn-secondary" onClick={handleMinify}>
                    Minify
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        navigator.clipboard.writeText(output);
                    }}
                    disabled={!output}
                >
                    Copy Output
                </button>
                <button className="btn btn-secondary" onClick={handleClear}>
                    Clear
                </button>
            </div>
        </>
    );
}