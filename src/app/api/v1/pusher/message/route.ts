import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

// interface IUser {
//   name: string;
//   rooms: string[];
//   role: "admin" | "user";
// }

// interface IUsersState {
//   users: IUser[];
//   setUsers: (newUsersArray: IUser[]) => void;
// }

// const UsersState: IUsersState = {
//   users: [],
//   setUsers: function (newUsersArray) {
//     this.users = newUsersArray;
//   },
// };

interface IPostData {
  message: string;
  activeRoom: string;
}

export async function POST(req: Request) {
  const data: IPostData = await req.json();
  const { message, activeRoom } = data;

  if (!message) return NextResponse.json({}, { status: 201 });

  // vaidating request
  if (!activeRoom)
    return NextResponse.json(
      {},
      { status: 400, statusText: "Socket id and channel name required" }
    );

  pusherServer.trigger(activeRoom, "message", {
    message: data.message,
  });

  return NextResponse.json({ message }, { statusText: "OK", status: 200 });
}
