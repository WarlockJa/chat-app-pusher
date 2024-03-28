import { jwtVerify } from "jose";

export async function decrypt({
  input,
  secretKey,
}: {
  input: string;
  secretKey: string;
}): Promise<any> {
  const key = new TextEncoder().encode(secretKey);
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
