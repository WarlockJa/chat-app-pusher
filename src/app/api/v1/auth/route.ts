import { schemaApiV1AuthPOST } from "@/lib/validators/auth/auth";
import { authenticate } from "@/util/jwt/authenticate";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  // TODO move api protection here
  try {
    const reqBody = await req.json();
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
