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
  user_id: string;
}

export async function POST(req: Request) {
  const data: IPostData = await req.json();
  const { message, user_id } = data;

  // vaidating request
  if (!message || !user_id)
    return NextResponse.json(
      {},
      { status: 400, statusText: "Socket id and channel name required" }
    );

  pusherServer.trigger(`presence-${user_id}`, "message", {
    message: data.message,
  });
  // TEST
  // pusherServer.trigger(`presence-temp`, "message", {
  //   message: data.message,
  // });

  return NextResponse.json({ message }, { statusText: "OK", status: 200 });
}
