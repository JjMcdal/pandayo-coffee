"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

export async function addInventoryItem(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = getRequiredString(formData, "name");
  const category = getRequiredString(formData, "category");
  const quantity = getRequiredNumber(formData, "quantity");
  const unit = getRequiredString(formData, "unit");
  const reorderThreshold = getRequiredNumber(
    formData,
    "reorder_threshold"
  );

  const { error } = await supabase.from("inventory_items").insert({
    name,
    category,
    quantity,
    unit,
    reorder_threshold: reorderThreshold,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function updateInventoryItem(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = getRequiredString(formData, "id");
  const name = getRequiredString(formData, "name");
  const category = getRequiredString(formData, "category");
  const quantity = getRequiredNumber(formData, "quantity");
  const unit = getRequiredString(formData, "unit");
  const reorderThreshold = getRequiredNumber(
    formData,
    "reorder_threshold"
  );

  const { error } = await supabase
    .from("inventory_items")
    .update({
      name,
      category,
      quantity,
      unit,
      reorder_threshold: reorderThreshold,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/inventory");
  redirect("/inventory");
}