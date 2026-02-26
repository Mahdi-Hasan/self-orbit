"use client";

import { useState } from "react";

type Mode = "encode" | "decode";

export default function Base64Codec() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<Mode>("encode");
    const [error, setError] = useState("");

    const handleConvert = () => {
        try {
            if (mode === "encode") {
                const encoded = btoa(input);
                setOutput(encoded);
            } else {
                const decoded = atob(input);
                setOutput(decoded);
            }
            setError("");
        } catch (e) {
            setOutput("");
            setError(e instanceof Error ? e.message : "Conversion failed");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setInput(result.split(",")[1] || result);
            setMode("decode");
        };
        reader.readAsDataURL(file);
    };

    const toggleMode = () => {
        setMode(mode === "encode" ? "decode" : "encode");
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
                        placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
                        rows={14}
                    />
                </div>
                <div className="tool-io-panel">
                    <div className="tool-io-label">Output</div>
                    {error ? (
                        <div className="code-display error">{error}</div>
                    ) : output ? (
                        <div className="code-display success">{output}</div>
                    ) : (
                        <div style={{ color: "var(--text-muted)" }}>Output will appear here</div>
                    )}
                </div>
            </div>

            <div className="tool-controls">
                <div className="tool-control-group">
                    <button className="tool-toggle" onClick={toggleMode}>
                        {mode === "encode" ? "Encode" : "Decode"} Mode
                    </button>
                </div>
                <button className="btn btn-primary" onClick={handleConvert}>
                    {mode === "encode" ? "Encode" : "Decode"}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(output)}
                    disabled={!output}
                >
                    Copy Output
                </button>
                <label className="btn btn-secondary" style={{ cursor: "pointer" }}>
                    📁 Upload File
                    <input
                        type="file"
                        onChange={handleFileSelect}
                        style={{ display: "none" }}
                    />
                </label>
                <button className="btn btn-secondary" onClick={() => {
                    setInput("");
                    setOutput("");
                    setError("");
                }}>
                    Clear
                </button>
            </div>
        </>
    );
}