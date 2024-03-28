import { API_DELAY_MS } from "@/lib/globalSettings";
import { prisma } from "@/lib/prisma/globalForPrisma";
import {
  schemaApiV1dbChannelDELETE,
  schemaApiV1dbChannelPOST,
} from "@/lib/validators/db/channel/channel";
import decipherSignature from "@/util/crypto/aes-cbc/decipherSignature";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// fetching channels data
export async function GET(req: NextRequest) {
  // TODO made obsolete by jwt delete after test
  // // API endpoint protection
  // const encryptedHeader = req.headers.get("pusher-chat-signature") ?? "";
  // const isAllowed =
  //   new Date(
  //     decipherSignature({
  //       signature: encryptedHeader,
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     })
  //   ) > new Date(Date.now() - API_DELAY_MS);
  // if (!isAllowed)
  //   return NextResponse.json("Signature is missing or incorrect", {
  //     status: 403,
  //     statusText: "Unauthorized access",
  //   });

  try {
    const result = await prisma.channel.findMany({
      select: {
        name: true,
        owner: true,
        lastmessage: true,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    NextResponse.json(error, { status: 500 });
  }
}

// checking if channel exists in DB and owner's data is unchanged
// if no collection found creating new collection in DB with initial data
// if collection found and owner's data is different then updating DB data
// otherwise do nothing
export async function POST(req: Request) {
  // TODO made obsolete by jwt delete after test
  // // API endpoint protection
  // const encryptedHeader = req.headers.get("pusher-chat-signature") ?? "";
  // const isAllowed =
  //   new Date(
  //     decipherSignature({
  //       signature: encryptedHeader,
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     })
  //   ) > new Date(Date.now() - API_DELAY_MS);
  // if (!isAllowed)
  //   return NextResponse.json("Signature is missing or incorrect", {
  //     status: 403,
  //     statusText: "Unauthorized access",
  //   });

  try {
    const reqBody = await req.json();
    const data = schemaApiV1dbChannelPOST.parse(reqBody);

    // fetching channel owner data
    const channeldata = await prisma.channel.findUnique({
      where: {
        name: data.channel_name,
      },
      select: {
        owner: true,
      },
    });

    // if no channel found creating new channel
    if (!channeldata) {
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
          lastmessage: null,
          messages: [],
        },
      });

      return NextResponse.json(result, { status: 200 });
    }

    // checking that owner's data in DB is current
    if (
      channeldata.owner.user_name === data.user_name &&
      channeldata.owner.user_admin === data.user_admin
    ) {
      // nothing to update return status OK
      return NextResponse.json(
        { message: "Channel data is up to date" },
        { status: 200 }
      );
    } else {
      // updating channel owner data
      const result = await prisma.$runCommandRaw({
        update: "channel",
        updates: [
          {
            q: {
              name: data.channel_name,
              "owner.user_id": { $eq: data.user_id },
            },
            u: {
              $set: {
                owner: {
                  user_id: data.user_id,
                  user_name: data.user_name,
                  user_admin: data.user_admin,
                },
              },
            },
          },
        ],
      });

      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}

// deleting collection in DB
export async function DELETE(req: Request) {
  // TODO made obsolete by jwt delete after test
  // // API endpoint protection
  // const encryptedHeader = req.headers.get("pusher-chat-signature") ?? "";
  // const isAllowed =
  //   new Date(
  //     decipherSignature({
  //       signature: encryptedHeader,
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     })
  //   ) > new Date(Date.now() - API_DELAY_MS);
  // if (!isAllowed)
  //   return NextResponse.json("Signature is missing or incorrect", {
  //     status: 403,
  //     statusText: "Unauthorized access",
  //   });

  try {
    const reqBody = await req.json();
    const data = schemaApiV1dbChannelDELETE.parse(reqBody);

    // attempting to delete a collection
    await prisma.channel.delete({
      where: {
        name: data.channel_name,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    // checking if error is a zod validation error
    return error instanceof z.ZodError
      ? NextResponse.json(error, { status: 400 })
      : NextResponse.json(error, { status: 500 });
  }
}
