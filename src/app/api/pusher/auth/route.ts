import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.text();

  // console.log(data);
  //   const body = req.body;
  const [socket_id, channel_name] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // Primitive auth: the client self-identifies. In your production app,
  // the client should provide a proof of identity, like a session cookie.
  // const user_id = cookies.user_id;
  const user_id = "TEST";
  const presenceData = { user_id };
  const authResponse = pusherServer.authorizeChannel(
    socket_id,
    channel_name,
    presenceData
  );
  return NextResponse.json(authResponse);
}
