import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";

interface IGetOlderMessageProps {
  first: { message_id: string; entryTimestamp: number };
  second: { message_id: string; entryTimestamp: number };
  activeRoom_chatData: IChatData;
}

export default function getOlderMessage({
  first,
  second,
  activeRoom_chatData,
}: IGetOlderMessageProps):
  | { message_id: string; entryTimestamp: number }
  | undefined {
  if (!activeRoom_chatData) return;

  const firstMessage = activeRoom_chatData.messages.find(
    (message) => message.id === first.message_id
  );
  const secondMessage = activeRoom_chatData.messages.find(
    (message) => message.id === second.message_id
  );

  if (!firstMessage || !secondMessage) return;

  return firstMessage.timestamp > secondMessage.timestamp
    ? { message_id: first.message_id, entryTimestamp: first.entryTimestamp }
    : { message_id: second.message_id, entryTimestamp: second.entryTimestamp };
}
