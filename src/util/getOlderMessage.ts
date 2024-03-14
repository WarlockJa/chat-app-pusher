import { TPrisma_ChatData } from "@/lib/prisma/prisma";

interface IIOObject {
  message_id: string;
  entryTimestamp: number;
}

interface IGetOlderMessageProps {
  first: IIOObject;
  second: IIOObject;
  activeRoom_chatData: TPrisma_ChatData;
}

// this is a helper function for useIOUnreadMsgArray
// it compares two timestamps for two messages defined by
// the message_id in first and second props fields
// and returns the object with the older corresponding message
export default function getOlderMessage({
  first,
  second,
  activeRoom_chatData,
}: IGetOlderMessageProps): IIOObject | undefined {
  if (!activeRoom_chatData || !activeRoom_chatData.messages) return;

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
