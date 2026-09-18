import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = createClient();

  const { data: sales } = await supabase
    .from("sales")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: inventory } = await supabase
    .from("inventory_items")
    .select("*");

  const lowStock = inventory?.filter(
    (item) => item.quantity <= item.reorder_threshold
  );

  const todayTotal =
    sales?.reduce((sum, sale) => sum + Number(sale.total), 0) ?? 0;

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-lg font-medium text-stone-800">Admin overview</h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs text-stone-500">Recent sales total</p>
            <p className="text-xl font-medium text-stone-800">
              ₱{todayTotal.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs text-stone-500">Transactions</p>
            <p className="text-xl font-medium text-stone-800">
              {sales?.length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="text-xs text-stone-500">Low stock items</p>
            <p className="text-xl font-medium text-red-600">
              {lowStock?.length ?? 0}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="mb-3 text-sm font-medium text-stone-800">
            Recent sales
          </p>
          {sales?.length ? (
            <ul className="space-y-2 text-sm text-stone-600">
              {sales.map((sale) => (
                <li key={sale.id} className="flex justify-between">
                  <span>{new Date(sale.created_at).toLocaleString()}</span>
                  <span>₱{Number(sale.total).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-400">No sales recorded yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="mb-3 text-sm font-medium text-stone-800">
            Low stock
          </p>
          {lowStock?.length ? (
            <ul className="space-y-2 text-sm text-stone-600">
              {lowStock.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-red-600">
                    {item.quantity} {item.unit} left
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-400">
              Everything is above its reorder threshold.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
