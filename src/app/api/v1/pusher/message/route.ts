import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { z } from "zod";
import { schemaApiV1PusherMessagePost } from "@/lib/validators/pusher/message";

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    // vaidating request body
    const data = schemaApiV1PusherMessagePost.parse(reqBody);

    pusherServer.trigger(data.activeRoom, "message", {
      message: data.message,
      author: data.author,
      id: data.id,
    });

    return NextResponse.json({ statusText: "OK", status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
