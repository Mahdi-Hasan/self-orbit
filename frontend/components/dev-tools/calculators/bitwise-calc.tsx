"use client";

import { useState } from "react";

type Operation = "AND" | "OR" | "XOR" | "NOT" | "LSHIFT" | "RSHIFT";

export default function BitwiseCalc() {
    const [operand1, setOperand1] = useState("");
    const [operand2, setOperand2] = useState("");
    const [operation, setOperation] = useState<Operation>("AND");
    const [result, setResult] = useState("");

    const parseBigInt = (s: string): bigint | null => {
        try {
            const cleaned = s.replace(/[^0-9A-Fa-f]/g, "");
            if (!cleaned) return 0n;
            return BigInt("0o0" + cleaned);
        } catch {
            return null;
        }
    };

    const compute = () => {
        const n1 = parseBigInt(operand1);
        const n2 = parseBigInt(operand2);
        if (n1 === null || n2 === null) {
            setResult("Invalid input");
            return;
        }

        let r: bigint;
        switch (operation) {
            case "AND":
                r = n1 & n2;
                break;
            case "OR":
                r = n1 | n2;
                break;
            case "XOR":
                r = n1 ^ n2;
                break;
            case "NOT":
                r = ~n1;
                break;
            case "LSHIFT":
                r = n1 << Number(n2);
                break;
            case "RSHIFT":
                r = n1 >> Number(n2);
                break;
            default:
                r = 0n;
        }

        setResult(r.toString(10));
    };

    return (
        <>
            <div className="tool-input-row">
                <div className="tool-input-group">
                    <label>Operand 1 (Decimal)</label>
                    <input
                        type="text"
                        className="input"
                        value={operand1}
                        onChange={(e) => setOperand1(e.target.value)}
                        placeholder="e.g. 10"
                        onKeyUp={compute}
                    />
                </div>
                <div className="tool-input-group">
                    <label>Operand 2 (Decimal)</label>
                    <input
                        type="text"
                        className="input"
                        value={operand2}
                        onChange={(e) => setOperand2(e.target.value)}
                        placeholder={operation === "NOT" ? "N/A for NOT" : "e.g. 5"}
                        disabled={operation === "NOT"}
                        onKeyUp={compute}
                    />
                </div>
            </div>

            <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--text-secondary)" }}>Operation</label>
                <select
                    className="tool-select"
                    style={{ width: "100%", marginTop: 8 }}
                    value={operation}
                    onChange={(e) => setOperation(e.target.value as Operation)}
                >
                    <option value="AND">AND (&)</option>
                    <option value="OR">OR (|)</option>
                    <option value="XOR">XOR (^)</option>
                    <option value="NOT">NOT (~)</option>
                    <option value="LSHIFT">Left Shift (<<)</option>
                    <option value="RSHIFT">Right Shift (>>)</option>
                </select>
            </div>

            <div className="tool-input-group" style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 14, fontWeight: 600 }}>Result (Decimal)</label>
                <input
                    type="text"
                    className="input"
                    value={result || "Click 'Calculate' or press Enter"}
                    readOnly
                />
            </div>

            <h3 style={{ marginBottom: 12, fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Binary Representations
            </h3>

            <div style={{ background: "var(--bg-secondary)", padding: 14, borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontSize: 12, marginBottom: 8 }}>
                    <span style={{ color: "var(--text-muted)" }}>Op1:</span> {parseBigInt(operand1)?.toString(2) || "-"}
                </div>
                <div style={{ fontSize: 12, marginBottom: 8 }}>
                    <span style={{ color: "var(--text-muted)" }}>Op2:</span> {parseBigInt(operand2)?.toString(2) || "-"}
                </div>
                <div style={{ fontSize: 12 }}>
                    <span style={{ color: "var(--text-muted)" }}>Result:</span> {result ? parseBigInt(result)?.toString(2) || "-" : "-"}
                </div>
            </div>

            <div className="tool-controls">
                <button className="btn btn-primary" onClick={compute}>Calculate</button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(result)}
                    disabled={!result}
                >
                    Copy Result
                </button>
                <button className="btn btn-secondary" onClick={() => {
                    setOperand1("");
                    setOperand2("");
                    setResult("");
                }}>
                    Clear
                </button>
            </div>
        </>
    );
}