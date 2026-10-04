"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { recordSale, type SaleFormState } from "./actions";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
};

const CATEGORIES = ["Coffee", "Non-Coffee", "Pastries", "Others"] as const;
const MAX_QTY_PER_ITEM = 99;
const initialState: SaleFormState = { status: "idle" };

function peso(amount: number) {
  return `₱${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

// Shows the photo when image_url is set, otherwise the item's initials.
function ItemImage({
  item,
  className = "",
}: {
  item: MenuItem;
  className?: string;
}) {
  if (item.image_url) {
    return (
      <img
        src={item.image_url}
        alt={item.name}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }

  const initials = item.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-brand-light font-serif font-semibold text-brand ${className}`}
    >
      {initials}
    </div>
  );
}

function CheckoutButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Processing..." : "Checkout"}
    </button>
  );
}

export function PosClient({ menuItems }: { menuItems: MenuItem[] }) {
  const [state, formAction] = useActionState(recordSale, initialState);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const searchRef = useRef<HTMLInputElement>(null);

  // Empty the cart after a successful sale.
  useEffect(() => {
    if (state.status === "success") {
      setCart({});
    }
  }, [state]);

  // Ctrl/Cmd + K focuses the search box.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return menuItems.filter(
      (item) =>
        (category === "All" || item.category === category) &&
        item.name.toLowerCase().includes(needle)
    );
  }, [menuItems, query, category]);

  const itemById = useMemo(
    () => new Map(menuItems.map((item) => [item.id, item])),
    [menuItems]
  );

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ item: itemById.get(id), qty }))
    .filter(
      (line): line is { item: MenuItem; qty: number } => line.item !== undefined
    );

  const subtotal = lines.reduce(
    (sum, { item, qty }) => sum + Number(item.price) * qty,
    0
  );

  function changeQty(id: string, delta: number) {
    setCart((current) => {
      const next = Math.min((current[id] ?? 0) + delta, MAX_QTY_PER_ITEM);
      const { [id]: _removed, ...rest } = current;

      return next > 0 ? { ...rest, [id]: next } : rest;
    });
  }

  function removeLine(id: string) {
    setCart((current) => {
      const { [id]: _removed, ...rest } = current;
      return rest;
    });
  }

  const pillClass = (active: boolean) =>
    `rounded-full px-5 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-brand text-white"
        : "bg-stone-200/70 text-stone-700 hover:bg-stone-200"
    }`;

  return (
    <main className="flex-1 bg-cream p-4 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* MENU */}
        <section className="min-w-0 flex-1">
          <div className="relative">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search menu items..."
              aria-label="Search menu items"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-16 text-sm outline-none focus:border-brand"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-500 sm:block">
              Ctrl K
            </kbd>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {["All", ...CATEGORIES].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                aria-pressed={category === name}
                className={pillClass(category === name)}
              >
                {name}
              </button>
            ))}
          </div>

          {visibleItems.length ? (
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {visibleItems.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-stone-200 bg-white"
                >
                  <ItemImage item={item} className="h-28 w-full text-3xl" />

                  <div className="p-3">
                    <h2 className="truncate text-sm text-stone-800">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-brand-dark">
                      {peso(Number(item.price))}
                    </p>

                    <button
                      type="button"
                      onClick={() => changeQty(item.id, 1)}
                      className="mt-3 w-full rounded-lg bg-brand-light py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand hover:text-white"
                    >
                      + Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-sm text-stone-500">
              {menuItems.length
                ? "No items match your search. Try another name or category."
                : "No menu items yet — add some in the database to start selling."}
            </p>
          )}
        </section>

        {/* CURRENT ORDER */}
        <aside className="w-full lg:sticky lg:top-6 lg:w-[380px] lg:shrink-0 lg:self-start">
          <form
            action={formAction}
            className="overflow-hidden rounded-xl border border-stone-200 bg-white"
          >
            <input
              type="hidden"
              name="cart"
              value={JSON.stringify(
                lines.map(({ item, qty }) => ({ id: item.id, qty }))
              )}
            />

            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-stone-800">
                Current order
              </h2>

              <button
                type="button"
                onClick={() => setCart({})}
                disabled={!lines.length}
                className="text-sm text-stone-500 hover:text-red-600 disabled:opacity-40 disabled:hover:text-stone-500"
              >
                Clear order
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto px-5">
              {lines.length ? (
                lines.map(({ item, qty }) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-stone-100 py-4 last:border-0"
                  >
                    <ItemImage
                      item={item}
                      className="h-16 w-16 shrink-0 rounded-lg text-lg"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-stone-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-brand-dark">
                            {peso(Number(item.price))}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeLine(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-stone-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-stone-200">
                          <button
                            type="button"
                            onClick={() => changeQty(item.id, -1)}
                            aria-label={`Decrease ${item.name}`}
                            className="px-3 py-1 text-stone-600 hover:bg-stone-50"
                          >
                            −
                          </button>
                          <span
                            className="min-w-8 text-center text-sm"
                            aria-live="polite"
                          >
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQty(item.id, 1)}
                            aria-label={`Increase ${item.name}`}
                            className="px-3 py-1 text-stone-600 hover:bg-stone-50"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-medium text-stone-800">
                          {peso(Number(item.price) * qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-10 text-center text-sm text-stone-400">
                  No items yet. Tap “Add” on a menu item to start an order.
                </p>
              )}
            </div>

            <div className="space-y-2 border-t border-stone-200 px-5 py-4 text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{peso(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span>₱0</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-cream px-5 py-4">
              <span className="text-xl font-semibold text-brand-dark">Total</span>
              <span className="text-2xl font-semibold text-brand-dark">
                {peso(subtotal)}
              </span>
            </div>

            <div className="space-y-3 p-5">
              {state.status === "error" && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {state.message}
                </p>
              )}
              {state.status === "success" && (
                <p
                  role="status"
                  className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700"
                >
                  {state.message}
                </p>
              )}

              <CheckoutButton disabled={!lines.length} />
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}