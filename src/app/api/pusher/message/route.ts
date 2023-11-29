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

  //   pusher.trigger("presence-quickstart", "message", {
  pusherServer.trigger("presence-chat", "message", {
    message: data.message,
  });

  return NextResponse.json(
    { message: data.message },
    { statusText: "OK", status: 200 }
  );
}

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
