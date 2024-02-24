import { prisma } from "@/lib/prisma/globalForPrisma";
import {
  schemaApiV1dbChannelGET,
  schemaApiV1dbChannelPOST,
} from "@/lib/validators/db/channel/channel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// fetching channel owner data
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    // <channel_name>. Used in DB -> collection: channel -> document: <any> -> name: <channel_name>
    const channel_name = url.searchParams.get("channel_name");

    // validating params
    const data = schemaApiV1dbChannelGET.parse({
      channel_name,
    });

    const result = await prisma.channel.findUnique({
      where: {
        name: data.channel_name,
      },
      select: {
        owner: true,
      },
    });

    return NextResponse.json(result?.owner, { status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
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
