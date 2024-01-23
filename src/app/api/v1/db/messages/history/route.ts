import { prisma } from "@/lib/globalForPrisma";
import {
  schemaApiV1dbMessagesHistoryGET,
  schemaApiV1dbMessagesHistoryPOST,
} from "@/lib/validators/db/history";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// fetching a chat room data from DB
// TODO add pagination
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");

    const data = schemaApiV1dbMessagesHistoryGET.parse({ roomId });

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
