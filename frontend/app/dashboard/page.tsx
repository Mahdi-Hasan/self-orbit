import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard — Self-Orbit",
};

export default function DashboardPage() {
    return (
        <>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Your personal intelligence at a glance.</p>
            </div>

            {/* KPI Cards */}
            <div className="card-grid" style={{ marginBottom: 32 }}>
                <div className="stat-card">
                    <div className="label">Total Expenses</div>
                    <div className="value">$0.00</div>
                    <div className="change positive">↑ Connect services to see data</div>
                </div>

                <div className="stat-card">
                    <div className="label">Active Tasks</div>
                    <div className="value">0</div>
                    <div className="change">No tasks yet</div>
                </div>

                <div className="stat-card">
                    <div className="label">Journal Entries</div>
                    <div className="value">0</div>
                    <div className="change">Start journaling today</div>
                </div>

                <div className="stat-card">
                    <div className="label">AI Insights</div>
                    <div className="value">—</div>
                    <div className="change">Awaiting data</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="page-header">
                <h1 style={{ fontSize: 20 }}>Quick Actions</h1>
            </div>

            <div className="card-grid">
                <div className="card">
                    <h3 style={{ marginBottom: 8 }}>💰 Log Expense</h3>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
                        Type what you spent in plain English. AI will parse it.
                    </p>
                    <input className="input" placeholder="e.g. Spent $25 on lunch at Chipotle" />
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: 8 }}>📋 Add Task</h3>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
                        Describe your task naturally. AI extracts priority & deadline.
                    </p>
                    <input className="input" placeholder="e.g. Call dentist tomorrow at 2pm" />
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: 8 }}>📓 Journal Entry</h3>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
                        Write or record your thoughts. AI summarizes and extracts themes.
                    </p>
                    <input className="input" placeholder="What's on your mind?" />
                </div>
            </div>
        </>
    );
}
