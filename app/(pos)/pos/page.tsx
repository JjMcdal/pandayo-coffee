import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";
import { SaleForm } from "./SaleForm";

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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-medium text-stone-800">New sale</h1>
          <LogoutButton />
        </div>

        <SaleForm menuItems={menuItems ?? []} />
      </div>
    </main>
  );
}