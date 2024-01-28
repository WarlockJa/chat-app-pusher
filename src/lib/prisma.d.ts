import { Message } from "@prisma/client";

// TODO check if should be(?) here?
type TUnreadMessages = [
  {
    messages: Message[];
  }
];
