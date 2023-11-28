import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("test");
  const body = await req.json();
  //   const body = req.body;
  //   const {
  //     socket_id: socketId,
  //     channel_name: channel,
  //     cookies,
  //   } = await req.json();

  console.log(body);
  // Primitive auth: the client self-identifies. In your production app,
  // the client should provide a proof of identity, like a session cookie.
  //   const user_id = cookies.user_id;
  //   const presenceData = { user_id };
  //   const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  //   return NextResponse.json(authResponse);
  return NextResponse.json(body);
}
