import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options?: {
    domain?: string;
    encode?: (value: string) => string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
  };
};

// This is the core of the RBAC flow:
// 1. Refresh the Supabase session on every request.
// 2. "/" and "/login" are public.
// 3. Everything else requires a logged-in user, and which section
//    they're allowed into depends on their role:
//      - owner   -> /admin, /pos, and /inventory
//      - cashier -> /pos only
//      - staff   -> /inventory only
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const isServerAction = request.headers.get("next-action");

  if (isServerAction) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isLandingPage = path === "/";
  const isLoginPage = path.startsWith("/login");
  const isPublic = isLandingPage || isLoginPage;

  // Not logged in and trying to reach a protected section -> login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "staff";

    const homeFor: Record<string, string> = {
      owner: "/admin",
      cashier: "/pos",
      staff: "/inventory",
    };

    const isAdminArea = path.startsWith("/admin");
    const isPosArea = path.startsWith("/pos");
    const isInventoryArea = path.startsWith("/inventory");

    const allowed =
      role === "owner" ||
      (role === "cashier" && isPosArea) ||
      (role === "staff" && isInventoryArea);

    // Logged in and sitting on /login -> go straight to their section
    if (isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = homeFor[role];

      return NextResponse.redirect(url);
    }

    // Logged in but trying to reach a section their role doesn't cover
    if ((isAdminArea || isPosArea || isInventoryArea) && !allowed) {
      const url = request.nextUrl.clone();
      url.pathname = homeFor[role];

      return NextResponse.redirect(url);
    }
  }

  return response;
}