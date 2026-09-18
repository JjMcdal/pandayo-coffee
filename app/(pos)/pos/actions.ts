"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// This action only writes to `sales` and `sale_items`. It does NOT
// touch inventory directly — the `on_sale_item_created` trigger in
// schema.sql does that automatically based on each menu item's
// recipe (menu_item_ingredients). That keeps the deduction logic in
// one place instead of duplicated in every place a sale can happen.
export async function recordSale(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: menuItems } = await supabase.from("menu_items").select("*");

  const lineItems = (menuItems ?? [])
    .map((item) => {
      const qty = Number(formData.get(`qty_${item.id}`) ?? 0);
      return { item, qty };
    })
    .filter(({ qty }) => qty > 0);

  if (lineItems.length === 0) {
    return;
  }

  const total = lineItems.reduce(
    (sum, { item, qty }) => sum + item.price * qty,
    0
  );

  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({ cashier_id: user?.id, total })
    .select()
    .single();

  if (saleError || !sale) {
    return;
  }

  await supabase.from("sale_items").insert(
    lineItems.map(({ item, qty }) => ({
      sale_id: sale.id,
      menu_item_id: item.id,
      quantity: qty,
      subtotal: item.price * qty,
    }))
  );

  redirect("/pos");
}
