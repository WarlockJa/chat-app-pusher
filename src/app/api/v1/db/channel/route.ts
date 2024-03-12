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
