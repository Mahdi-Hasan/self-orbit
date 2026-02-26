import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Journal — Self-Orbit",
};

export default function JournalPage() {
    return (
        <>
            <div className="page-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h1>Journal</h1>
                        <p>Record your thoughts. AI extracts themes, mood, and action items.</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-secondary">🎙️ Record Audio</button>
                        <button className="btn btn-primary">+ New Entry</button>
                    </div>
                </div>
            </div>

            {/* Journal Input */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 12, fontSize: 16 }}>✍️ Write an Entry</h3>
                <textarea
                    className="input"
                    placeholder="What happened today? How are you feeling? AI will summarize, detect mood, and extract action items..."
                    rows={5}
                    style={{ resize: "vertical" }}
                />
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        Supports text and audio entries. Audio is auto-transcribed.
                    </span>
                    <button className="btn btn-primary">Save & Analyze</button>
                </div>
            </div>

            {/* Journal Entries */}
            <div className="card-grid">
                <div className="card">
                    <div className="empty-state">
                        <div className="icon">📓</div>
                        <h3>No journal entries yet</h3>
                        <p>Write your first entry above or record an audio note.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
