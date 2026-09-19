"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// This action authenticates AND redirects. Redirecting here (instead
// of just returning and letting middleware catch the next request)
// sidesteps a Next.js dev-server bug where a middleware redirect in
// response to a Server Action call fails with "fetch failed". The
// role lookup still lives here, so this is still the RBAC decision
// point: auth answers "who are you", the role lookup answers "where
// do you belong". Middleware still protects direct navigation to
// /admin, /pos, /inventory afterwards.
export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const homeFor: Record<string, string> = {
    owner: "/admin",
    cashier: "/pos",
    staff: "/inventory",
  };

  redirect(homeFor[profile?.role ?? "staff"]);
}