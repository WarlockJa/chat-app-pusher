import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { getChannels } from "@/lib/apiDBMethods/getChannels";
import { useState } from "react";
import "./loaddbroomsbutton.scss";
import PlusCircle from "@/assets/svg/PlusCircle";

export default function LoadDBRoomsButton() {
  const [showButton, setShowButton] = useState(true);
  const { dispatchChatRooms } = useChatRoomsContext();
  return showButton ? (
    <div className="buttonWrrapper">
      <button
        className="loadDBRoomsButton"
        onClick={() => {
          getChannels({ dispatchChatRooms });
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
