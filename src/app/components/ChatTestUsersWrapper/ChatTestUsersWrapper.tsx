"use client";
import { useState } from "react";
import "./chattestuserswrapper.scss";
import Chat from "@/app/components/Chat/Chat";

const USERS: IInitUserId[] = [
  {},
  {
    user_id: "6d17aa1c-9e80-4bc1-82e1-efb37c775bfb",
    user_name: "Registered-User",
    user_admin: false,
  },
  {
    user_id: "7f6bf857-1f52-40f6-b7c7-399b9b6702d1",
    user_name: "Administrator One",
    user_admin: true,
  },
];
export default function ChatTestUsersWrapper() {
  const [currentUser, setCurrentUser] = useState<IInitUserId | null>(null);
  const [value, setValue] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCurrentUser(USERS[value]);
  };

  let description;
  switch (value) {
    case 1:
      description =
        "Registered User. For this user Chat component receives full UserId token with user_id, user_name, and user_admin (false). Registered user is subscribed to a channel, with limited functionality, that can be accessed by an administrator. Registered user's data stored strictly in memory.";
      break;
    case 2:
      description =
        "Administrator. For this user Chat component receives full UserId token with user_id, user_name, and user_admin (true). Administrators have full access to users' chat rooms. Administrator's data stored strictly in memory.";
      break;

    default:
      description =
        "Anonymous User. This option allows for an unregistered user to initiate chat session. For this user Chat component asks for a name and generates random uuid. Anonymous user data persisted in local storage. Anonymous user cannot be an administrator.";
      break;
  }

  return currentUser ? (
    <Chat
      {...currentUser}
      storage_uuid={process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID!}
      pageLimit={10}
    />
  ) : (
    <form className="chatWrapper" onSubmit={handleSubmit}>
      <h1 className="chatWrapper--header">Support Chat</h1>
      <p className="chatWrapper--description">
        This is a testing suite for a Pusher Support Chat component. Utilizing
        Pusher for web sockets events allows this chat to be deployed on a
        serverless hosting that does not support web sockets naturally.
      </p>
      <div className="divider"></div>
      <p>To proceed to the chat select user role</p>
      <div className="selectWrapper">
        <button
          className="chatWrapper--submitButton"
          type="submit"
          onMouseOver={() => setValue(0)}
        >
          Anonymous User
        </button>
        <button
          className="chatWrapper--submitButton"
          type="submit"
          onMouseOver={() => setValue(1)}
        >
          Registered User
        </button>
        <button
          className="chatWrapper--submitButton"
          type="submit"
          onMouseOver={() => setValue(2)}
        >
          Administrator
        </button>
      </div>
      <div className="divider"></div>
      <p className={`chatWrapper--description animatedText${value}`}>
        {description}
      </p>
    </form>
  );
}
