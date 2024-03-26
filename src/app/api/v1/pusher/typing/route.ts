import { NextResponse } from "next/server";
import { z } from "zod";
import { schemaApiV1PusherTypingPost } from "@/lib/validators/pusher/typing";
import decipherSignature from "@/util/crypto/decipherSignature";
import { pusherServer } from "@/lib/apiPusherMethods/pusher";

export async function POST(req: Request) {
  // API endpoint protection
  const encryptedHeader = req.headers.get("pusher-chat-signature") ?? "";
  const isAllowed =
    decipherSignature({
      signature: encryptedHeader,
      key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
    }) === process.env.NEXT_PUBLIC_API_SIGNATURE_KEY;
  if (!isAllowed)
    return NextResponse.json("Signature is missing or incorrect", {
      status: 403,
      statusText: "Unauthorized access",
    });

  try {
    const reqBody = await req.json();
    // vaidating request body
    const data = schemaApiV1PusherTypingPost.parse(reqBody);

    pusherServer.trigger(data.activeRoom, "typing", {
      author: data.author,
    });

    return NextResponse.json({ statusText: "OK", status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
