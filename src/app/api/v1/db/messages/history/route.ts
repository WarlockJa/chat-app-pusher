import { prisma } from "@/lib/globalForPrisma";
import { TUnreadMessages } from "@/lib/prisma";
import {
  schemaApiV1dbMessagesHistoryGET,
  schemaApiV1dbMessagesHistoryPOST,
} from "@/lib/validators/db/history";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// fetching a chat room data from DB
// TODO add pagination
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const channel_name = url.searchParams.get("channel_name");

    // validating params
    const data = schemaApiV1dbMessagesHistoryGET.parse({
      user_id,
      channel_name,
    });

    // const messages = await prisma.channel.findUnique({
    //   where: {
    //     name: data.roomId,
    //   },
    // });
    // fetching unread messages from the channel using lastaccess timestamp
    const readMessagesFromDB = (await prisma.channel.aggregateRaw({
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
                      $lte: [
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
    let readMessages: Message[];
    if (readMessagesFromDB.length > 0) {
      readMessages = readMessagesFromDB[0].messages.map((message) => ({
        ...message,
        // @ts-ignore
        // NOTE: MongoDB pipeline returns date as an object { '$date': Date }
        timestamp: message.timestamp.$date,
      }));
    } else readMessages = [];

    return NextResponse.json(readMessages, { status: 200 });
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
    const data = schemaApiV1dbMessagesHistoryPOST.parse(reqBody);

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
