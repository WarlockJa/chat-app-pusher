import { prisma } from "@/lib/globalForPrisma";
import {
  schemaApiDBGET,
  schemaApiDBPOST,
  schemaApiDBPUT,
} from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserTimestamp } from "@prisma/client";

// fetching a chat room data from DB
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");

    const data = schemaApiDBGET.parse({ roomId });

    const messages = await prisma.channel.findUnique({
      where: {
        name: data.roomId,
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}

// writing a message to a channel in DB
export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiDBPOST.parse(reqBody);

    // TODO upsert somehow?
    const channel = await prisma.channel.findUnique({
      where: {
        name: data.room,
      },
    });

    let result;
    if (channel) {
      result = await prisma.channel.update({
        where: {
          name: data.room,
        },
        data: {
          messages: {
            push: [
              {
                text: data.message,
                author: data.userId,
              },
            ],
          },
        },
      });
    } else {
      result = await prisma.channel.create({
        data: {
          name: data.room,
          messages: [
            {
              author: data.userId,
              text: data.message,
            },
          ],
          lastaccess: [],
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}

type TLatestTimestampResponse = [
  {
    _id: { $oid: string };
    latestTimestamp: { [date_key: string]: string };
  }
];
// updating last access array for a channel in DB
export async function PUT(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiDBPUT.parse(reqBody);

    // fetching aggregated data with latest timestamp form messages array and lastaccess array
    const aggregateLatestMessageTimestamp = (await prisma.channel.aggregateRaw({
      pipeline: [
        {
          $match: { name: data.channel_name },
        },
        {
          $project: {
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
