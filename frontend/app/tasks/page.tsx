import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tasks — Self-Orbit",
};

export default function TasksPage() {
    return (
        <>
            <div className="page-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1>Tasks</h1>
                        <p>Manage your tasks with AI-powered parsing.</p>
                    </div>
                    <button className="btn btn-primary">+ Add Task</button>
                </div>
            </div>

            {/* Task Input */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 12, fontSize: 16 }}>🧠 Natural Language Task</h3>
                <div style={{ display: "flex", gap: 12 }}>
                    <input
                        className="input"
                        placeholder="Describe your task... e.g. 'Submit project report by Friday, high priority'"
                        style={{ flex: 1 }}
                    />
                    <button className="btn btn-primary">Parse & Create</button>
                </div>
            </div>

            {/* Task Columns */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {["Pending", "In Progress", "Completed", "Cancelled"].map((status) => (
                    <div key={status}>
                        <h3 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {status}
                        </h3>
                        <div className="card" style={{ minHeight: 200 }}>
                            <div className="empty-state" style={{ padding: 24 }}>
                                <p style={{ fontSize: 13 }}>No {status.toLowerCase()} tasks</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
