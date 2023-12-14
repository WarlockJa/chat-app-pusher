import { useAtom } from "jotai";
import "./chat.scss";
import { writeLocalStorage } from "@/util/localStorageRW";
import { activeRoomAtom, userIdAtom } from "@/lib/localState";

export default function NoUserPlug({ storage_uuid }: { storage_uuid: string }) {
  const [, setUserId] = useAtom(userIdAtom);
  const [, setActiveRoom] = useAtom(activeRoomAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user_name = formData.get("message")?.toString();

    if (!user_name) return;

    const user_id = crypto.randomUUID();

    // TODO testing only
    // setUserId({ user_id, user_name });
    user_name === "WJ"
      ? setUserId({ user_id: "WJ", user_name, user_admin: true })
      : user_name === "Mike"
      ? setUserId({ user_id: "Mike", user_name })
      : setUserId({ user_id, user_name });

    setActiveRoom(`presence-${user_id}`);
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
