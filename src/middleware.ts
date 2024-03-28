import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./util/jwt/updateSession";
import { getSession } from "./util/jwt/getSession";

// protected routes array
const protectedRoutes = ["/api/v1/db"];

export async function middleware(request: NextRequest) {
  // const pathname = request.nextUrl.pathname;

  // reading session data from JWT cookie
  const session = await getSession();

  if (!session) {
    // user not authenticated
    return NextResponse.json("authentication required", {
      status: 401,
      statusText: "authentication required",
    });
  } else {
    // updating session expiration date
    updateSession(request);
  }
}

export const config = {
  // TODO make better matcher? https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // Matcher ignoring `/_next/` and `/api/`
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: [
    "/api/v1/db/:path*",
    "/api/v1/pusher/message/:path*",
    "/api/v1/pusher/typing/:path*",
  ],
};
