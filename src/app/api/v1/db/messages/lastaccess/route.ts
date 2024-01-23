import { prisma } from "@/lib/globalForPrisma";
import { schemaApiV1dbMessagesLastaccessPOST } from "@/lib/validators/db/lastaccess";
import { NextResponse } from "next/server";
import { z } from "zod";

type TLatestTimestampResponse = [
  {
    _id: { $oid: string };
    latestTimestamp: { [date_key: string]: string };
  }
];
// updating last access array for a channel in DB
export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiV1dbMessagesLastaccessPOST.parse(reqBody);

    // fetching aggregated data with latest timestamp form messages array and lastaccess array
    const aggregateLatestMessageTimestamp = (await prisma.channel.aggregateRaw({
      pipeline: [
        {
          $match: { name: data.channel_name },
        },
        {
          $project: {
            _id: 0,
            latestTimestamp: {
              $arrayElemAt: ["$messages.timestamp", -1],
            },
          },
        },
      ],
    })) as unknown as TLatestTimestampResponse;

    // latest message timestamp
    const lastMessageTimestamp =
      aggregateLatestMessageTimestamp[0].latestTimestamp;

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
                timestamp: lastMessageTimestamp,
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