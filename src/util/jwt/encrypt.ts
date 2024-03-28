import { JWT_EXPIRATION_S } from "@/lib/globalSettings";
import { SignJWT } from "jose";

export async function encrypt({
  payload,
  secretKey,
}: {
  payload: any;
  secretKey: string;
}) {
  const key = new TextEncoder().encode(secretKey);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRATION_S} sec from now`)
    .sign(key);
}
