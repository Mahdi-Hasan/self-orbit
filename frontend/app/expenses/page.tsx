import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Expenses — Self-Orbit",
};

export default function ExpensesPage() {
    return (
        <>
            <div className="page-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1>Expenses</h1>
                        <p>Track and manage your financial transactions.</p>
                    </div>
                    <button className="btn btn-primary">+ Add Expense</button>
                </div>
            </div>

            {/* Expense Input */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 12, fontSize: 16 }}>🧠 AI-Powered Entry</h3>
                <div style={{ display: "flex", gap: 12 }}>
                    <input
                        className="input"
                        placeholder="Type your expense naturally... e.g. 'Coffee $4.50 at Starbucks'"
                        style={{ flex: 1 }}
                    />
                    <button className="btn btn-primary">Parse & Save</button>
                </div>
            </div>

            {/* Expenses Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={5}>
                                <div className="empty-state">
                                    <div className="icon">💸</div>
                                    <h3>No expenses yet</h3>
                                    <p>Start by typing an expense above. AI will handle the rest.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
