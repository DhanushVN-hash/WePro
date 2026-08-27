import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh Supabase session if necessary.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Login page must always remain accessible.
  const isPublicAdminPath =
    path === "/admin/login" ||
    path.startsWith("/admin/login/");

  // Only the configured admin email can access protected admin pages.
  const isAdmin =
    !!user &&
    !!process.env.ADMIN_EMAIL &&
    user.email?.toLowerCase() ===
      process.env.ADMIN_EMAIL.toLowerCase();

  // Protect all /admin pages except /admin/login.
  if (path.startsWith("/admin") && !isPublicAdminPath && !isAdmin) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";

    loginUrl.searchParams.set("redirectedFrom", path);

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};