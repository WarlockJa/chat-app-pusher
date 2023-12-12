import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";

// fetching data from DB
export async function POST(req: Request) {
  // TODO validate data
  const { userId, activeRoom } = await req.json();

  if (!userId)
    return NextResponse.json(
      {},
      { status: 400, statusText: "User ID required" }
    );

  // if no room provided active room is the user channel
  const room = activeRoom ? activeRoom.slice(9) : userId;

  try {
    const messages = await prisma.channel.findFirst({
      where: {
        name: room,
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

// writing to DB
export async function PUT(req: Request) {
  const { message, userId, activeRoom } = await req.json();

  if (!message) return NextResponse.json({}, { status: 201 });

  if (!userId)
    return NextResponse.json(
      {},
      { status: 400, statusText: "User ID required" }
    );

  // if no room provided active room is the user channel
  const room = activeRoom ? activeRoom.slice(9) : userId;

  try {
    const channel = await prisma.channel.findFirst({
      where: {
        name: room,
      },
    });

    let result;
    if (channel) {
      result = await prisma.channel.update({
        where: {
          name: room,
        },
        data: {
          messages: { push: [{ text: message, author: userId }] },
        },
      });
    } else {
      result = await prisma.channel.create({
        data: {
          name: room,
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
