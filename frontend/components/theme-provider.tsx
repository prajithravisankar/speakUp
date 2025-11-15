// -------------------------------------
// THEME PROVIDER (multi-theme support)
// File: components/theme-provider.tsx
// -------------------------------------

"use client";

import {
    ThemeProvider as NextThemesProvider,
    type ThemeProviderProps,
} from "next-themes";

const themes = [
    "light",
    "dark",
    "ocean",
    "forest",
    "sunset",
    "midnight",
    "pastel",
];

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
    return (
        <NextThemesProvider themes={themes} {...props}>
            {children}
        </NextThemesProvider>
    );
}
