"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Role = "owner" | "cashier" | "staff";

type NavLink = {
  href: string;
  label: string;
  roles: Role[];
  icon: string; // SVG path data (24x24, stroke icon)
};

// Mirrors the RBAC rules in lib/supabase/middleware.ts so users only
// see links they are allowed to open. Inventory is intentionally not
// linked here: it is a separate area with its own role rules.
const LINKS: NavLink[] = [
  {
    href: "/pos",
    label: "POS",
    roles: ["owner", "cashier"],
    icon: "M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z",
  },
  {
    href: "/admin",
    label: "Reports",
    roles: ["owner"],
    icon: "M5 4h14v16H5zM9 16v-4M12 16V8M15 16v-6",
  },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const links = LINKS.filter((link) => link.roles.includes(role));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col justify-between bg-espresso-900 px-3 py-4 md:flex">
        <nav aria-label="Main" className="space-y-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-espresso-700 text-white"
                    : "text-white/70 hover:bg-espresso-800 hover:text-white"
                }`}
              >
                <span className={active ? "text-brand" : ""}>
                  <NavIcon d={link.icon} />
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <p className="px-3 pb-2 text-xs tracking-widest text-white/40">
          Good coffee, better days
        </p>
      </aside>

      {/* Mobile: compact top nav */}
      <nav
        aria-label="Main"
        className="flex gap-2 overflow-x-auto bg-espresso-800 px-3 py-2 md:hidden"
      >
        {links.map((link) => {
          const active = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
                active ? "bg-brand text-white" : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}