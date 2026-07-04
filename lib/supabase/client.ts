// Use this client in "use client" components — e.g. the login page,
// or the public enquiry form. Session is stored in cookies (not
// localStorage), so the server can see it too.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}