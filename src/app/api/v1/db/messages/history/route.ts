import { prisma } from "@/lib/prisma/globalForPrisma";
import { TMessageDB } from "@/lib/prisma/prisma";
import {
  schemaApiV1dbMessagesHistoryGET,
  schemaApiV1dbMessagesHistoryPOST,
} from "@/lib/validators/db/history";
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

    // removing additional message from the result
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

// TODO delete
// // fetching a chat room data from DB
// export async function GET(req: NextRequest) {
//   try {
//     const url = new URL(req.url);
//     // <user_id>. Used in DB -> collection: channel -> document: <any> -> lastaccess: [<any>] -> { user: <user_id>, timestamp: Date }
//     const user_id = url.searchParams.get("user_id");
//     // <channel_name>. Used in DB -> collection: channel -> document: <any> -> name: <channel_name>
//     const channel_name = url.searchParams.get("channel_name");
//     // number of messages to be sent as a result
//     const limit = Number(url.searchParams.get("limit"));
//     // number of messages to skip starting from the oldest in DB -> collection: channel -> messages: [<Message>] -> {..., timestamp: Date }.
//     // If <skip> is NaN <result> will contain total number of available messages and a <limit> amount of newest messages
//     const skip = Number(url.searchParams.get("skip"));

//     // validating params
//     const data = schemaApiV1dbMessagesHistoryGET.parse({
//       user_id,
//       channel_name,
//       limit,
//       skip,
//     });

//     // if data.skip is NaN fetching total count of history messages from the DB
//     const totalNumberOfMessages = isNaN(data.skip as number)
//       ? (
//           (await prisma.channel.aggregateRaw({
//             pipeline: [
//               {
//                 $match: { name: data.channel_name },
//               },
//               {
//                 $addFields: {
//                   userLastAccess: {
//                     $filter: {
//                       input: "$lastaccess",
//                       as: "access",
//                       cond: { $eq: ["$$access.user", data.user_id] },
//                     },
//                   },
//                 },
//               },
//               {
//                 $match: {
//                   "userLastAccess.0": { $exists: true }, // Check if the array is not empty
//                 },
//               },
//               {
//                 $project: {
//                   _id: 0,
//                   messages: {
//                     $cond: {
//                       if: { $gt: [{ $size: "$userLastAccess" }, 0] },
//                       then: {
//                         $filter: {
//                           input: "$messages",
//                           as: "msg",
//                           cond: {
//                             $lte: [
//                               "$$msg.timestamp",
//                               {
//                                 $arrayElemAt: ["$userLastAccess.timestamp", 0],
//                               },
//                             ],
//                           },
//                         },
//                       },
//                       else: "$messages",
//                     },
//                   },
//                 },
//               },
//               {
//                 $unwind: "$messages", // Unwind the array to get a flat result
//               },
//               {
//                 $replaceRoot: { newRoot: "$messages" }, // Replace root to get the desired structure
//               },
//               {
//                 $group: {
//                   _id: null,
//                   totalCount: { $sum: 1 },
//                 },
//               },
//               {
//                 $project: {
//                   _id: 0,
//                   totalCount: 1,
//                 },
//               },
//             ],
//           })) as unknown as [{ totalCount: number }]
//         )[0].totalCount - data.limit
//       : data.skip;

//     // fetching a history page
//     const messagesPage = (await prisma.channel.aggregateRaw({
//       pipeline: [
//         {
//           $match: { name: data.channel_name },
//         },
//         {
//           $addFields: {
//             userLastAccess: {
//               $filter: {
//                 input: "$lastaccess",
//                 as: "access",
//                 cond: { $eq: ["$$access.user", data.user_id] },
//               },
//             },
//           },
//         },
//         {
//           $match: {
//             "userLastAccess.0": { $exists: true }, // Check if the array is not empty
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             messages: {
//               $cond: {
//                 if: { $gt: [{ $size: "$userLastAccess" }, 0] },
//                 then: {
//                   $filter: {
//                     input: "$messages",
//                     as: "msg",
//                     cond: {
//                       $lte: [
//                         "$$msg.timestamp",
//                         {
//                           $arrayElemAt: ["$userLastAccess.timestamp", 0],
//                         },
//                       ],
//                     },
//                   },
//                 },
//                 else: "$messages",
//               },
//             },
//           },
//         },
//         {
//           $unwind: "$messages", // Unwind the array to get a flat result
//         },
//         {
//           $replaceRoot: { newRoot: "$messages" }, // Replace root to get the desired structure
//         },
//         {
//           $skip: totalNumberOfMessages,
//         },
//         {
//           $limit: data.limit,
//         },
//       ],
//     })) as unknown as TMessageDB[];

//     // parsing response from DB
//     let readMessages: Message[];
//     if (messagesPage.length > 0) {
//       readMessages = messagesPage.map((message) => ({
//         ...message,
//         timestamp: message.timestamp.$date,
//       }));
//     } else readMessages = [];
//     return NextResponse.json(
//       {
//         messages: readMessages,
//         totalCount: isNaN(data.skip) ? totalNumberOfMessages : 0,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     // checking if error is a zod validation error
//     return error instanceof z.ZodError
//       ? NextResponse.json(error, { status: 400 })
//       : NextResponse.json(error, { status: 500 });
//   }
// }

// writing a message to a channel in the DB
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
                id: data.message_id,
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
              id: data.message_id,
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
