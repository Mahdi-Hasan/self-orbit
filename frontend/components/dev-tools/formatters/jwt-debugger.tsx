"use client";

import { useState } from "react";

interface DecodedPart {
    label: string;
    className: string;
    content?: string;
    error?: string;
}

export default function JwtDebugger() {
    const [input, setInput] = useState("");
    const [parts, setParts] = useState<DecodedPart[]>([]);
    const [error, setError] = useState("");

    const handleDebug = () => {
        const sections = input.trim().split(".");
        if (sections.length !== 3) {
            setError("JWT must have 3 parts (header.payload.signature)");
            setParts([]);
            return;
        }

        const decoded: DecodedPart[] = [];
        const labels = ["Header", "Payload", "Signature"];
        const classNames = ["jwt-header", "jwt-payload", "jwt-signature"];

        try {
            sections.forEach((section, idx) => {
                try {
                    if (idx === 2) {
                        decoded.push({
                            label: labels[idx],
                            className: classNames[idx],
                            content: section,
                        });
                    } else {
                        const decoded64 = atob(section);
                        const json = JSON.stringify(JSON.parse(decoded64), null, 2);
                        decoded.push({
                            label: labels[idx],
                            className: classNames[idx],
                            content: json,
                        });
                    }
                } catch (e) {
                    decoded.push({
                        label: labels[idx],
                        className: classNames[idx],
                        error: "Decode error",
                    });
                }
            });
            setParts(decoded);
            setError("");
        } catch (e) {
            setError("Parse error");
            setParts([]);
        }
    };

    return (
        <>
            <div className="tool-io-panel" style={{ marginBottom: 20 }}>
                <div className="tool-io-label">JWT Token</div>
                <textarea
                    className="tool-io-area"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your JWT here..."
                    rows={6}
                />
            </div>

            {error && <div className="code-display error" style={{ marginBottom: 20 }}>{error}</div>}

            {parts.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    {parts.map((part, idx) => (
                        <div key={idx} className="jwt-section">
                            <div className="jwt-section-title">{part.label}</div>
                            <div className={`jwt-section-content ${part.className}`}>
                                {part.error ? <span style={{ color: "var(--danger)" }}>{part.error}</span> : part.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="tool-controls">
                <button className="btn btn-primary" onClick={handleDebug}>Decode JWT</button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(input)}
                    disabled={!input}
                >Copy Token</button>
                <button className="btn btn-secondary" onClick={() => {
                    setInput("");
                    setParts([]);
                    setError("");
                }}>Clear</button>
            </div>
        </>
    );
}