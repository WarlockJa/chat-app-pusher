import { prisma } from "@/lib/globalForPrisma";
import { schemaApiDBPOST, schemaApiDBPUT } from "@/lib/validators";
import { NextResponse } from "next/server";
import { z } from "zod";

// fetching a chat room data from DB
export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiDBPOST.parse(reqBody);

    const messages = await prisma.channel.findFirst({
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

// writing to DB
export async function PUT(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaApiDBPUT.parse(reqBody);

    const channel = await prisma.channel.findFirst({
      where: {
        name: data.room,
      },
    });

    console.log(channel);

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
                readusers: [data.userId],
              },
            ],
          },
        },
      });
      console.log(result);
    } else {
      result = await prisma.channel.create({
        data: {
          name: data.room,
          messages: [
            {
              author: data.userId,
              text: data.message,
              readusers: [data.userId],
            },
          ],
        },
      });
      console.log(result);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
