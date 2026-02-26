"use client";

import { useState, useMemo } from "react";

export default function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState("g");
    const [testString, setTestString] = useState("");
    const [matches, setMatches] = useState<{ match: string; index: number; groups: string[] }[]>([]);
    const [error, setError] = useState("");

    const testRegex = () => {
        if (!pattern) {
            setError("Pattern required");
            setMatches([]);
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const testStr = testString || "Enter test text above to see matches";
            const matchResults: { match: string; index: number; groups: string[] }[] = [];
            let result;

            if (flags.includes("g")) {
                while ((result = regex.exec(testStr)) !== null) {
                    matchResults.push({
                        match: result[0],
                        index: result.index,
                        groups: Array.from(result).slice(1),
                    });
                    if (regex.lastIndex === 0) break;
                }
            } else {
                result = regex.exec(testStr);
                if (result) {
                    matchResults.push({
                        match: result[0],
                        index: result.index,
                        groups: Array.from(result).slice(1),
                    });
                }
            }

            setMatches(matchResults);
            setError("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid regex");
            setMatches([]);
        }
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <label className="tool-io-label">Regex Pattern</label>
                <input
                    type="text"
                    className="input"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    onKeyUp={testRegex}
                    placeholder="e.g. \\b[A-Z]\\w+\\b"
                />
            </div>

            <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4, display: "block" }}>
                    Flags
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className={`tool-toggle ${flags.includes("g") ? "active" : ""}`} onClick={() => {
                        setFlags(flags.includes("g") ? flags.replace("g", "") : flags + "g");
                        testRegex();
                    }}>Global (g)</button>
                    <button className={`tool-toggle ${flags.includes("i") ? "active" : ""}`} onClick={() => {
                        setFlags(flags.includes("i") ? flags.replace("i", "") : flags + "i");
                        testRegex();
                    }}>Case-insensitive (i)</button>
                    <button className={`tool-toggle ${flags.includes("m") ? "active" : ""}`} onClick={() => {
                        setFlags(flags.includes("m") ? flags.replace("m", "") : flags + "m");
                        testRegex();
                    }}>Multiline (m)</button>
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <label className="tool-io-label">Test Text</label>
                <textarea
                    className="tool-io-area"
                    value={testString}
                    onChange={(e) => {
                        setTestString(e.target.value);
                        testRegex();
                    }}
                    placeholder="Enter text to test the regex against..."
                    rows={6}
                />
            </div>

            {error && <div className="code-display error" style={{ marginBottom: 16 }}>{error}</div>}

            {matches.length > 0 && (
                <div className="regex-output" style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, marginBottom: 8, color: "var(--text-muted)" }}>
                        Found {matches.length} {matches.length !== 1 ? "matches" : "match"}
                    </div>
                    {matches.map((m, i) => (
                        <div key={i} className="regex-group">
                            <div className="regex-group-title">Match #{i + 1} (index {m.index})</div>
                            <div className="regex-group-value" style={{ fontWeight: 600, marginBottom: 4 }}>
                                <span className="regex-match">{m.match}</span>
                            </div>
                            {m.groups.length > 0 && (
                                <div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Captured Groups:</div>
                                    {m.groups.map((g, j) => (
                                        <div key={j} style={{ marginLeft: 12, fontSize: 12 }}>
                                            ${j + 1}: {g}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {pattern && !error && matches.length === 0 && (
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    No matches found
                </div>
            )}

            <div className="tool-controls">
                <button className="btn btn-secondary" onClick={testRegex}>Test</button>
                <button className="btn btn-secondary" onClick={() => {
                    setPattern("");
                    setFlags("g");
                    setTestString("");
                    setMatches([]);
                    setError("");
                }}>Clear</button>
            </div>
        </>
    );
}