"use client";
import { useAtom } from "jotai";
import "./chat.scss";
import { writeLocalStorage } from "@/util/localStorageRW";
import { roomsListAtom, userIdAtom } from "@/lib/localState";

// gathering anonymous user data and saving it to state and localStorage
export default function NoUserPlug({ storage_uuid }: { storage_uuid: string }) {
  const [, setUserId] = useAtom(userIdAtom);
  // roomsList state to assing default rooms for the user
  const [, setRoomsList] = useAtom(roomsListAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user_name = formData.get("message")?.toString();

    if (!user_name) return;

    // generating random user_id
    const user_id = crypto.randomUUID();

    // TODO replace TEST
    // setUserId({ user_id, user_name });
    // assigning default rooms for the user
    // setRoomsList(['presence-system', `presence-${user_id}`])
    // TEST
    setUserId({ user_id: user_name, user_name, user_admin: false });
    setRoomsList(["presence-system", `presence-${user_name}`]);

    // saving anonymous data to localStorage
    writeLocalStorage({
      user_id,
      user_name,
      storage_uuid,
    });
  };

  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chat__body">
          <ul className="chat-display">
            <li className="post__text">Please enter your name:</li>
          </ul>
        </div>
        <div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" name="message" id="chat-input" maxLength={20} />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
