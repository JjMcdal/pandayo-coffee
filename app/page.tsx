import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between border-b border-stone-200 py-4">
        <span className="text-sm font-medium text-stone-800">
          Pandayo Coffee
        </span>
        <div className="flex gap-6 text-sm text-stone-500">
          <span>Menu</span>
          <span>About</span>
          <span>Locations</span>
        </div>
        <Link
          href="/login"
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white"
        >
          Staff login
        </Link>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 py-16 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="mb-4 text-2xl font-medium leading-snug text-stone-800">
            Crafted coffee, made for your day
          </h1>
          <p className="mb-6 text-sm leading-7 text-stone-500">
            Pandayo Coffee — freshly roasted, locally sourced, and made with
            care. Visit us in Caloocan.
          </p>
        </div>
        <div className="flex h-48 items-center justify-center rounded-2xl bg-amber-100">
          <span className="text-amber-700">☕</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl rounded-2xl bg-stone-50 p-8 text-center">
        <p className="mb-1 text-sm font-medium text-stone-800">
          Visit us in Caloocan today
        </p>
        <p className="text-xs text-stone-500">Open daily, 7am – 9pm</p>
      </div>
    </main>
  );
}
