"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// This action only writes to `sales` and `sale_items`. It does NOT
// touch inventory directly — the `on_sale_item_created` trigger in
// schema.sql does that automatically based on each menu item's
// recipe (menu_item_ingredients). That keeps the deduction logic in
// one place instead of duplicated in every place a sale can happen.
//
// The client sends only item ids and quantities. Prices are always
// read from `menu_items` here, so the browser can never set a price.

export type SaleFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const MAX_QTY_PER_ITEM = 99;

type CartLine = { id: string; qty: number };

function parseCart(raw: FormDataEntryValue | null): CartLine[] | null {
  if (typeof raw !== "string") return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed)) return null;

  // Merge duplicate ids so each menu item becomes one sale_items row.
  const merged = new Map<string, number>();

  for (const line of parsed) {
    const candidate = line as Partial<CartLine>;
    const qty = Number(candidate.qty);

    if (
      typeof candidate.id !== "string" ||
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > MAX_QTY_PER_ITEM
    ) {
      return null;
    }

    merged.set(
      candidate.id,
      Math.min((merged.get(candidate.id) ?? 0) + qty, MAX_QTY_PER_ITEM)
    );
  }

  return [...merged].map(([id, qty]) => ({ id, qty }));
}

export async function recordSale(
  _prevState: SaleFormState,
  formData: FormData
): Promise<SaleFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Your session expired. Please log in again." };
  }

  // Middleware skips server actions, so this is the real RBAC check
  // for recording sales. Only owner and cashier may pass.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner" && profile?.role !== "cashier") {
    return {
      status: "error",
      message: "Your account is not allowed to record sales.",
    };
  }

  const cart = parseCart(formData.get("cart"));

  if (!cart || cart.length === 0) {
    return {
      status: "error",
      message: "Add at least one item before checking out.",
    };
  }

  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("id, price")
    .in(
      "id",
      cart.map((line) => line.id)
    )
    .eq("is_available", true);

  if (menuError) {
    return {
      status: "error",
      message: "Could not load menu items. Please try again.",
    };
  }

  const priceById = new Map(
    (menuItems ?? []).map((item) => [item.id as string, Number(item.price)])
  );

  if (priceById.size !== cart.length) {
    return {
      status: "error",
      message:
        "Some items are no longer available. Refresh the page and try again.",
    };
  }

  const lines = cart.map(({ id, qty }) => ({
    id,
    qty,
    subtotal: (priceById.get(id) ?? 0) * qty,
  }));

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({ cashier_id: user.id, total })
    .select()
    .single();

  if (saleError || !sale) {
    return {
      status: "error",
      message: saleError?.message ?? "Could not record the sale. Please try again.",
    };
  }

  const { error: itemsError } = await supabase.from("sale_items").insert(
    lines.map((line) => ({
      sale_id: sale.id,
      menu_item_id: line.id,
      quantity: line.qty,
      subtotal: line.subtotal,
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