import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./decrypt";
import { encrypt } from "./encrypt";
import { JWT_EXPIRATION_S } from "@/lib/globalSettings";

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("pusher-chat")?.value;
  if (!session) {
    console.log(session);
    return NextResponse.json("authentication required", {
      status: 401,
      statusText: "authentication required",
    });
  }

  // Refresh the session so it doesn't expire
  const parsed = await decrypt({
    input: session,
    secretKey: process.env.NEXT_PUBLIC_API_JWT_SECRET!,
  });
  parsed.expires = new Date(Date.now() + JWT_EXPIRATION_S * 1000);

  const res = NextResponse.next();
  res.cookies.set({
    name: "pusher-chat",
    value: await encrypt({
      payload: parsed,
      secretKey: process.env.NEXT_PUBLIC_API_JWT_SECRET!,
    }),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
