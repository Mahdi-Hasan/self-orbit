"use client";

import React from "react";

interface ToolLayoutProps {
    title: string;
    description: string;
    onBack: () => void;
    children: React.ReactNode;
}

export function ToolLayout({ title, description, onBack, children }: ToolLayoutProps) {
    return (
        <div className="tool-wrapper">
            <div className="tool-header">
                <button className="tool-back-btn" onClick={onBack} aria-label="Back to tools">
                    ←
                </button>
                <div className="tool-info">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>
            <div className="tool-content">
                {children}
            </div>
        </div>
    );
}