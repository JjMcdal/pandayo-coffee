import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";
import { INVENTORY_CATALOG } from "@/lib/inventory-catalog";
import { updateInventoryItem } from "./actions";
import { AddItemForm } from "./AddItemForm";

export default async function InventoryPage() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("name");

  if (error) {
    return (
      <main className="min-h-screen bg-stone-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-medium text-red-800">
              Failed to load inventory
            </h1>

            <p className="mt-2 text-sm text-red-600">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  // Only offer catalog items that are not in inventory yet.
  const existing = new Set(
    (items ?? []).map((i: any) => String(i.name).toLowerCase())
  );
  const availableNames = INVENTORY_CATALOG.filter(
    (i) => !existing.has(i.name.toLowerCase())
  ).map((i) => i.name);

  const inputClass =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600";
  const labelClass = "mb-1 block text-xs font-medium text-stone-600";

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-800">
              Inventory
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage stock items and reorder levels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">
                Add item
              </summary>

              <div className="absolute right-0 z-10 mt-3 w-80 rounded-xl border border-stone-200 bg-white p-5 shadow-lg">
                <h2 className="mb-4 text-base font-medium text-stone-800">
                  Add inventory item
                </h2>

                <AddItemForm availableNames={availableNames} />
              </div>
            </details>

            <LogoutButton />
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="px-4 py-3 font-normal">Item</th>
                  <th className="px-4 py-3 font-normal">Category</th>
                  <th className="px-4 py-3 font-normal">Stock</th>
                  <th className="px-4 py-3 font-normal">Unit</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 text-right font-normal">Action</th>
                </tr>
              </thead>

              <tbody>
                {items?.length ? (
                  items.map((item: any) => {
                    const quantity = Number(item.quantity ?? 0);
                    const reorderThreshold = Number(
                      item.reorder_threshold ?? 0
                    );

                    const isLow = quantity <= reorderThreshold;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-stone-100 last:border-0"
                      >
                        <td className="px-4 py-4 font-medium text-stone-800">
                          {item.name}
                        </td>

                        <td className="px-4 py-4 text-stone-600">
                          {item.category}
                        </td>

                        <td className="px-4 py-4 text-stone-600">{quantity}</td>

                        <td className="px-4 py-4 text-stone-600">{item.unit}</td>

                        <td className="px-4 py-4">
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

                        <td className="px-4 py-4 text-right">
                          <details className="relative inline-block text-left">
                            <summary className="cursor-pointer list-none rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50">
                              Edit
                            </summary>

                            <div className="absolute right-0 z-10 mt-2 w-80 rounded-xl border border-stone-200 bg-white p-5 text-left shadow-lg">
                              <h2 className="mb-4 text-base font-medium text-stone-800">
                                {item.name}{" "}
                                <span className="text-stone-400">
                                  ({item.unit})
                                </span>
                              </h2>

                              <form
                                action={updateInventoryItem}
                                className="space-y-3"
                              >
                                <input
                                  type="hidden"
                                  name="id"
                                  value={item.id}
                                />

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label
                                      htmlFor={`quantity-${item.id}`}
                                      className={labelClass}
                                    >
                                      Quantity
                                    </label>

                                    <input
                                      id={`quantity-${item.id}`}
                                      name="quantity"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      required
                                      defaultValue={quantity}
                                      className={inputClass}
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor={`threshold-${item.id}`}
                                      className={labelClass}
                                    >
                                      Reorder threshold
                                    </label>

                                    <input
                                      id={`threshold-${item.id}`}
                                      name="reorder_threshold"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      required
                                      defaultValue={reorderThreshold}
                                      className={inputClass}
                                    />
                                  </div>
                                </div>

                                <button
                                  type="submit"
                                  className="w-full rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                                >
                                  Save changes
                                </button>
                              </form>
                            </div>
                          </details>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      className="px-4 py-8 text-center text-stone-400"
                      colSpan={6}
                    >
                      No inventory items yet — add your first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}