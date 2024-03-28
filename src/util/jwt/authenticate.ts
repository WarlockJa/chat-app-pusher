import { JWT_EXPIRATION_S } from "@/lib/globalSettings";
import { encrypt } from "./encrypt";
import { cookies } from "next/headers";

export async function authenticate({
  user_id,
  user_admin,
}: {
  user_id: string;
  user_admin: boolean;
}) {
  // userToken data is validated in /api/v1/auth route
  const userToken = { user_id, user_admin };

  // Create the session
  const expires = new Date(Date.now() + JWT_EXPIRATION_S * 1000);
  const session = await encrypt({
    payload: { userToken, expires },
    secretKey: process.env.NEXT_PUBLIC_API_JWT_SECRET!,
  });

  // Save the session in a cookie
  cookies().set("pusher-chat", session, { expires, httpOnly: true });
}
