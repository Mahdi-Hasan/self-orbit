"use client";

import { useState } from "react";

export default function CronParser() {
    const [cron, setCron] = useState("*****");
    const [explanation, setExplanation] = useState<string>("");
    const [nextRuns, setNextRuns] = useState<string[]>([]);

    const parseField = (field: string, min: number, max: number, names?: Record<number, string>): number[] => {
        const values: number[] = [];
        const parts = field.split(",");

        for (const part of parts) {
            if (part === "*") {
                for (let i = min; i <= max; i++) values.push(i);
            } else if (part.includes("/")) {
                const [range, stepStr] = part.split("/");
                const step = Number.parseInt(stepStr, 10);
                let start = min,
                    end = max;
                if (range.includes("-")) {
                    const [s, e] = range.split("-");
                    start = Number.parseInt(s, 10);
                    end = Number.parseInt(e, 10);
                }
                for (let i = start; i <= end; i += step) {
                    if (i >= min && i <= max) values.push(i);
                }
            } else if (part.includes("-")) {
                const [start, end] = part.split("-").map(Number);
                for (let i = start; i <= end; i++) values.push(i);
            } else {
                const num = Number.parseInt(part, 10);
                if (!isNaN(num) && num >= min && num <= max) values.push(num);
            }
        }
        return [...new Set(values)].sort((a, b) => a - b);
    };

    const parseCron = () => {
        const parts = cron.trim().split(/\s+/);
        if (parts.length < 5) {
            setExplanation("Invalid format. Expected: minute hour day-of-month month day-of-week [year]");
            setNextRuns([]);
            return;
        }

        const [min, hr, dom, mon, dow] = parts;
        const minutes = parseField(min, 0, 59);
        const hours = parseField(hr, 0, 23);
        const daysOfMonth = parseField(dom, 1, 31);
        const months = parseField(mon, 1, 12);
        const daysOfWeek = parseField(dow, 0, 6, { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" });

        const toName = (n: number, map?: Record<number, string>) => (map ? map[n] || n : n);

        setExplanation(
            `Runs at ${JSON.stringify(minutes.map((v) => toName(v, {})))} minute(s) past hour, ${JSON.stringify(hours.map((v) => v))} hour(s), on ${JSON.stringify(daysOfMonth)} day(s) of month(s) ${JSON.stringify(months.map((v) => v))}, and on day(s) of week ${JSON.stringify(daysOfWeek.map((v) => toName(v)))}`
        );

        const now = new Date();
        const runs: string[] = [];
        const maxRuns = 5;
        const maxDays = 60;

        for (let d = 0; d < maxDays && runs.length < maxRuns; d++) {
            const date = new Date(now);
            date.setDate(date.getDate() + d);
            date.setHours(0, 0, 0, 0);

            const mIdx = date.getMonth() + 1;
            const domIdx = date.getDate();
            const dowIdx = date.getDay();

            if (months.includes(mIdx) && (daysOfMonth.includes(domIdx) || daysOfWeek.includes(dowIdx))) {
                for (const h of hours) {
                    for (const min of minutes) {
                        const runDate = new Date(date);
                        runDate.setHours(h, min, 0, 0);
                        if (runDate > now) {
                            runs.push(runDate.toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                year: "numeric",
                            }));
                        }
                        if (runs.length >= maxRuns) break;
                    }
                    if (runs.length >= maxRuns) break;
                }
            }
        }
        setNextRuns(runs);
    };

    return (
        <>
            <div className="tool-io-panel" style={{ marginBottom: 20 }}>
                <div className="tool-io-label">CRON Expression</div>
                <textarea
                    className="tool-io-area"
                    value={cron}
                    onChange={(e) => setCron(e.target.value)}
                    placeholder="*****"
                    rows={2}
                />
            </div>

            {explanation && (
                <div className="code-display success" style={{ marginBottom: 20 }}>
                    {explanation}
                </div>
            )}

            {nextRuns.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: 13, marginBottom: 8, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Next 5 run times
                    </h4>
                    {nextRuns.map((run, i) => (
                        <div key={i} style={{ padding: "6px 10px", background: "var(--bg-secondary)", marginBottom: 4, borderRadius: 4, fontSize: 13 }}>
                            {i + 1}. {run}
                        </div>
                    ))}
                </div>
            )}

            <div className="tool-controls">
                <button className="btn btn-primary" onClick={parseCron}>" />
                <button className="btn btn-secondary" onClick={() => setCron("*****")}>" />
            </div>
        </>
    );
}