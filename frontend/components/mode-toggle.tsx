"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Make sure component is mounted before reading theme
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="outline" size="sm">
                {/* placeholder so SSR and client match */}
                <span className="opacity-0">🌙</span>
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme === "light" ? "🌙" : "☀️"}
        </Button>
    );
}
