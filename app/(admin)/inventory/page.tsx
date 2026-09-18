import { createClient } from "@/lib/supabase/server";

export default async function InventoryPage() {
  const supabase = createClient();

  const { data: items } = await supabase
    .from("inventory_items")
    .select("*")
    .order("name");

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-medium text-stone-800">Inventory</h1>
          <button className="rounded-lg bg-amber-700 px-4 py-2 text-sm text-white">
            Add item
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="px-4 py-3 font-normal">Item</th>
                <th className="px-4 py-3 font-normal">Category</th>
                <th className="px-4 py-3 font-normal">Stock</th>
                <th className="px-4 py-3 font-normal">Unit</th>
                <th className="px-4 py-3 text-right font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {items?.length ? (
                items.map((item) => {
                  const isLow = item.quantity <= item.reorder_threshold;
                  return (
                    <tr key={item.id} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-3 text-stone-800">{item.name}</td>
                      <td className="px-4 py-3 text-stone-600">{item.category}</td>
                      <td className="px-4 py-3 text-stone-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-stone-600">{item.unit}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            isLow
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {isLow ? "Low" : "OK"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-4 py-6 text-center text-stone-400" colSpan={5}>
                    No inventory items yet — add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
