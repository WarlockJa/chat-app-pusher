import { NextRequest, NextResponse } from "next/server";

// protecting routes from access from outside of the app
// NEXT_PUBLIC_API_ACCESS_TOKEN environmental variable is used to verify that
// request is launched from the app front-end and passed inside of the custom
// header "pusher-chat-signature"
// in this middleware all routes for /api/v1 are covered
export function middleware(request: NextRequest) {
  // Check the origin from the request
  const signature = request.headers.get("pusher-chat-signature") ?? "";
  const isAllowed = signature === process.env.NEXT_PUBLIC_API_ACCESS_TOKEN;

  console.log("Signature: ", signature);

  return isAllowed
    ? NextResponse.next()
    : NextResponse.json(
        { success: false, message: "Signature not found or incorrect" },
        { status: 403 }
      );
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: "/api/v1/:path*",
};
