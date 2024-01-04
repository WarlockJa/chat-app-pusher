import { pusherServer } from "@/lib/pusher";
import { schemaPusherAuthPOST } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

// creating presence channel based on the name of the user
export async function POST(req: NextRequest) {
  const data = await req.text();

  console.log(data);
  // 'socket_id=176381.10063472&channel_name=presence-WJ&user_id=WJ'

  const [socket_id, channel_name, user_id] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  try {
    // data validation
    const validatedData = schemaPusherAuthPOST.parse({
      socket_id,
      channel_name,
      user_id,
    });

    const presenceData = { user_id: validatedData.user_id };
    const authResponse = pusherServer.authorizeChannel(
      validatedData.socket_id,
      validatedData.channel_name,
      presenceData
    );

    console.log(authResponse);
    // {
    //   channel_data: '{"user_id":"WJ"}',
    //   auth:
    //     '4550f02015d4f306974a:c42c6e64e1163832eefdc5168bb86fa803971e1935ee207025869b082651a018'
    // }
    return NextResponse.json(authResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
