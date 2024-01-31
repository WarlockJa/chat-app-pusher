import { IChatData_MessageExtended } from "@/context/ChatDataProvider";

export default function getMsgKey(msg: IChatData_MessageExtended) {
  return msg.author
    .concat(msg.timestamp.toString())
    .concat(msg.text.slice(0, 5));
}
