import { prisma } from "@/lib/globalForPrisma";
import { schemaApiV1dbMessagesNewGET } from "@/lib/validators/db/new";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type TUnreadMessages = [
  {
    messages: Message[];
  }
];

export async function GET(req: NextRequest) {
  try {
    // parsing params
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const channel_name = url.searchParams.get("channel_name");

    // validating params
    const data = schemaApiV1dbMessagesNewGET.parse({ user_id, channel_name });

    // fetching unread messages from the channel using lastaccess timestamp
    const unreadMessagesFromDB = (await prisma.channel.aggregateRaw({
      pipeline: [
        {
          $match: { name: data.channel_name },
        },
        {
          $addFields: {
            userLastAccess: {
              $filter: {
                input: "$lastaccess",
                as: "access",
                cond: { $eq: ["$$access.user", data.user_id] },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            messages: {
              $cond: {
                if: { $gt: [{ $size: "$userLastAccess" }, 0] },
                then: {
                  $filter: {
                    input: "$messages",
                    as: "msg",
                    cond: {
                      $gt: [
                        "$$msg.timestamp",
                        { $arrayElemAt: ["$userLastAccess.timestamp", 0] },
                      ],
                    },
                  },
                },
                else: "$messages",
              },
            },
          },
        },
      ],
    })) as unknown as TUnreadMessages;

    // parsing response from DB
    let unreadMessages: Message[];
    if (unreadMessagesFromDB.length > 0) {
      unreadMessages = unreadMessagesFromDB[0].messages.map((message) => ({
        ...message,
        // @ts-ignore
        // NOTE: MongoDB pipeline returns date as an object { '$date': Date }
        timestamp: message.timestamp.$date,
      }));
    } else unreadMessages = [];

    return NextResponse.json(unreadMessages, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
