import { API_DELAY_MS } from "@/lib/globalSettings";
import { prisma } from "@/lib/prisma/globalForPrisma";
import { schemaApiV1dbChannelOwnerGET } from "@/lib/validators/db/channel/owner/owner";
import decipherSignature from "@/util/crypto/aes-cbc/decipherSignature";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// fetching channel's owner data data
export async function GET(req: NextRequest) {
  // API endpoint protection
  const encryptedHeader = req.headers.get("pusher-chat-signature") ?? "";
  const isAllowed =
    new Date(
      decipherSignature({
        signature: encryptedHeader,
        key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
      })
    ) > new Date(Date.now() - API_DELAY_MS);
  if (!isAllowed)
    return NextResponse.json("Signature is missing or incorrect", {
      status: 403,
      statusText: "Unauthorized access",
    });

  try {
    const url = new URL(req.url);
    // <channel_name>. Used in DB -> collection: channel -> document: <any> -> name: <channel_name>
    const channel_name = url.searchParams.get("channel_name");
    // validating params
    const data = schemaApiV1dbChannelOwnerGET.parse({
      channel_name,
    });
    const result = await prisma.channel.findUnique({
      where: {
        name: data.channel_name,
      },
      select: {
        owner: true,
      },
    });

    return NextResponse.json(result?.owner, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
