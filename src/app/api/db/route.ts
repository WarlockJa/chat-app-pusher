import { prisma } from "@/lib/globalForPrisma";
import { regexAlphanumericWithDash } from "@/util/regExes";
import { NextResponse } from "next/server";
import { z } from "zod";

export const schemaPOST = z
  .object({
    // TODO replace after TEST
    // userId: z.string().uuid()
    userId: z
      .string({
        required_error: "UserId is required",
        invalid_type_error: "Required type for userId is string",
      })
      .max(36, { message: "Maximum length for userId is 36" })
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }),
    room: z
      .string({
        required_error: "ActiveRoom is required",
        invalid_type_error: "Required type for activeRoom is string",
      })
      .startsWith("presence-", {
        message: "ActiveRoom must start with 'presence-'",
      })
      .max(45)
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }),
  })
  .strict(); // do not allow unrecognized keys
// fetching a chat room data from DB
export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaPOST.parse(reqBody);

    const messages = await prisma.channel.findFirst({
      where: {
        name: data.room,
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

export const schemaPUT = z
  .object({
    // TODO replace after TEST
    // userId: z.string().uuid()
    userId: z
      .string({
        required_error: "UserId is required",
        invalid_type_error: "Required type for userId is string",
      })
      .max(36, { message: "Maximum length for userId is 36" })
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }),
    message: z
      .string()
      .min(1)
      .max(400, { message: "Message exceeds 400 characters" }),
    room: z
      .string({
        required_error: "ActiveRoom is required",
        invalid_type_error: "Required type for activeRoom is string",
      })
      .startsWith("presence-", {
        message: "ActiveRoom must start with 'presence-'",
      })
      .max(45)
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }),
  })
  .strict();
// writing to DB
export async function PUT(req: Request) {
  try {
    const reqBody = await req.json();
    const data = schemaPUT.parse(reqBody);

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
