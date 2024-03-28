import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { useState } from "react";
import "./loaddbroomsbutton.scss";
import PlusCircle from "@/assets/svg/PlusCircle";
import { apiDB_getAllChannelsList } from "@/lib/apiDBMethods/apiDB_getAllChannelsList";
import { useKnownUsersContext } from "@/context/innerContexts/KnownUsersProvider";
import { useUserIdContext } from "@/context/outerContexts/UserIdProvider";

export default function LoadDBRoomsButton() {
  const [showButton, setShowButton] = useState(true);
  const { dispatchChatRooms } = useChatRoomsContext();
  const { dispatchKnownUsers } = useKnownUsersContext();
  const { userId } = useUserIdContext();

  return showButton ? (
    <div className="buttonWrrapper">
      <button
        className="loadDBRoomsButton"
        onClick={() => {
          apiDB_getAllChannelsList({
            dispatchChatRooms,
            dispatchKnownUsers,
            accessToken: {
              user_id: userId?.user_id,
              user_admin: userId?.user_admin,
            },
          });
          setShowButton(false);
        }}
      >
        <div className="svgWrapper">
          <PlusCircle />
        </div>
        <div className="loadDBRoomsButton--text">Load Empty Rooms</div>
      </button>
    </div>
  ) : null;
}
