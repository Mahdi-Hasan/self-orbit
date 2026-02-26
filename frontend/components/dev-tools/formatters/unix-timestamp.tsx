"use client";

import { useState } from "react";

export default function UnixTimestamp() {
    const [timestamp, setTimestamp] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [timezone, setTimezone] = useState("UTC");

    const convertTimestampToDate = () => {
        if (!timestamp) return;
        const ts = Number.parseInt(timestamp, 10);
        if (isNaN(ts)) return;
        const date = new Date(ts * 1000);
        const offset = timezone === "UTC" ? "UTC" : "local";
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: offset === "UTC" ? "UTC" : undefined,
        };
        setDateTime(new Intl.DateTimeFormat("en-US", options).format(date));
    };

    const convertDateToTimestamp = () => {
        if (!dateTime) return;
        const date = new Date(dateTime);
        const ts = Math.floor(date.getTime() / 1000);
        setTimestamp(String(ts));
    };

    const setNow = () => {
        const now = Date.now();
        const ts = Math.floor(now / 1000);
        setTimestamp(String(ts));
        setDateTime(new Date(now).toISOString().slice(0, 19).replace("T", " "));
    };

    return (
        <>
            <div className="tool-io">
                <div className="tool-io-panel">
                    <div className="tool-io-label">Unix Timestamp (seconds)</div>
                    <div style={{ marginBottom: 10 }}>
                        <button className="btn btn-primary" onClick={setNow}>Current Time</button>
                    </div>
                    <textarea
                        className="tool-io-area"
                        value={timestamp}
                        onChange={(e) => {
                            setTimestamp(e.target.value);
                            convertTimestampToDate();
                        }}
                        placeholder="Enter epoch timestamp..."
                        rows={2}
                    />
                </div>
                <div className="tool-io-panel">
                    <div className="tool-io-label">
                        Date & Time
                        <select
                            className="tool-select"
                            style={{ float: "right", padding: "2px 8px" }}
                            value={timezone}
                            onChange={(e) => {
                                setTimezone(e.target.value);
                                convertTimestampToDate();
                            }}
                        >
                            <option value="UTC">UTC</option>
                            <option value="local">Local</option>
                        </select>
                    </div>
                    <textarea
                        className="tool-io-area"
                        value={dateTime}
                        onChange={(e) => {
                            setDateTime(e.target.value);
                            convertDateToTimestamp();
                        }}
                        placeholder="YYYY-MM-DD HH:MM:SS"
                        rows={2}
                    />
                </div>
            </div>

            <div className="tool-controls">
                <button className="btn btn-primary" onClick={setNow}>Set Now</button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigator.clipboard.writeText(timestamp)}
                    disabled={!timestamp}
                >
                    Copy Timestamp
                </button>
                <button className="btn btn-secondary" onClick={() => {
                    setTimestamp("");
                    setDateTime("");
                }}>
                    Clear
                </button>
            </div>
        </>
    );
}