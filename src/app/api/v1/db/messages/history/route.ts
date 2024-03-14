import { prisma } from "@/lib/prisma/globalForPrisma";
import { TMessageDB } from "@/lib/prisma/prisma";
import { schemaApiV1dbMessagesHistoryGET } from "@/lib/validators/db/messages/history";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// fetching a page of messages from DB
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    // <channel_name>. Used in DB -> collection: channel -> document: <any> -> name: <channel_name>
    const channel_name = url.searchParams.get("channel_name");
    // <message_id>. Used in DB -> collection: channel -> document: <any> -> messages: [<any>] -> { id: <message_id>, timestamp: Date }
    const message_id = url.searchParams.get("message_id");
    // number of messages to be sent as a result
    const limit = Number(url.searchParams.get("limit"));

    // validating params
    const data = schemaApiV1dbMessagesHistoryGET.parse({
      message_id,
      channel_name,
      limit,
    });

    // processing optional parameters
    const currentLimit = data.limit ? data.limit : 30;
    const currentMessageID = data.message_id ? data.message_id : "empty";

    // fetching page of messages that are earlier than the timestamp of the message_id provided
    const messagesPage = (await prisma.channel.aggregateRaw({
      pipeline: [
        {
          $match: { name: data.channel_name },
        },
        // finding timestamp of the message with the message_id
        {
          $addFields: {
            messageTimestamp: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: { $eq: ["$$message.id", currentMessageID] },
              },
            },
          },
        },
        // finding all messages with timestamp earlier than timestamp of the message with message_id
        {
          $project: {
            _id: 0,
            messages: {
              $cond: {
                if: { $gt: [{ $size: "$messageTimestamp" }, 0] },
                then: {
                  $filter: {
                    input: "$messages",
                    as: "msg",
                    cond: {
                      $lt: [
                        "$$msg.timestamp",
                        {
                          $arrayElemAt: ["$messageTimestamp.timestamp", 0],
                        },
                      ],
                    },
                  },
                },
                else: "$messages",
              },
            },
          },
        },
        // flatteting resulting array
        {
          $unwind: "$messages",
        },
        // sorting messages so limit takes the latest
        {
          $sort: { "messages.timestamp": -1 },
        },
        // taking limit + 1 to detect hasMore
        {
          $limit: currentLimit + 1,
        },
        // sorting limited result back by the timestamp in ascending order
        {
          $sort: { "messages.timestamp": 1 },
        },
        // adjusting array structure for a better result
        {
          $replaceRoot: { newRoot: "$messages" },
        },
      ],
    })) as unknown as TMessageDB[];

    // generating hasMore result
    // messagesPage attempts to fetch one message over the limit. if that message exists hasMore is true
    const hasMore = messagesPage.length === currentLimit + 1;

    // removing hasMore defining message from the result
    const resultMessagesPage = hasMore ? messagesPage.slice(1) : messagesPage;

    // parsing date in the response from DB
    let readMessages: Message[];
    if (resultMessagesPage.length > 0) {
      readMessages = resultMessagesPage.map((message) => ({
        ...message,
        timestamp: message.timestamp.$date,
      }));
    } else readMessages = [];

    return NextResponse.json(
      {
        messages: readMessages,
        hasMore,
      },
      { status: 200 }
    );
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
