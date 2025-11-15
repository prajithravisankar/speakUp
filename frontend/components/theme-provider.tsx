"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// We do NOT re-declare children or props.
// We simply accept ALL of ThemeProviderProps.
export function ThemeProvider(props: ThemeProviderProps) {
    return <NextThemesProvider {...props} />;
}
