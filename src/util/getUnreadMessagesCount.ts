import { IChatData } from "@/context/ChatDataProvider";

export default function getUnreadMessagesCount({
  chatData,
}: {
  chatData: IChatData | undefined;
}): number {
  return chatData ? chatData.messages.filter((msg) => msg.unread).length : 0;
}
