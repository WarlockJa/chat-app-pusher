import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await pusherServer.get({
      path: "/channels/presence-system/users",
    });
    const result = await response.json();
    return NextResponse.json(result, {
      statusText: "OK",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(error, { statusText: "error", status: 500 });
  }
}
