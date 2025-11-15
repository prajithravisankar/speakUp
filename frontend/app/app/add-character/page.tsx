// ----------------------------------------
// ADD CHARACTER PAGE (abstract creator)
// File: app/app/add-character/page.tsx
// ----------------------------------------

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AddCharacterPage() {
    const [form, setForm] = useState({
        name: "",
        role: "",
        goal: "",
        vibe: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("New character config:", form);
        alert("Character config logged to console – later you can save this to your backend.");
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create a new AI character</CardTitle>
                    <CardDescription>
                        Define how this character talks, what their relationship is to you, and what you want
                        to practice with them.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Character name</label>
                            <Input
                                placeholder="e.g. Sarah, Manager, Roommate..."
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Relationship / role</label>
                            <Input
                                placeholder="e.g. Coworker, Professor, Partner, Interviewer..."
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            />
                        </div>

                        {/* Goal */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">What do you want to practice?</label>
                            <Input
                                placeholder="e.g. Asking for help politely, handling conflicts, small talk..."
                                value={form.goal}
                                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                            />
                        </div>

                        {/* Vibe */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tone / vibe</label>
                            <Input
                                placeholder="e.g. friendly and casual, direct but kind, formal and respectful..."
                                value={form.vibe}
                                onChange={(e) => setForm({ ...form, vibe: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="mt-2 w-full">
                            Save character (frontend only for now)
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
