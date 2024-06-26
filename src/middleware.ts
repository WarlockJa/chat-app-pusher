import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./util/jwt/updateSession";
import { getSession } from "./util/jwt/getSession";
import { validateRoleAccess } from "./lib/middleware/validateRoleAccess";

export async function middleware(request: NextRequest) {
  // reading session data from JWT cookie
  const session = await getSession();

  // user not authenticated
  if (!session) {
    return NextResponse.json("authentication required", {
      status: 401,
      statusText: "authentication required",
    });
  }

  // validating access based on user data in jwt accessToken
  validateRoleAccess(request, session);

  // updating session expiration date
  updateSession(request);
}

export const config = {
  matcher: [
    "/api/v1/db/:path*",
    "/api/v1/pusher/message/:path*",
    "/api/v1/pusher/typing/:path*",
  ],
};
