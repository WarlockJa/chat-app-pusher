import { pusherServer } from "@/lib/pusher";
import { regexAlphanumericWithDash } from "@/util/regExes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const schemaPOST = z.object({
  socket_id: z.string({ required_error: "Required socket_id" }),
  channel_name: z.string({ required_error: "Required channel_name" }),
  user_id: z
    .string({ required_error: "Required user_id" })
    .max(36, { message: "Maximum length for userId is 36" })
    .regex(regexAlphanumericWithDash, {
      message: "UserId may only contains alphanumerical characters and dash",
    }), // TODO add .uuid()
});
// creating presence channel based on the name of the user
export async function POST(req: NextRequest) {
  const data = await req.text();

  console.log(data);

  const [socket_id, channel_name, user_id] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // data validation
  const validatedData = schemaPOST.parse({
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

  return NextResponse.json(authResponse);
}
