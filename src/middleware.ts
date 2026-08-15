import { type NextRequest, NextResponse } from "next/server";
import {
  createSupabaseMiddlewareClient,
  isAuthConfigured,
} from "@/lib/supabase/middleware";

const IS_PUBLIC_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  if (!isAuthConfigured() || IS_PUBLIC_DEMO_MODE) {
    return response;
  }

  const supabase = createSupabaseMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isInboxRoute =
    pathname === "/inbox" || pathname.startsWith("/inbox/");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (isInboxRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    const inboxUrl = request.nextUrl.clone();
    inboxUrl.pathname = "/inbox";
    inboxUrl.search = "";
    return NextResponse.redirect(inboxUrl);
  }

  return response;
}

export const config = {
  matcher: ["/inbox", "/inbox/:path*", "/login", "/signup"],
};
