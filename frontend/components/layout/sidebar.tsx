"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/expenses", icon: "💰", label: "Expenses" },
    { href: "/tasks", icon: "📋", label: "Tasks" },
    { href: "/journal", icon: "📓", label: "Journal" },
    { href: "/dev-tools", icon: "🛠️", label: "Dev Tools" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span>🧠</span>
                <h1>Self-Orbit</h1>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                    >
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Self-Orbit v0.1.0
                </p>
            </div>
        </aside>
    );
}
