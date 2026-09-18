"use server";

import { createClient } from "@/lib/supabase/server";

// Note: this action just authenticates. It does NOT decide where the
// user ends up — middleware.ts owns that decision by reading the
// user's role from `profiles` after sign-in. That's the RBAC split:
// auth answers "who are you", middleware answers "where do you belong".
export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  return { error: null };
}
