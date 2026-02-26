"use client";

import { useState, useEffect } from "react";

type ConversionMode = "yaml-to-json" | "json-to-yaml";

export default function YamlJsonConverter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<ConversionMode>("yaml-to-json");
    const [error, setError] = useState("");

    // Simple YAML subset parser
    const parseYaml = (yaml: string) => {
        const lines = yaml.split("\n");
        const result: any = {};
        const stack: any[] = [{ key: null, obj: result, level: 0 }];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const indent = line.search(/\S/);
            if (indent === -1) continue;

            while (stack.length > 0 && indent < stack[stack.length - 1].level) {
                stack.pop();
            }

            const [key, ...rest] = line.slice(indent).split(":");
            const value = rest.join(":").trim();
            const cleanedKey = key.trim();

            const current = stack[stack.length - 1].obj;
            const valueParsed = parseValue(value);

            if (value === "") {
                current[cleanedKey] = {};
                stack.push({ key: cleanedKey, obj: current[cleanedKey], level: indent + 2 });
            } else {
                current[cleanedKey] = valueParsed;
                stack.push({ key: cleanedKey, obj: null, level: indent + 2 });
                stack.pop();
            }
        }
        return result;
    };

    const parseValue = (value: string) => {
        if (!value) return null;
        const trimmed = value.trim();
        
        if (trimmed === "true") return true;
        if (trimmed === "false") return false;
        if (trimmed === "null") return null;
        if (trimmed === "~") return null;
        
        const num = Number(trimmed);
        if (!isNaN(num) && trimmed !== "") return num;
        
        return trimmed;
    };

    const yamlToJson = (yaml: string) => {
        try {
            const parsed = parseYaml(yaml);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            throw new Error("YAML parse error");
        }
    };

    const jsonToYaml = (json: string) => {
        try {
            const parsed = JSON.parse(json) || {};
            const convertToYaml = (obj: any): string => {
                const lines: string[] = [];
                const process = (value: any, prefix?: string, level = 0): void => {
                    if (typeof value === "object" && value !== null) {
                        Object.entries(value).forEach(([k, v]) => {
                            const indent = "  ".repeat(level);
                            if (typeof v === "object" && v !== null && !Array.isArray(v)) {
                                lines.push(`${indent}${k}:`);
                                process(v, k, level + 1);
                            } else if (Array.isArray(v)) {
                                lines.push(`${indent}${k}:`);
                                v.forEach((item, idx) => {
                                    if (typeof item === "object") {
                                        process(item, undefined, level + 1);
                                    } else {
                                        lines.push(`${indent}  - ${formatValue(item)}`);
                                    }
                                });
                            } else {
                                lines.push(`${indent}${k}: ${formatValue(v)}`);
                            }
                        });
                    }
                };
                process(obj);
                return lines.join("\n");
            };
            return convertToYaml(parsed);
        } catch (e) {
            throw new Error("JSON parse error");
        }
    };

    const formatValue = (value: any) => {
        if (value === true) return "true";
        if (value === false) return "false";
        if (value === null) return "null";
        if (typeof value === "number") return String(value);
        return `"${value}"`;
    };

    const handleConvert = () => {
        if (!input.trim()) return;
        try {
            setError("");
            const result = mode === "yaml-to-json" ? yamlToJson(input) : jsonToYaml(input);
            setOutput(result);
        } catch (e) {
            setError(mode === "yaml-to-json" ? "Invalid YAML" : "Invalid JSON");
            setOutput("");
        }
    };

    useEffect(() => {
        if (input) handleConvert();
    }, [mode]);

    return (
        <>
            <div className="tool-io">
                <div className="tool-io-panel">
                    <div className="tool-io-label">{mode === "yaml-to-json" ? "YAML Input" : "JSON Input"}</div>
                    <textarea
                        className="tool-io-area"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === "yaml-to-json" ? "Paste YAML here..." : "Paste JSON here..."}
                        rows={14}
                    />
                </div>
                <div className="tool-io-panel">
                    <div className="tool-io-label">{mode === "yaml-to-json" ? "JSON Output" : "YAML Output"}</div>
                    {error ? (
                        <div className="code-display error">{error}</div>
                    ) : output ? (
                        <div className="code-display">{output}</div>
                    ) : (
                        <div style={{ color: "var(--text-muted)" }}>Output will appear here</div>
                    )}
                </div>
            </div>

            <div className="tool-controls">
                <div className="tool-control-group">
                    <button className={`tool-toggle ${mode === "yaml-to-json" ? "active" : ""}`} onClick={() => setMode("yaml-to-json")}>
                        YAML → JSON
                    </button>
                    <button className={`tool-toggle ${mode === "json-to-yaml" ? "active" : ""}`} onClick={() => setMode("json-to-yaml")}>
                        JSON → YAML
                    </button>
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
                    setError("");
                }}>
                    Clear
                </button>
            </div>
        </>
    );
}