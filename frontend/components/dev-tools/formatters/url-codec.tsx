"use client";

import { useState, useEffect } from "react";

export default function UrlCodec() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");

    useEffect(() => {
        try {
            const result = input && mode === "encode" ? encodeURIComponent(input) : mode === "decode" && input ? decodeURIComponent(input) : "";
            setOutput(result);
        } catch (e) {
            setOutput("Invalid input");
        }
    }, [input, mode]);

    const toggle = () => setMode(mode === "encode" ? "decode" : "encode");

    return (
        <>
            <div className="tool-io">
                <div className="tool-io-panel">
                    <div className="tool-io-label">{mode === "encode" ? "Plain Text" : "Encoded URL"}</div>
                    <textarea
                        className="tool-io-area"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === "encode" ? "Enter text to encode..." : "Paste encoded URL to decode..."}
                        rows={14}
                    />
                </div>
                <div className="tool-io-panel">
                    <div className="tool-io-label">{mode === "encode" ? "Encoded URL" : "Decoded Text"}</div>
                    <div className="code-display">
                        {output || "Output will appear here"}
                    </div>
                </div>
            </div>

            <div className="tool-controls">
                <div className="tool-control-group">
                    <button className={`tool-toggle ${mode === "encode" ? "active" : ""}`} onClick={() => setMode("encode")}>Encode</button>
                    <button className={`tool-toggle ${mode === "decode" ? "active" : ""}`} onClick={() => setMode("decode")}>Decode</button>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(output)}
                    disabled={!output}
                >
                    Copy Output
                </button>
                <button className="btn btn-secondary" onClick={() => {
                    setInput("");
                    setOutput("");
                }}>
                    Clear
                </button>
            </div>
        </>
    );
}