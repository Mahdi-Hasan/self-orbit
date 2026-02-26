"use client";

import { useState } from "react";

type CSSUnit = "px" | "rem" | "em" | "vh" | "vw";

export default function CssUnitConverter() {
    const [value, setValue] = useState("16");
    const [fromUnit, setFromUnit] = useState<CSSUnit>("px");
    const [baseFontSize, setBaseFontSize] = useState("16");
    const [viewportHeight, setViewportHeight] = useState("1000");
    const [viewportWidth, setViewportWidth] = useState("1920");
    const [results, setResults] = useState<Record<CSSUnit, string>>({ px: "0", rem: "0", em: "0", vh: "0", vw: "0" });

    const units: CSSUnit[] = ["px", "rem", "em", "vh", "vw"];

    const toPx = (val: number, unit: CSSUnit): number => {
        switch (unit) {
            case "px": return val;
            case "rem": return val * Number(baseFontSize);
            case "em": return val * Number(baseFontSize);
            case "vh": return (val / 100) * Number(viewportHeight);
            case "vw": return (val / 100) * Number(viewportWidth);
        }
    };

    const convert = () => {
        const num = Number.parseFloat(value);
        if (isNaN(num)) return;
        const pxVal = toPx(num, fromUnit);

        const vals: Record<CSSUnit, string> = {
            px: pxVal.toString(),
            rem: (pxVal / Number(baseFontSize)).toFixed(2),
            em: (pxVal / Number(baseFontSize)).toFixed(2),
            vh: (pxVal / Number(viewportHeight) * 100).toFixed(2),
            vw: (pxVal / Number(viewportWidth) * 100).toFixed(2),
        };
        setResults(vals);
    };

    const convertUnit = (to: CSSUnit): string => {
        const num = Number.parseFloat(value);
        if (isNaN(num)) return "0";
        const pxVal = toPx(num, fromUnit);
        switch (to) {
            case "px": return pxVal.toString();
            case "rem": return (pxVal / Number(baseFontSize)).toFixed(2);
            case "em": return (pxVal / Number(baseFontSize)).toFixed(2);
            case "vh": return (pxVal / Number(viewportHeight) * 100).toFixed(2);
            case "vw": return (pxVal / Number(viewportWidth) * 100).toFixed(2);
        }
    };

    const convertAll = () => {
        const num = Number.parseFloat(value);
        if (isNaN(num)) return;
        const pxVal = toPx(num, fromUnit);
        setResults({
            px: pxVal.toString(),
            rem: (pxVal / Number(baseFontSize)).toFixed(2),
            em: (pxVal / Number(baseFontSize)).toFixed(2),
            vh: (pxVal / Number(viewportHeight) * 100).toFixed(2),
            vw: (pxVal / Number(viewportWidth) * 100).toFixed(2),
        });
    };

    return (
        <>
            <div style={{ marginBottom: 24 }}>
                <label className="tool-io-label">Value to Convert</label>
                <input
                    type="number"
                    className="input"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        convertAll();
                    }}
                    onKeyUp={convertAll}
                />
                <span style={{ marginLeft: 8, fontSize: 14 }}>from</span>
                <select
                    value={fromUnit}
                    onChange={(e) => {
                        setFromUnit(e.target.value as CSSUnit);
                        convertAll();
                    }}
                    className="tool-select"
                    style={{ marginLeft: 8 }}
                >
                    {units.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>

            <h3 style={{ marginBottom: 12, fontSize: 13, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Reference Values
            </h3>

            <div className="tool-input-row" style={{ marginBottom: 20 }}>
                <div className="tool-input-group">
                    <label>Base Font Size (px)</label>
                    <input
                        type="number"
                        className="input"
                        value={baseFontSize}
                        onChange={(e) => {
                            setBaseFontSize(e.target.value);
                            convertAll();
                        }}
                    />
                </div>
                <div className="tool-input-group">
                    <label>Viewport Height (px)</label>
                    <input
                        type="number"
                        className="input"
                        value={viewportHeight}
                        onChange={(e) => {
                            setViewportHeight(e.target.value);
                            convertAll();
                        }}
                    />
                </div>
                <div className="tool-input-group">
                    <label>Viewport Width (px)</label>
                    <input
                        type="number"
                        className="input"
                        value={viewportWidth}
                        onChange={(e) => {
                            setViewportWidth(e.target.value);
                            convertAll();
                        }}
                    />
                </div>
            </div>

            <h3 style={{ marginBottom: 12, fontSize: 13, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Results
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 16 }}>
                {units.map((unit) => (
                    <div key={unit} style={{
                        padding: 12,
                        background: unit === fromUnit ? "var(--accent-glow)" : "var(--bg-secondary)",
                        borderRadius: 8,
                        border: unit === fromUnit ? "1px solid var(--accent)" : "1px solid var(--border)",
                    }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{unit}</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: unit === fromUnit ? "var(--accent)" : "var(--text-primary)" }}>
                            {results[unit]}
                        </div>
                    </div>
                ))}
            </div>

            <div className="tool-controls">
                <button className="btn btn-secondary" onClick={() => {
                    setValue("");
                    setResults({ px: "0", rem: "0", em: "0", vh: "0", vw: "0" });
                }}>Clear</button>
                <button className="btn btn-secondary" onClick={convert}>Calculate</button>
            </div>
        </>
    );
}