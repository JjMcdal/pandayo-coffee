"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// This action only writes to `sales` and `sale_items`. It does NOT
// touch inventory directly — the `on_sale_item_created` trigger in
// schema.sql does that automatically based on each menu item's
// recipe (menu_item_ingredients). That keeps the deduction logic in
// one place instead of duplicated in every place a sale can happen.

export type SaleFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function recordSale(
  _prevState: SaleFormState,
  formData: FormData
): Promise<SaleFormState> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("*");

  if (menuError) {
    return {
      status: "error",
      message: "Could not load menu items. Please try again.",
    };
  }

  const lineItems = (menuItems ?? [])
    .map((item) => {
      const qty = Number(formData.get(`qty_${item.id}`) ?? 0);
      return { item, qty };
    })
    .filter(({ qty }) => qty > 0);

  if (lineItems.length === 0) {
    return {
      status: "error",
      message: "Add at least one item before completing the sale.",
    };
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
    return {
      status: "error",
      message: saleError?.message ?? "Could not record the sale. Please try again.",
    };
  }

  const { error: itemsError } = await supabase.from("sale_items").insert(
    lineItems.map(({ item, qty }) => ({
      sale_id: sale.id,
      menu_item_id: item.id,
      quantity: qty,
      subtotal: item.price * qty,
    }))
  );

  if (itemsError) {
    return {
      status: "error",
      message:
        "Sale was recorded, but there was a problem saving the items. Please check with an admin.",
    };
  }

  // Refresh cached data on pages that depend on this sale.
  revalidatePath("/pos");
  revalidatePath("/admin");
  revalidatePath("/inventory");

  return { status: "success", message: `Sale completed — ₱${total.toFixed(2)}` };
}