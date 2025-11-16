"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, LineChart, Settings } from "lucide-react";

const characters = [
  { id: "michael", name: "Michael" },
  { id: "angela", name: "Angela" },
  { id: "alex", name: "Alex" },
];

export function ChatNavbar() {
  const pathname = usePathname();

  return (
    <div className="w-full flex justify-center mt-6">
      {/* Glass pill navbar */}
      <nav
        className="
          flex items-center gap-10 px-10 py-5   /* ⬅️ increased height */
          rounded-full
          backdrop-blur-xl bg-white/40 dark:bg-black/30
          border border-white/30 dark:border-white/10
          shadow-[0_8px_28px_rgba(0,0,0,0.08)]
          max-w-4xl w-full
        "
      >
        {/* HOME ICON */}
        <NavItem active={pathname.includes("/home")}>
          <Link href="/app/home">
            <Home size={20} />
          </Link>
        </NavItem>

        {/* CHARACTER SCROLLER */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-8 px-2 py-1">
            {characters.map((c) => (
              <NavItem key={c.id} active={pathname.includes(c.id)}>
                <Link
                  href={`/app/character/${c.id}`}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`
              w-12 h-12 rounded-full shrink-0 flex items-center justify-center
              text-lg font-medium transition-all duration-150
              ${
                pathname.includes(c.id)
                  ? "bg-blue-500 text-white shadow-md ring-2 ring-blue-400"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }
            `}
                  >
                    {c.name.substring(0, 1)}
                  </div>
                </Link>
              </NavItem>
            ))}

            {/* ADD CHARACTER */}
            <NavItem active={pathname.includes("add-character")}>
              <Link href="/app/add-character">
                <Plus size={20} />
              </Link>
            </NavItem>
          </div>
        </div>

        {/* INSIGHTS ICON */}
        <NavItem active={pathname.includes("/insights")}>
          <Link href="/app/insights">
            <LineChart size={20} />
          </Link>
        </NavItem>

        {/* SETTINGS ICON */}
        <NavItem active={pathname.includes("/settings")}>
          <Link href="/app/settings">
            <Settings size={20} />
          </Link>
        </NavItem>
      </nav>
    </div>
  );
}

/* -----------------------------
   CLEAN NAV ITEM — No Zoom
------------------------------ */
function NavItem({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`
        transition-colors duration-150 flex items-center
        hover:text-blue-600 dark:hover:text-blue-300
        ${
          active
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-200"
        }
      `}
    >
      {children}
    </div>
  );
}
