import { NextResponse } from "next/server";
import { z } from "zod";
import { schemaApiV1PusherMessagePost } from "@/lib/validators/pusher/message";
import { pusherServer } from "@/lib/apiPusherMethods/pusher";

// sending "message" event via Pusher
// jwt protected route
// role access: [owner, admin]
export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    // vaidating request body
    const data = schemaApiV1PusherMessagePost.parse(reqBody);

    pusherServer.trigger(data.channel_name, "message", {
      message: data.message,
      author: data.author,
      message_id: data.message_id,
    });

    return NextResponse.json({ statusText: "OK", status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
