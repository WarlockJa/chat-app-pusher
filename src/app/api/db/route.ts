import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";
import { Prisma } from "@prisma/client";

// fetching data from DB
export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId)
    return NextResponse.json(
      {},
      { status: 400, statusText: "User ID required" }
    );

  try {
    const messages = await prisma.channel.findFirst({
      where: {
        name: userId,
      },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// TODO DB NO WORK! MAKE WORK!
// writing to DB
export async function PUT(req: Request) {
  const { message, userId } = await req.json();

  if (!message) return NextResponse.json({}, { status: 201 });

  if (!userId)
    return NextResponse.json(
      {},
      { status: 400, statusText: "User ID required" }
    );

  try {
    const channel = await prisma.channel.findFirst({
      where: {
        name: userId,
      },
    });

    let result;
    if (channel) {
      result = await prisma.channel.update({
        where: {
          name: userId,
        },
        data: {
          messages: message,
        },
      });
    } else {
      console.log("test");
      result = await prisma.channel.create({
        data: {
          name: userId,
          messages: [
            {
              author: userId,
              text: message,
            },
          ],
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
