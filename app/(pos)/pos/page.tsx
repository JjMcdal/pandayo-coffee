import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/AppHeader";
import { Sidebar, type Role } from "@/components/Sidebar";
import { PosClient } from "./PosClient";

export default async function PosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role ?? "staff") as Role;
  const name = profile?.full_name || user.email || "User";

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("id, name, price, category, image_url")
    .eq("is_available", true)
    .order("name");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader section="POS" name={name} role={role} />

      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar role={role} />
        <PosClient menuItems={menuItems ?? []} />
      </div>
    </div>
  );
}