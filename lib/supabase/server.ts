// Use this client in server components, server actions, and route
// handlers under /admin — e.g. DashboardPage, AdminProductsPage.
// It reads the session from cookies, so it knows who (if anyone) is
// logged in.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component during render,
            // where cookies can't be set. Safe to ignore here — the
            // middleware below is what actually refreshes the session.
          }
        },
      },
    }
  );
}