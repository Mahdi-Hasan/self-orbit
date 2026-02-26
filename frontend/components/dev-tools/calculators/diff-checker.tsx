"use client";

import { useState } from "react";

interface DiffLine {
    content: string;
    type: "added" | "removed" | "context";
    lineNumber?: number;
}

export default function DiffChecker() {
    const [textA, setTextA] = useState("");
    const [textB, setTextB] = useState("");
    const [diff, setDiff] = useState<DiffLine[]>([]);

    const computeDiff = () => {
        const linesA = textA.split("\n");
        const linesB = textB.split("\n");

        const lcs = (a: string[], b: string[]) => {
            const dp: number[][] = Array(a.length + 1).fill(0).map(() => Array(b.length + 1).fill(0));
            for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                    if (a[i - 1] === b[j - 1]) {
                        dp[i][j] = dp[i - 1][j - 1] + 1;
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                }
            }

            const result: string[] = [];
            let i = a.length;
            let j = b.length;
            while (i > 0 || j > 0) {
                if (i > 0 && a[i - 1] === b[j - 1]) {
                    result.unshift(a[i - 1]);
                    i--;
                    j--;
                } else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1])) {
                    j--;
                } else {
                    i--;
                }
            }
            return result;
        };

        const lcsResult = lcs(linesA, linesB);
        const result: DiffLine[] = [];
        let i = 0,
            j = 0;

        while (i < linesA.length || j < linesB.length) {
            const inLcs = lcsResult.length > 0 && lcsResult[0] === (i < linesA.length ? linesA[i] : "");
            if (inLcs) {
                const lcsStr = lcsResult.shift()!;
                result.push({ type: "context", content: lcsStr });
                i++;
                j++;
            } else if (i < linesA.length && (j >= linesB.length || linesA[i] !== linesB[j])) {
                result.push({ type: "removed", content: linesA[i], lineNumber: i + 1 });
                i++;
            } else {
                result.push({ type: "added", content: linesB[j], lineNumber: j + 1 });
                j++;
            }
        }

        setDiff(result);
    };

    const renderDiffLine = (line: DiffLine, idx: number) => {
        if (line.type === "context") {
            return <div key={idx} className="diff-line"><span className="diff-line-num">  </span><span className="diff-context">{line.content}</span></div>;
        }
        return (
            <div key={idx} className={`diff-line ${line.type}`}>
                <span className="diff-line-num">{line.lineNumber || ""}</span>
                <span className={line.type === "added" ? "diff-added" : "diff-removed"}>{line.content}</span>
            </div>
        );
    };

    return (
        <>
            <div className="diff-container">
                <div className="diff-input-group">
                    <div className="diff-panel-title">Original Text</div>
                    <textarea className="tool-io-area" value={textA} onChange={(e) => setTextA(e.target.value)} rows={16} />
                </div>
                <div className="diff-input-group">
                    <div className="diff-panel-title">New Text</div>
                    <textarea className="tool-io-area" value={textB} onChange={(e) => setTextB(e.target.value)} rows={16} />
                </div>
            </div>

            <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Diff Output
                </h4>
                {diff.length === 0 && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Diff will appear here</div>}
                <div className="diff-output" style={{ fontFamily: "Courier New, monospace", fontSize: 12, lineHeight: 1.6 }}>
                    {diff.map(renderDiffLine)}
                </div>
            </div>

            <div className="tool-controls">
                <button className="btn btn-primary" onClick={computeDiff}>Compare</button>
                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        const diffText = diff.map((l) => `${l.type === "added" ? "+" : l.type === "removed" ? "-" : "} ${l.content}`).join("\n");
                        navigator.clipboard.writeText(diffText);
                    }}
                    disabled={diff.length === 0}
                >
                    Copy Diff
                </button>
                <button className="btn btn-secondary" onClick={() => {
                    setTextA("");
                    setTextB("");
                    setDiff([]);
                }}>
                    Clear
                </button>
            </div>
        </>
    );
}