import { decrypt } from "./decrypt";
import { cookies } from "next/headers";

export async function getSession(): Promise<ISession | null> {
  const session = cookies().get("pusher-chat")?.value;
  if (!session) return null;
  return await decrypt({
    input: session,
    secretKey: process.env.NEXT_PUBLIC_API_JWT_SECRET!,
  });
}
