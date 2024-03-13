import { prisma } from "@/lib/prisma/globalForPrisma";
import {
  schemaApiV1dbChannelDELETE,
  schemaApiV1dbChannelPOST,
} from "@/lib/validators/db/channel/channel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// fetching channels data
export async function GET(req: NextRequest) {
  try {
    const result = await prisma.channel.findMany({
      select: {
        name: true,
        owner: true,
      },
    });
    // const result = await prisma.channel.aggregateRaw({
    //   pipeline: [
    //     {
    //       $unwind: "$messages", // Unwind the messages array to process individual messages
    //     },
    //     {
    //       $sort: { "messages.timestamp": -1 }, // Sort messages by timestamp in descending order
    //     },
    //     {
    //       $group: {
    //         _id: "$_id", // Group by the channel's _id
    //         name: { $first: "$name" }, // Get the first name (assuming it's unique)
    //         owner: { $first: "$owner" }, // Get the first owner (assuming it's unique)
    //         messages: { $first: "$messages" },
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 0, // Exclude _id from the final result (optional)
    //         name: 1,
    //         owner: 1,
    //         messages: { timestamp: 1 }, // Project only the lastMessageTimestamp from messages
    //       },
    //     },
    //   ],
    // });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    NextResponse.json(error, { status: 500 });
  }
}

// creating new collection in DB with initial data
export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiV1dbChannelPOST.parse(reqBody);

    // attempting to create a collection with owner's data
    const result = await prisma.channel.create({
      data: {
        name: data.channel_name,
        owner: {
          user_id: data.user_id,
          user_name: data.user_name,
          user_admin: data.user_admin,
        },
        lastaccess: [],
        messages: [],
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(
          { message: "Collection already exists" },
          { status: 201 }
        );
  }
}

// deleting collection in DB
export async function DELETE(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiV1dbChannelDELETE.parse(reqBody);

    // attempting to create a collection with owner's data
    const result = await prisma.channel.delete({
      where: {
        name: data.channel_name,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(
          { message: "Collection does not exist" },
          { status: 201 }
        );
  }
}
