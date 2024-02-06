import { prisma } from "@/lib/prisma/globalForPrisma";
import { schemaApiV1dbMessagesLastaccessPOST } from "@/lib/validators/db/lastaccess";
import { NextResponse } from "next/server";
import { z } from "zod";

type TTimestampResponse =
  | [
      {
        timestamp: { $date: string };
      }
    ]
  | [];
// TODO make it accept message ID and replace timestamp in last access with the timestamp for the message with the ID we sent
// updating last access array for a channel in DB
export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiV1dbMessagesLastaccessPOST.parse(reqBody);

    const aggreagateMessageTimestamp = (await prisma.channel.aggregateRaw({
      pipeline: [
        {
          // finding a channel with data.channel_name
          $match: {
            name: data.channel_name,
          },
        },
        {
          $unwind: "$messages",
        },
        {
          // finding a message with the provided message_id
          $match: {
            "messages.id": data.message_id,
          },
        },
        {
          // selecting timestamp for the message
          $project: {
            _id: 0,
            timestamp: "$messages.timestamp",
          },
        },
      ],
    })) as unknown as TTimestampResponse;

    if (aggreagateMessageTimestamp.length === 0)
      return NextResponse.json("Message not found", { status: 201 });
    // latest message timestamp
    const messageTimestamp = aggreagateMessageTimestamp[0].timestamp;

    // removing user from lastaccess array and adding with a new timestamp
    const result = await prisma.$runCommandRaw({
      update: "channel",
      updates: [
        {
          q: { name: data.channel_name },
          u: { $pull: { lastaccess: { user: data.user_id } } },
        },
        {
          q: { name: data.channel_name },
          u: {
            $push: {
              lastaccess: {
                user: data.user_id,
                timestamp: messageTimestamp,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
