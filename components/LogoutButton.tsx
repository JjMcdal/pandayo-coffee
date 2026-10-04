"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const VARIANT_STYLES = {
  light: "border-stone-300 text-stone-600 hover:bg-stone-100",
  dark: "border-white/20 text-white/80 hover:bg-white/10",
} as const;

export function LogoutButton({
  variant = "light",
}: {
  variant?: keyof typeof VARIANT_STYLES;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }

    setLoading(true);
    await createClient().auth.signOut();
    window.location.replace("/login");
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={loading}
        className={`rounded-lg border px-4 py-2 text-sm disabled:cursor-wait disabled:opacity-60 ${VARIANT_STYLES[variant]}`}
      >
        {loading ? "Logging out..." : "Log out"}
      </button>
    </form>
  );
}