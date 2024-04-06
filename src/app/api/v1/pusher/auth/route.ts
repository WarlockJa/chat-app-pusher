import { pusherServer } from "@/lib/apiPusherMethods/pusher";
import { API_DELAY_MS } from "@/lib/globalSettings";
import { schemaApiV1PusherAuthPOST } from "@/lib/validators/pusher/auth";
import decipherSignature from "@/util/crypto/aes-cbc/decipherSignature";
import { NextRequest, NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { z } from "zod";

// creating presence channel based on the name of the user
// jwt unprotected route. protected by signature
// role access: [user]
export async function POST(req: NextRequest) {
  try {
    const data = await req.text();

    // TODO test. cleanup more like it
    // 'socket_id=176381.10063472&channel_name=presence-WJ&user_id=WJ'

    const [socket_id, channel_name, user_id, user_admin, user_name, signature] =
      data.split("&").map((str) => decodeURIComponent(str.split("=")[1]));

    // API endpoint protection
    try {
      const isAllowed =
        new Date(
          decipherSignature({
            signature,
            key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
          })
        ) > new Date(Date.now() - API_DELAY_MS);

      if (!isAllowed) throw new Error();
    } catch (error) {
      return NextResponse.json("Signature is missing or incorrect", {
        status: 403,
        statusText: "Unauthorized access",
      });
    }

    // data validation
    const validatedData = schemaApiV1PusherAuthPOST.parse({
      socket_id,
      channel_name,
      user_id,
      user_admin,
      user_name,
    });

    const presenceData: PresenceChannelData = {
      user_id: validatedData.user_id,
      user_info: {
        user_admin: validatedData.user_admin,
        user_name: validatedData.user_name,
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
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
