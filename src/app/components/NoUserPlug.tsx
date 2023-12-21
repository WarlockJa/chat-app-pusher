import { useAtom } from "jotai";
import "./chat.scss";
import { writeLocalStorage } from "@/util/localStorageRW";
import { activeRoomAtom, userChannelAtom, userIdAtom } from "@/lib/localState";
import { pusherClient } from "@/lib/pusher";
import { PresenceChannel } from "pusher-js";

export default function NoUserPlug({ storage_uuid }: { storage_uuid: string }) {
  const [, setUserId] = useAtom(userIdAtom);
  const [, setActiveRoom] = useAtom(activeRoomAtom);
  const [userChannel, setUserChannel] = useAtom(userChannelAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user_name = formData.get("message")?.toString();

    if (!user_name) return;

    const user_id = crypto.randomUUID();

    // TODO testing only
    // setUserId({ user_id, user_name });
    setUserId({ user_id: user_name, user_name });
    // creating userChannel connection
    // setUserChannel(pusherClient(user_id));
    const tempChannel = pusherClient(user_name);
    setUserChannel(tempChannel);
    // subscribing to presence-system
    // tempChannel.subscribe("presence-system") as PresenceChannel;

    // setActiveRoom(`presence-${user_id}`);
    setActiveRoom(`presence-${user_name}`);

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
