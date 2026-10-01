import { LogoutButton } from "./LogoutButton";
import type { Role } from "./Sidebar";

const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  cashier: "Cashier",
  staff: "Staff",
};

export function AppHeader({
  section,
  name,
  role,
}: {
  section: string;
  name: string;
  role: Role;
}) {
  return (
    <header className="flex h-16 items-center justify-between bg-espresso-900 px-4 text-white sm:px-6">
      <div className="flex items-center gap-3">
        <svg
          width="32"
          height="32"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M11 38V10C11 7.79 12.79 6 15 6H25C32.18 6 37 10.03 37 16.5C37 22.97 32.18 27 25 27H19V38C19 40.21 17.21 42 15 42C12.79 42 11 40.21 11 38Z"
            fill="#d9722e"
            stroke="#fbf7f0"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="25" cy="16.5" r="5" fill="#2a2320" />
        </svg>

        <span className="font-serif text-xl font-semibold sm:text-2xl">
          Pandayo Coffee
        </span>

        <span className="rounded-md bg-brand px-2.5 py-1 text-xs font-semibold">
          {section}
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <p className="hidden text-sm text-white/80 sm:block">
          {ROLE_LABEL[role]}: {name}
        </p>

        <LogoutButton variant="dark" />
      </div>
    </header>
  );
}