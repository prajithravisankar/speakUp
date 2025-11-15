// ---------------------------
// THEME DROPDOWN
// File: components/mode-toggle.tsx
// ---------------------------

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themeOptions = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "ocean", label: "Ocean blue" },
    { id: "forest", label: "Forest green" },
    { id: "sunset", label: "Sunset" },
    { id: "midnight", label: "Midnight" },
    { id: "pastel", label: "Pastel" },
];

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
    }, []);

    if (!mounted) return null;

    return (
        <select
            className="border bg-background text-sm rounded-md px-2 py-1"
            value={theme ?? "light"}
            onChange={(e) => setTheme(e.target.value)}
        >
            {themeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
