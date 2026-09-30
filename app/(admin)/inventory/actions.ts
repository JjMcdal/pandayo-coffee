"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { findCatalogItem } from "../../../lib/inventory-catalog";

export type AddItemState = {
  error?: string;
  name?: string;
};

function getRequiredString(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function getRequiredNumber(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${field} must be a valid non-negative number.`);
  }

  return number;
}

// Middleware skips server actions, so this is the real RBAC check for
// inventory writes. Only owner and staff may pass.
async function requireInventoryAccess() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/pos");
  }

  const role = profile.role;

  if (role !== "owner" && role !== "staff") {
    redirect("/pos");
  }

  return supabase;
}

export async function addInventoryItem(
  _prevState: AddItemState,
  formData: FormData
): Promise<AddItemState> {
  const supabase = await requireInventoryAccess();

  const rawName = String(formData.get("name") ?? "");
  const catalogItem = findCatalogItem(rawName);

  // Reject anything that is not on the Pandayo Coffee catalog.
  if (!catalogItem) {
    return {
      name: rawName,
      error: `"${rawName.trim()}" is not a valid Pandayo Coffee inventory item. Pick one from the suggestions.`,
    };
  }

  let quantity: number;
  let reorderThreshold: number;

  try {
    quantity = getRequiredNumber(formData, "quantity");
    reorderThreshold = getRequiredNumber(formData, "reorder_threshold");
  } catch (e) {
    return {
      name: rawName,
      error: e instanceof Error ? e.message : "Invalid input.",
    };
  }

  const { error } = await supabase.from("inventory_items").insert({
    name: catalogItem.name, // canonical spelling from the catalog
    category: catalogItem.category, // derived, never taken from the form
    unit: catalogItem.unit, // derived, never taken from the form
    quantity,
    reorder_threshold: reorderThreshold,
  });

  if (error) {
    return {
      name: rawName,
      // 23505 = unique violation (item already exists)
      error:
        error.code === "23505"
          ? `${catalogItem.name} is already in inventory.`
          : error.message,
    };
  }

  revalidatePath("/inventory");
  redirect("/inventory");
}

// Name, category, and unit are fixed once an item exists (changing the unit
// would silently break recipe deductions). Only stock numbers can change.
export async function updateInventoryItem(formData: FormData) {
  const supabase = await requireInventoryAccess();

  const id = getRequiredString(formData, "id");
  const quantity = getRequiredNumber(formData, "quantity");
  const reorderThreshold = getRequiredNumber(formData, "reorder_threshold");

  const { error } = await supabase
    .from("inventory_items")
    .update({
      quantity,
      reorder_threshold: reorderThreshold,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/inventory");
  redirect("/inventory");
}