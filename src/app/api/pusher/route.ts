import { NextResponse } from "next/server";
import { pusher } from "./pusher";

interface IUser {
  name: string;
  rooms: string[];
  role: "admin" | "user";
}

interface IUsersState {
  users: IUser[];
  setUsers: (newUsersArray: IUser[]) => void;
}

const UsersState: IUsersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

export async function POST(req: Request) {
  const message = await req.json();

  //   pusher.trigger("presence-quickstart", "message", {
  pusher.trigger("my-channel", "message", {
    message: message,
  });

  return NextResponse.json({ message }, { statusText: "OK", status: 200 });
}

export async function GET() {
  const result = await pusher.get({ path: "/channels" });
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
