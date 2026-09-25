"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function LogoutButton() {
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
        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Logging out..." : "Log out"}
      </button>
    </form>
  );
}