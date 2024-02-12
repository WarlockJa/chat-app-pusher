import { pusherServer } from "@/lib/pusher/pusher";
import { NextResponse } from "next/server";
import { z } from "zod";
import { schemaApiV1PusherTypingPost } from "@/lib/validators/pusher/typing";

export async function POST(req: Request) {
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
