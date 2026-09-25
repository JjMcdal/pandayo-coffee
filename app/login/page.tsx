"use client";

import { useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await login(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
    // On success, middleware.ts takes over and redirects based on role.
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <div className="relative w-full max-w-sm">
        <form
          action={handleSubmit}
          onSubmit={() => {
            setError(null);
            setLoading(true);
          }}
          className="w-full rounded-2xl border border-amber-200 bg-white p-8 shadow-sm"
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

        {loading && (
          <div
            className="absolute left-0 right-0 top-full mt-3 flex items-center justify-center gap-2 text-sm text-stone-600"
            role="status"
            aria-live="polite"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-200 border-t-amber-700" />
            <span>Logging you in...</span>
          </div>
        )}
      </div>
    </main>
  );
}
