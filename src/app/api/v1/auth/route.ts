import { API_DELAY_MS } from "@/lib/globalSettings";
import { schemaApiV1AuthPOST } from "@/lib/validators/auth/auth";
import decipherSignature from "@/util/crypto/aes-cbc/decipherSignature";
import { authenticate } from "@/util/jwt/authenticate";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// user authentication end-point
// jwt unprotected route. protected by signature
// role access: [user]
export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    // API endpoint protection
    try {
      const isAllowed =
        new Date(
          decipherSignature({
            signature: reqBody.signature,
            key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
          })
        ) > new Date(Date.now() - API_DELAY_MS);
      if (!isAllowed) throw new Error();
    } catch (error) {
      return NextResponse.json("Signature is missing or incorrect", {
        status: 403,
        statusText: "Unauthorized access",
      });
    }
    // data validation
    const data = schemaApiV1AuthPOST.parse(reqBody);

    // generating JWT and setting an httpOnly cookie
    await authenticate({
      user_id: data.user_id,
      user_admin: data.user_admin,
    });

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
