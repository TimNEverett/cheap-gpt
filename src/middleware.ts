import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "./lib/database.types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res });
  //check for auth session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  //check if route contains /auth
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth/");
  //user logged in
  if (session !== null) {
    //if visiting protected route, allow
    if (!isAuthRoute) {
      return res;
    } else {
      //if visiting auth route, redirect to home page
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  } else {
    //use not logged in but visiting auth route, allow
    if (isAuthRoute) {
      return res;
    }
  }

  // Auth condition not met, redirect to login page.
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/auth/login";
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
