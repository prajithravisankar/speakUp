"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const characters = [
    { id: "michael", name: "Michael" },
    { id: "angela", name: "Angela" },
    { id: "alex", name: "Alex" },
];

export function ChatNavbar() {
    const pathname = usePathname();

    return (
        <nav className="w-full border-b bg-background">
            <div className="flex items-center justify-between px-4 py-3">

                {/* LEFT: HOME */}
                <Link
                    href="/app/home"
                    className={`font-semibold ${pathname.includes("/home") && "text-blue-600"}`}
                >
                    Home
                </Link>

                {/* MIDDLE: SCROLLABLE CHARACTER ROW */}
                <div className="flex-1 mx-6 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4">

                        {characters.map((c) => (
                            <Link
                                key={c.id}
                                href={`/app/character/${c.id}`}
                                className={`whitespace-nowrap px-3 py-1 rounded-md border ${
                                    pathname.includes(c.id) ? "bg-blue-100 border-blue-500" : ""
                                }`}
                            >
                                {c.name}
                            </Link>
                        ))}

                        {/* ADD CHARACTER ICON */}
                        <Link
                            href="/app/add-character"
                            className="px-3 py-1 rounded-md border whitespace-nowrap"
                        >
                            +
                        </Link>
                    </div>
                </div>

                {/* RIGHT: INSIGHTS + SETTINGS */}
                <div className="flex gap-6">
                    <Link
                        href="/app/insights"
                        className={`${pathname.includes("/insights") && "text-blue-600"}`}
                    >
                        Insights
                    </Link>

                    <Link
                        href="/app/settings"
                        className={`${pathname.includes("/settings") && "text-blue-600"}`}
                    >
                        Settings
                    </Link>
                </div>

            </div>
        </nav>
    );
}
