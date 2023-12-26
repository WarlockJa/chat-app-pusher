import { useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";

export default function ChatBody() {
  const { activeRoom } = useChatRoomsContext();
  const { chatData } = useChatDataContext();
  const activeChatData = chatData?.find((item) => item.roomId === activeRoom);

  // // loading room messages history from DB
  // useEffect(() => {
  //   if (!userId) {
  //     setMessages(["Please enter your name"]);
  //     return;
  //   }

  //   fetch("/api/db", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       userId,
  //       activeRoom,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((result: channel) => {
  //       result?.messages
  //         ? setMessages(() => [
  //             ...result.messages.map((message) => message.text),
  //             `Welcome to chat ${userId.user_name}`,
  //           ])
  //         : setMessages([`Welcome to chat ${userId.user_name}`]);
  //     });
  // }, [activeRoom]);

  // useEffect(() => {
  //   if (!userId?.user_id || !activeRoom) return;
  //   // subscribing to the presence channel with the name based on the userId
  //   console.log("ChatBody - subscribed");
  //   const channel = pusherClient(userId.user_id).subscribe(
  //     activeRoom
  //   ) as PresenceChannel;

  //   // pusherClient.bind_global((eventName, data) => {
  //   //   console.log(
  //   //     `bind global: The event ${eventName} was triggered with data ${JSON.stringify(
  //   //       data
  //   //     )}`
  //   //   );
  //   // });

  //   channel.bind("message", function (data: { message: string }) {
  //     // adding message to the state
  //     console.log(messages);
  //     setMessages(() => [...messages, data.message]);
  //   });

  //   // return () => pusherClient.unsubscribe(`presence-${userId}`);
  //   return () => {
  //     if (!userId.user_id) return;
  //     console.log("Cleanup " + activeRoom);
  //     pusherClient(userId.user_id).unsubscribe(activeRoom);
  //   };
  // }, [messages, activeRoom]);

  const chatContent = activeChatData
    ? activeChatData.messages.map((msg, index) => (
        <li key={index} className="post__text">
          {msg.text}
        </li>
      ))
    : null;

  return (
    <div className="chat__body">
      <ul className="chat-display">{chatContent}</ul>
    </div>
  );
}
