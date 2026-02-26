"use client";

import { useState, useEffect } from "react";
import "./dev-tools.css";
import { ToolLayout } from "@/components/dev-tools/tool-layout";
import JsonFormatter from "@/components/dev-tools/formatters/json-formatter";
import Base64Codec from "@/components/dev-tools/formatters/base64-codec";
import JwtDebugger from "@/components/dev-tools/formatters/jwt-debugger";
import SqlFormatter from "@/components/dev-tools/formatters/sql-formatter";
import UrlCodec from "@/components/dev-tools/formatters/url-codec";
import YamlJsonConverter from "@/components/dev-tools/formatters/yaml-json-converter";
import UnixTimestamp from "@/components/dev-tools/formatters/unix-timestamp";
import ProgrammerCalc from "@/components/dev-tools/calculators/programmer-calc";
import BitwiseCalc from "@/components/dev-tools/calculators/bitwise-calc";
import CronParser from "@/components/dev-tools/calculators/cron-parser";
import CssUnitConverter from "@/components/dev-tools/calculators/css-unit-converter";
import RegexTester from "@/components/dev-tools/calculators/regex-tester";
import DiffChecker from "@/components/dev-tools/calculators/diff-checker";
import PromptLibrary from "@/components/dev-tools/prompt-library/prompt-library";
import "./dev-tools.css";

interface Tool {
    id: string;
    name: string;
    icon: string;
    description: string;
    category: "formatters" | "calculators" | "prompts";
    component: React.ComponentType<any>;
}

const TOOLS: Tool[] = [
    {
        id: "json-formatter",
        name: "JSON Formatter",
        icon: "📄",
        description: "Beautify and validate JSON",
        category: "formatters",
        component: JsonFormatter,
    },
    {
        id: "base64-codec",
        name: "Base64 Codec",
        icon: "🔤",
        description: "Encode/decode Base64",
        category: "formatters",
        component: Base64Codec,
    },
    {
        id: "jwt-debugger",
        name: "JWT Debugger",
        icon: "🔐",
        description: "Decode and inspect JWTs",
        category: "formatters",
        component: JwtDebugger,
    },
    {
        id: "sql-formatter",
        name: "SQL Formatter",
        icon: "🗄️",
        description: "Format and beautify SQL",
        category: "formatters",
        component: SqlFormatter,
    },
    {
        id: "url-codec",
        name: "URL Encoder/Decoder",
        icon: "🔗",
        description: "Encode/decode URLs",
        category: "formatters",
        component: UrlCodec,
    },
    {
        id: "yaml-json",
        name: "YAML ↔ JSON",
        icon: "🔄",
        description: "Convert YAML and JSON",
        category: "formatters",
        component: YamlJsonConverter,
    },
    {
        id: "unix-timestamp",
        name: "Unix Timestamp",
        icon: "⏰",
        description: "Convert epoch timestamps",
        category: "formatters",
        component: UnixTimestamp,
    },
    {
        id: "programmer-calc",
        name: "Programmer's Calculator",
        icon: "🧮",
        description: "HEX, BIN, OCT, DEC math",
        category: "calculators",
        component: ProgrammerCalc,
    },
    {
        id: "bitwise-calc",
        name: "Bitwise Calculator",
        icon: "⚡",
        description: "Bitwise operations",
        category: "calculators",
        component: BitwiseCalc,
    },
    {
        id: "cron-parser",
        name: "CRON Parser",
        icon: "📅",
        description: "Parse cron expressions",
        category: "calculators",
        component: CronParser,
    },
    {
        id: "css-unit-converter",
        name: "CSS Unit Converter",
        icon: "📏",
        description: "Convert CSS units",
        category: "calculators",
        component: CssUnitConverter,
    },
    {
        id: "regex-tester",
        name: "Regex Tester",
        icon: "🔎",
        description: "Test regex patterns",
        category: "calculators",
        component: RegexTester,
    },
    {
        id: "diff-checker",
        name: "Diff Checker",
        icon: "📊",
        description: "Compare text differences",
        category: "calculators",
        component: DiffChecker,
    },
    {
        id: "prompt-library",
        name: "Prompt Library",
        icon: "💬",
        description: "Manage and template prompts",
        category: "prompts",
        component: PromptLibrary,
    },
];

export default function DevToolsPage() {
    const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedTool = TOOLS.find((t) => t.id === selectedToolId);
    const filteredTools = TOOLS.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K: open search (focus input)
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                const searchInput = document.querySelector(
                    "[data-dev-tools-search]"
                ) as HTMLInputElement;
                searchInput?.focus();
            }
            // Escape: back to grid
            if (e.key === "Escape" && selectedToolId) {
                e.preventDefault();
                setSelectedToolId(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedToolId]);

    if (selectedTool) {
        const Component = selectedTool.component;
        return (
            <ToolLayout
                title={selectedTool.name}
                description={selectedTool.description}
                onBack={() => setSelectedToolId(null)}
            >
                <Component />
            </ToolLayout>
        );
    }

    const formatterTools = filteredTools.filter((t) => t.category === "formatters");
    const calculatorTools = filteredTools.filter((t) => t.category === "calculators");
    const promptTools = filteredTools.filter((t) => t.category === "prompts");

    return (
        <div className="dev-tools-container">
            <div className="page-header">
                <h1>Dev Tools</h1>
                <p>Quick utilities for developers. Everything runs in your browser.</p>
            </div>

            {/* Search Bar */}
            <div
                style={{
                    marginBottom: 32,
                    display: "flex",
                    gap: 8,
                }}
            >
                <input
                    data-dev-tools-search
                    type="text"
                    className="input"
                    placeholder="Search tools... (Ctrl+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, maxWidth: 500 }}
                />
            </div>

            {/* Tools Grid */}
            <div className="dev-tools-grid">
                {formatterTools.length > 0 && (
                    <div className="dev-tools-section">
                        <h2>📋 Data Formatters & Converters</h2>
                        <div className="tools-grid">
                            {formatterTools.map((tool) => (
                                <button
                                    key={tool.id}
                                    className="tool-card"
                                    onClick={() => setSelectedToolId(tool.id)}
                                >
                                    <div className="tool-card-icon">{tool.icon}</div>
                                    <div className="tool-card-name">{tool.name}</div>
                                    <div className="tool-card-desc">{tool.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {calculatorTools.length > 0 && (
                    <div className="dev-tools-section">
                        <h2>🧮 Calculators & Logic Tools</h2>
                        <div className="tools-grid">
                            {calculatorTools.map((tool) => (
                                <button
                                    key={tool.id}
                                    className="tool-card"
                                    onClick={() => setSelectedToolId(tool.id)}
                                >
                                    <div className="tool-card-icon">{tool.icon}</div>
                                    <div className="tool-card-name">{tool.name}</div>
                                    <div className="tool-card-desc">{tool.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {promptTools.length > 0 && (
                    <div className="dev-tools-section">
                        <h2>💬 Productivity</h2>
                        <div className="tools-grid">
                            {promptTools.map((tool) => (
                                <button
                                    key={tool.id}
                                    className="tool-card"
                                    onClick={() => setSelectedToolId(tool.id)}
                                >
                                    <div className="tool-card-icon">{tool.icon}</div>
                                    <div className="tool-card-name">{tool.name}</div>
                                    <div className="tool-card-desc">{tool.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {filteredTools.length === 0 && (
                    <div className="empty-state">
                        <div className="icon">🔍</div>
                        <h3>No tools found</h3>
                        <p>Try a different search term</p>
                    </div>
                )}
            </div>
        </div>
    );
}
