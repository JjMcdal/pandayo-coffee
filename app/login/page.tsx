"use client";

import { useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await login(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
    // On success, middleware.ts takes over and redirects based on role.
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <form
        action={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-amber-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-center text-lg font-medium text-stone-800">
          Pandayo Coffee
        </h1>
        <p className="mb-6 text-center text-sm text-stone-500">
          Log in to your account
        </p>

        <label className="mb-1 block text-sm text-stone-600" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="mb-4 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm text-stone-600" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          className="mb-4 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-700 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
