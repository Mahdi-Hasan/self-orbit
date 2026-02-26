"use client";

import { useState } from "react";

export default function SqlFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const formatSql = (sql: string) => {
        const keywords = ["SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "INSERT", "UPDATE", "DELETE", "SET", "VALUES", "CREATE", "DROP", "ALTER", "TABLE", "AND", "OR", "NOT", "IN", "EXISTS", "UNION", "EXCEPT", "INTERSECT"];
        let result = sql.toUpperCase();
        
        // Add newlines before major keywords
        keywords.forEach((kw) => {
            const regex = new RegExp(`\\s+${kw}\\s+`, "gi");
            result = result.replace(regex, `\n${kw} `);
        });

        // Indent nested parts
        const lines = result.split("\n");
        const formatted = lines.map((line) => {
            const trimmed = line.trim();
            if (trimmed.match(/^(SELECT|FROM|WHERE|ORDER|GROUP|HAVING|LIMIT)/)) {
                return trimmed;
            }
            return "  " + trimmed;
        });

        return formatted.filter((line) => line.trim()).join("\n");
    };

    const handleFormat = () => {
        const formatted = formatSql(input);
        setOutput(formatted);
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
                        placeholder="Paste raw SQL here..."
                        rows={14}
                    />
                </div>
                <div className="tool-io-panel">
                    <div className="tool-io-label">Output</div>
                    <div className="code-display">
                        {output || "Formatted SQL will appear here"}
                    </div>
                </div>
            </div>

            <div className="tool-controls">
                <button className="btn btn-primary" onClick={handleFormat}>
                    Format SQL
                </button>
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