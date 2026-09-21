import { createClient } from "@/lib/supabase/server";
import {
  addInventoryItem,
  updateInventoryItem,
} from "./actions";

export default async function InventoryPage() {
  const supabase = createClient();

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

            <p className="mt-2 text-sm text-red-600">
              {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

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

          <details className="relative">
            <summary className="cursor-pointer list-none rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">
              Add item
            </summary>

            <div className="absolute right-0 z-10 mt-3 w-80 rounded-xl border border-stone-200 bg-white p-5 shadow-lg">
              <h2 className="mb-4 text-base font-medium text-stone-800">
                Add inventory item
              </h2>

              <form action={addInventoryItem} className="space-y-3">
                <div>
                  <label
                    htmlFor="add-name"
                    className="mb-1 block text-xs font-medium text-stone-600"
                  >
                    Item name
                  </label>

                  <input
                    id="add-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Coffee beans"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="add-category"
                    className="mb-1 block text-xs font-medium text-stone-600"
                  >
                    Category
                  </label>

                  <input
                    id="add-category"
                    name="category"
                    type="text"
                    required
                    placeholder="Ingredients"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="add-quantity"
                      className="mb-1 block text-xs font-medium text-stone-600"
                    >
                      Quantity
                    </label>

                    <input
                      id="add-quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      placeholder="10"
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="add-unit"
                      className="mb-1 block text-xs font-medium text-stone-600"
                    >
                      Unit
                    </label>

                    <input
                      id="add-unit"
                      name="unit"
                      type="text"
                      required
                      placeholder="kg"
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="add-threshold"
                    className="mb-1 block text-xs font-medium text-stone-600"
                  >
                    Reorder threshold
                  </label>

                  <input
                    id="add-threshold"
                    name="reorder_threshold"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="5"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
                >
                  Save item
                </button>
              </form>
            </div>
          </details>
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
                  <th className="px-4 py-3 text-right font-normal">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {items?.length ? (
                  items.map((item) => {
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

                        <td className="px-4 py-4 text-stone-600">
                          {quantity}
                        </td>

                        <td className="px-4 py-4 text-stone-600">
                          {item.unit}
                        </td>

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
                                Edit item
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

                                <div>
                                  <label
                                    htmlFor={`name-${item.id}`}
                                    className="mb-1 block text-xs font-medium text-stone-600"
                                  >
                                    Item name
                                  </label>

                                  <input
                                    id={`name-${item.id}`}
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={item.name}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`category-${item.id}`}
                                    className="mb-1 block text-xs font-medium text-stone-600"
                                  >
                                    Category
                                  </label>

                                  <input
                                    id={`category-${item.id}`}
                                    name="category"
                                    type="text"
                                    required
                                    defaultValue={item.category}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label
                                      htmlFor={`quantity-${item.id}`}
                                      className="mb-1 block text-xs font-medium text-stone-600"
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
                                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor={`unit-${item.id}`}
                                      className="mb-1 block text-xs font-medium text-stone-600"
                                    >
                                      Unit
                                    </label>

                                    <input
                                      id={`unit-${item.id}`}
                                      name="unit"
                                      type="text"
                                      required
                                      defaultValue={item.unit}
                                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label
                                    htmlFor={`threshold-${item.id}`}
                                    className="mb-1 block text-xs font-medium text-stone-600"
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
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600"
                                  />
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