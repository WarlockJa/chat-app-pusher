import { pusherServer } from "@/lib/pusher";
import { schemaPusherAuthPOST } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";

// creating presence channel based on the name of the user
export async function POST(req: NextRequest) {
  const data = await req.text();

  // TODO test
  // console.log(data);
  // 'socket_id=176381.10063472&channel_name=presence-WJ&user_id=WJ'

  const [socket_id, channel_name, user_id, user_admin] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  try {
    // data validation
    const validatedData = schemaPusherAuthPOST.parse({
      socket_id,
      channel_name,
      user_id,
      user_admin,
    });

    const presenceData: PresenceChannelData = {
      user_id: validatedData.user_id,
      user_info: {
        user_admin: validatedData.user_admin,
      },
    };
    const authResponse = pusherServer.authorizeChannel(
      validatedData.socket_id,
      validatedData.channel_name,
      presenceData
    );

    // console.log(authResponse);
    // {
    //   channel_data: '{"user_id":"WJ","user_admin":true}',
    //   auth:
    //     '4550f02015d4f306974a:4aa2000f6a3a419c77b767306dba046f44864ddd25bf40c85677f3faae514e3d'
    // }
    return NextResponse.json(authResponse);
  } catch (error) {
    return NextResponse.json(error);
  }
}
