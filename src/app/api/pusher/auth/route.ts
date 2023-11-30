import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

// creating presence channel based on the name of the user
export async function POST(req: Request) {
  const data = await req.text();

  const [socket_id, channel_name] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // validating request
  if (!socket_id || !channel_name)
    return NextResponse.json(
      {},
      { status: 400, statusText: "Socket id and channel name required" }
    );

  // TODO think of making names unique by adding UUID
  const user_id = channel_name.split("presence-")[1];
  const presenceData = { user_id };
  const authResponse = pusherServer.authorizeChannel(
    socket_id,
    channel_name,
    presenceData
  );

  return NextResponse.json(authResponse);
}
