import { NextResponse } from "next/server";
import { z } from "zod";
import { schemaApiV1PusherTypingPost } from "@/lib/validators/pusher/typing";
import decipherSignature from "@/util/crypto/aes-cbc/decipherSignature";
import { pusherServer } from "@/lib/apiPusherMethods/pusher";
import { API_DELAY_MS } from "@/lib/globalSettings";

export async function POST(req: Request) {
  // TODO made obsolete by jwt delete after test
  // // API endpoint protection
  // const encryptedHeader = req.headers.get("pusher-chat-signature") ?? "";
  // const isAllowed =
  //   new Date(
  //     decipherSignature({
  //       signature: encryptedHeader,
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     })
  //   ) > new Date(Date.now() - API_DELAY_MS);
  // if (!isAllowed)
  //   return NextResponse.json("Signature is missing or incorrect", {
  //     status: 403,
  //     statusText: "Unauthorized access",
  //   });

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
