// -------------------------------------
// Settings Form (Client Component)
// File: components/settings-form.tsx
// -------------------------------------
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type User = {
    firstName: string;
    lastName: string;
    email: string;
};

export function SettingsForm({ initialUser }: { initialUser: User }) {
    const [form, setForm] = useState({
        firstName: initialUser.firstName,
        lastName: initialUser.lastName,
        email: initialUser.email,
        password: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("Saving (frontend only):", form);
        alert("Saved (frontend only). Later this will update your real account.");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* First name */}
            <div className="space-y-1">
                <label className="text-sm font-medium">First name</label>
                <Input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="First name"
                />
            </div>

            {/* Last name */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Last name</label>
                <Input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Last name"
                />
            </div>

            {/* Email */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email address"
                />
            </div>

            {/* Password */}
            <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="New password (optional)"
                />
                <p className="text-xs text-muted-foreground">
                    Leave this empty if you don&apos;t want to change your password.
                </p>
            </div>

            <Button type="submit" className="w-full">
                Save changes
            </Button>
        </form>
    );
}
