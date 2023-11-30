import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await pusherServer.get({ path: "/channels" });
  if (result.status === 200) {
    const data = await result.json();
    return NextResponse.json(data, {
      statusText: "OK",
      status: 200,
    });
  } else {
    return NextResponse.json(
      { message: result },
      { statusText: "error", status: 500 }
    );
  }
}
