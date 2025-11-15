// --------------------------
// NAVBAR COMPONENT
// File: components/navbar.tsx
// --------------------------

"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
    return (
        <nav className="w-full border-b bg-background">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">

                {/* Logo */}
                <Link href="/" className="text-xl font-bold">
                    SpeakUp
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6 text-sm">
                    <Link href="/auth/login">Sign In</Link>
                    <Link href="/auth/signup">Sign Up</Link>

                    {/* Dark/Light Mode Toggle */}
                    <ModeToggle />
                </div>

            </div>
        </nav>
    );
}
