"use client";

import { useState } from "react";

export default function ProgrammerCalc() {
    const [decValue, setDecValue] = useState<string>("0");

    const toHex = (n: bigint) => n.toString(16).toUpperCase();
    const toBin = (n: bigint) => n.toString(2);
    const toOct = (n: bigint) => n.toString(8);
    const toDec = (n: bigint) => n.toString(10);

    const parseValue = (val: string, base: number): bigint | null => {
        try {
            const cleaned = val.replace(/[^0-9A-Fa-f]/g, "");
            if (!cleaned) return 0n;
            return BigInt(`0${base.toString()}${cleaned}`);
        } catch {
            return null;
        }
    };

    const handleDecChange = (v: string) => {
        setDecValue(v);
    };

    const currentDec = parseValue(decValue, 10);

    return (
        <>
            <div className="tool-input-row" style={{ marginBottom: 20 }}>
                <div className="tool-input-group">
                    <label>Decimal (DEC)</label>
                    <input
                        type="text"
                        className="input"
                        value={decValue}
                        onChange={(e) => handleDecChange(e.target.value)}
                        placeholder="0"
                    />
                </div>
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 14, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Conversions
            </h3>

            <div className="tool-input-row">
                <div className="tool-input-group">
                    <label style={{ color: "#818cf8" }}>Hexadecimal (HEX)</label>
                    <input type="text" className="input" readOnly value={toHex(currentDec || 0n)} />
                </div>
                <div className="tool-input-group">
                    <label style={{ color: "#10b981" }}>Binary (BIN)</label>
                    <input type="text" className="input" readOnly value={toBin(currentDec || 0n)} />
                </div>
                <div className="tool-input-group">
                    <label style={{ color: "#f59e0b" }}>Octal (OCT)</label>
                    <input type="text" className="input" readOnly value={toOct(currentDec || 0n)} />
                </div>
                <div className="tool-input-group">
                    <label style={{ color: "#f97316" }}>Decimal (DEC)</label>
                    <input type="text" className="input" readOnly value={toDec(currentDec || 0n)} />
                </div>
            </div>

            <div className="tool-controls">
                <button className="btn btn-secondary" onClick={() => setDecValue("0")}>Reset</button>
                <button className="btn btn-secondary" onClick={() => setDecValue(String(Number.MAX_SAFE_INTEGER))}>Max Int</button>
                <button className="btn btn-secondary" onClick={() => setDecValue("1")}>Bit (0/1)</button>
                <button className="btn btn-secondary" onClick={() => setDecValue(String(BigInt(0x1122334455667788n)))}>Example Large Hex</button>
            </div>
        </>
    );
}