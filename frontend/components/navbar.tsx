"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

export function Navbar() {
    return (
        <nav className="w-full border-b bg-background">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">

                {/* Logo */}
                <Link href="/" className="text-xl font-bold">
                    SpeakUp
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-6 text-sm">

                    {/* When signed OUT */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="hover:underline">Sign In</button>
                        </SignInButton>

                        <SignUpButton mode="modal">
                            <button className="hover:underline">Sign Up</button>
                        </SignUpButton>
                    </SignedOut>

                    {/* When signed IN */}
                    <SignedIn>
                        {/* Clerk User Menu */}
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    {/* Theme selector is always visible */}
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
