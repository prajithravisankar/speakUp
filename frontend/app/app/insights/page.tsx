// -------------------------------------
// Insights Page (wow factor + snapshot)
// File: app/app/insights/page.tsx
// -------------------------------------
"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BarChart3 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

type ErrorCategory =
    | "verb"
    | "preposition"
    | "article_determiner"
    | "singular_plural";

type SessionSummary = {
    id: string;
    character: string;
    title: string;
    date: string; // simple string for now
    mode: "text" | "voice";
    duration: string;
    errors: Record<ErrorCategory, number>;
    score: number; // 0–100
};

type ExampleItem = {
    category: ErrorCategory;
    original: string;
    corrected: string;
    explanation: string;
};

// Fake sessions (later load from backend)
const SESSIONS: SessionSummary[] = [
    {
        id: "session-1",
        character: "Michael",
        title: "Office small talk before stand-up",
        date: "Nov 15, 2025",
        mode: "text",
        duration: "9 min",
        score: 78,
        errors: {
            verb: 4,
            preposition: 3,
            article_determiner: 2,
            singular_plural: 1,
        },
    },
    {
        id: "session-2",
        character: "Angela",
        title: "Planning a weekend with a friend",
        date: "Nov 14, 2025",
        mode: "voice",
        duration: "7 min",
        score: 84,
        errors: {
            verb: 2,
            preposition: 1,
            article_determiner: 2,
            singular_plural: 0,
        },
    },
    {
        id: "session-3",
        character: "Alex",
        title: "Difficult conversation about the past",
        date: "Nov 12, 2025",
        mode: "text",
        duration: "11 min",
        score: 72,
        errors: {
            verb: 5,
            preposition: 2,
            article_determiner: 3,
            singular_plural: 2,
        },
    },
];

// Fake examples per session
const EXAMPLES: Record<string, ExampleItem[]> = {
    "session-1": [
        {
            category: "verb",
            original: "He go to the meeting every Monday.",
            corrected: "He goes to the meeting every Monday.",
            explanation: "Use 'goes' (3rd person singular) instead of 'go'.",
        },
        {
            category: "preposition",
            original: "I will talk you about the project.",
            corrected: "I will talk to you about the project.",
            explanation: "We say 'talk to someone', not 'talk someone'.",
        },
        {
            category: "article_determiner",
            original: "Can you send me report?",
            corrected: "Can you send me the report?",
            explanation: "Use 'the' when both people know which report.",
        },
    ],
    "session-2": [
        {
            category: "verb",
            original: "We was thinking to go hiking.",
            corrected: "We were thinking of going hiking.",
            explanation: "Use 'were' with 'we' and 'thinking of going'.",
        },
        {
            category: "article_determiner",
            original: "Let’s go to park near your house.",
            corrected: "Let’s go to the park near your house.",
            explanation: "Use 'the' for a specific park you both know.",
        },
    ],
    "session-3": [
        {
            category: "verb",
            original: "I am agree with you.",
            corrected: "I agree with you.",
            explanation: "We say 'I agree', not 'I am agree'.",
        },
        {
            category: "singular_plural",
            original: "We had many good memory together.",
            corrected: "We had many good memories together.",
            explanation: "Use plural 'memories' after 'many'.",
        },
    ],
};

const ERROR_LABELS: Record<ErrorCategory, string> = {
    verb: "Verb",
    preposition: "Preposition",
    article_determiner: "Articles",
    singular_plural: "Singular/Plural",
};

const ERROR_COLORS: Record<ErrorCategory, string> = {
    verb: "#3b82f6", // blue
    preposition: "#f97316", // orange
    article_determiner: "#22c55e", // green
    singular_plural: "#e11d48", // pink/red
};

export default function InsightsPage() {
    const [selectedId, setSelectedId] = useState(SESSIONS[0]?.id);

    const selectedSession =
        SESSIONS.find((s) => s.id === selectedId) ?? SESSIONS[0];

    const examples = EXAMPLES[selectedSession.id] ?? [];

    // === Snapshot metrics ===
    const totalSessions = SESSIONS.length;

    const totalMinutesNumber = SESSIONS.reduce((sum, s) => {
        const n = parseInt(s.duration); // "9 min" -> 9
        return sum + (isNaN(n) ? 0 : n);
    }, 0);

    const totalHours = Math.floor(totalMinutesNumber / 60);
    const remainingMinutes = totalMinutesNumber % 60;
    const totalTimeLabel =
        totalHours > 0
            ? `${totalHours}h ${remainingMinutes}m`
            : `${remainingMinutes} min`;

    const avgScore =
        totalSessions > 0
            ? Math.round(
                SESSIONS.reduce((sum, s) => sum + s.score, 0) / totalSessions
            )
            : 0;

    // Transform error data for charts
    const errorEntries = Object.entries(selectedSession.errors) as [
        ErrorCategory,
        number
    ][];

    const barData = errorEntries.map(([key, value]) => ({
        category: ERROR_LABELS[key],
        value,
        key,
    }));

    const totalErrors = errorEntries.reduce((sum, [, v]) => sum + v, 0);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Insights
                    </p>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        Grammar & conversation analytics
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Review your sessions and download a detailed report after practice.
                    </p>
                </div>

                <Button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() =>
                        alert(
                            "Later: call your backend PDF endpoint here (e.g. /api/sessions/:id/pdf)."
                        )
                    }
                >
                    <Download className="w-4 h-4" />
                    Download PDF report
                </Button>
            </section>

            {/* Snapshot row: three simple stats */}
            <section className="grid gap-3 md:grid-cols-3">
                <Card>
                    <CardContent className="py-3">
                        <p className="text-xs text-muted-foreground">Total sessions</p>
                        <p className="text-2xl font-semibold mt-1">{totalSessions}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-3">
                        <p className="text-xs text-muted-foreground">Total practice time</p>
                        <p className="text-2xl font-semibold mt-1">{totalTimeLabel}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-3">
                        <p className="text-xs text-muted-foreground">Average score</p>
                        <p className="text-2xl font-semibold mt-1">
                            {avgScore}
                            <span className="text-xs text-muted-foreground"> /100</span>
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Main layout: left = sessions, right = analytics */}
            <section className="grid gap-5 md:grid-cols-[1.2fr,2fr]">
                {/* LEFT: session list */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Your practice sessions</CardTitle>
                        <CardDescription className="text-xs">
                            Choose a session to see detailed feedback.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {SESSIONS.map((s) => {
                            const isActive = s.id === selectedSession.id;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setSelectedId(s.id)}
                                    className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors ${
                                        isActive
                                            ? "bg-primary/10 border-primary"
                                            : "bg-background hover:bg-accent"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {s.character} ·{" "}
                        <span className="text-muted-foreground">
                        {s.mode === "text" ? "Text" : "Voice"}
                      </span>
                    </span>
                                        <span className="text-xs text-muted-foreground">
                      {s.date}
                    </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                        {s.title}
                                    </p>
                                    <div className="flex items-center justify-between mt-1 text-[11px] text-muted-foreground">
                                        <span>Duration: {s.duration}</span>
                                        <span>Score: {s.score}/100</span>
                                    </div>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* RIGHT: analytics for selected session */}
                <div className="space-y-4">
                    {/* Summary card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                {selectedSession.character} · {selectedSession.title}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {selectedSession.date} ·{" "}
                                {selectedSession.mode === "text" ? "Text" : "Voice"} ·{" "}
                                {selectedSession.duration}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground">Total errors</p>
                                <p className="text-2xl font-semibold">{totalErrors}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Overall score</p>
                                <p className="text-2xl font-semibold">
                                    {selectedSession.score}
                                    <span className="text-xs text-muted-foreground"> /100</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Focus next time</p>
                                <p className="text-sm">
                                    {
                                        ERROR_LABELS[
                                            (errorEntries.sort((a, b) => b[1] - a[1])[0]?.[0] ??
                                                "verb") as ErrorCategory
                                            ]
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Charts row */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Bar chart: errors by category */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Errors by category</CardTitle>
                                <CardDescription className="text-xs">
                                    Each bar shows how many mistakes you made in this session.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {barData.map((entry) => {
                                                const catKey = entry.key as ErrorCategory;
                                                return (
                                                    <Cell
                                                        key={entry.category}
                                                        fill={ERROR_COLORS[catKey]}
                                                    />
                                                );
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Pie chart: percentage breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Error percentage breakdown
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    See which type of error happens most often.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-48 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={barData}
                                            dataKey="value"
                                            nameKey="category"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={4}
                                        >
                                            {barData.map((entry) => {
                                                // find category by label
                                                const found = errorEntries.find(
                                                    ([k]) => ERROR_LABELS[k] === entry.category
                                                );
                                                const catKey = (found?.[0] ??
                                                    "verb") as ErrorCategory;
                                                return (
                                                    <Cell
                                                        key={entry.category}
                                                        fill={ERROR_COLORS[catKey]}
                                                    />
                                                );
                                            })}
                                        </Pie>
                                        <Legend
                                            verticalAlign="bottom"
                                            height={24}
                                            iconSize={8}
                                            wrapperStyle={{ fontSize: 10 }}
                                        />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Examples list */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Examples from this session
                            </CardTitle>
                            <CardDescription className="text-xs">
                                A few sentences where you can clearly see the correction.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {examples.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    No examples recorded yet for this session.
                                </p>
                            )}

                            {examples.map((ex, idx) => (
                                <div
                                    key={idx}
                                    className="border-b last:border-b-0 pb-2 last:pb-0"
                                >
                                    <p className="text-[11px] uppercase text-muted-foreground mb-1">
                                        {ERROR_LABELS[ex.category]}
                                    </p>
                                    <p className="text-xs">
                                        <span className="font-medium text-red-500">Original: </span>
                                        <span>{ex.original}</span>
                                    </p>
                                    <p className="text-xs">
                    <span className="font-medium text-emerald-600">
                      Corrected:{" "}
                    </span>
                                        <span>{ex.corrected}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {ex.explanation}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
