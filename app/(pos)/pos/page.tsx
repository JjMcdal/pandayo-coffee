import { createClient } from "@/lib/supabase/server";
import { recordSale } from "./actions";

export default async function PosPage() {
  const supabase = createClient();

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("name");

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-lg font-medium text-stone-800">
          New sale
        </h1>

        <form action={recordSale} className="space-y-3">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            {menuItems?.length ? (
              menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-stone-100 py-3 last:border-0"
                >
                  <div>
                    <p className="text-sm text-stone-800">{item.name}</p>
                    <p className="text-xs text-stone-500">
                      ₱{item.price}
                    </p>
                  </div>
                  <input
                    type="number"
                    name={`qty_${item.id}`}
                    min={0}
                    defaultValue={0}
                    className="w-16 rounded-lg border border-stone-300 px-2 py-1 text-right text-sm"
                  />
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-stone-400">
                No menu items yet — add some in the database to start
                selling.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-amber-700 py-2 text-sm font-medium text-white"
          >
            Complete sale
          </button>
        </form>
      </div>
    </main>
  );
}
