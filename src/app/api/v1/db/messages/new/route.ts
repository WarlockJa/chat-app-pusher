import { prisma } from "@/lib/prisma/globalForPrisma";
import { TMessageDB } from "@/lib/prisma/prisma";
import {
  schemaApiV1dbMessagesNewGET,
  schemaApiV1dbMessagesNewPOST,
} from "@/lib/validators/db/messages/new";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// fetchin unread messages for the user
// jwt protected route
// role access: [owner, admin]
export async function GET(req: NextRequest) {
  try {
    // parsing params
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const channel_name = url.searchParams.get("channel_name");

    // validating params
    const data = schemaApiV1dbMessagesNewGET.parse({
      user_id,
      channel_name,
    });

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
                cond: { $eq: ["$$access.user_id", data.user_id] },
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
        {
          $unwind: "$messages", // Unwind the array to get a flat result
        },
        {
          $replaceRoot: { newRoot: "$messages" }, // Replace root to get the desired structure
        },
      ],
    })) as unknown as TMessageDB[];

    // parsing response from DB
    let unreadMessages: Message[];
    if (unreadMessagesFromDB.length > 0) {
      unreadMessages = unreadMessagesFromDB.map((message) => ({
        ...message,
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

// writing a new message to a channel in the DB
// jwt protected route
// role access: [owner, admin]
export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiV1dbMessagesNewPOST.parse(reqBody);

    const newMessageTimestamp = { $date: new Date() };

    // upserting message to the channel -> messages array
    const result = await prisma.$runCommandRaw({
      update: "channel",
      updates: [
        {
          q: {
            name: data.channel_name,
            "messages.id": { $ne: data.message_id },
          },
          u: {
            $push: {
              messages: {
                id: data.message_id,
                author: data.author,
                text: data.message_text,
                timestamp: newMessageTimestamp,
              },
            },
          },
          upsert: true,
        },
        {
          q: {
            name: data.channel_name,
          },
          u: {
            $set: {
              lastmessage: newMessageTimestamp,
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
