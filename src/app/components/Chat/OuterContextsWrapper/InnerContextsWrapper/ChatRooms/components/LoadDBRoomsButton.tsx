import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { useState } from "react";
import "./loaddbroomsbutton.scss";
import PlusCircle from "@/assets/svg/PlusCircle";
import { apiDB_getAllChannelsList } from "@/lib/apiDBMethods/apiDB_getAllChannelsList";

export default function LoadDBRoomsButton() {
  const [showButton, setShowButton] = useState(true);
  const { dispatchChatRooms } = useChatRoomsContext();
  return showButton ? (
    <div className="buttonWrrapper">
      <button
        className="loadDBRoomsButton"
        onClick={() => {
          apiDB_getAllChannelsList({ dispatchChatRooms });
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
