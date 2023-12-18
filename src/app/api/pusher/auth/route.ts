import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

// creating presence channel based on the name of the user
export async function POST(req: NextRequest) {
  const data = await req.text();

  console.log(data);

  const [socket_id, channel_name, user_id] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // validating request
  if (!socket_id || !channel_name || !user_id)
    return NextResponse.json(
      {},
      {
        status: 400,
        statusText: "Socket id, user id, and channel name required",
      }
    );

  const presenceData = { user_id };
  const authResponse = pusherServer.authorizeChannel(
    socket_id,
    channel_name,
    presenceData
  );

  return NextResponse.json(authResponse);
}
