import { Message, channel, User } from "@prisma/client";

type TMessageDB = Omit<Message, "timestamp"> & { timestamp: { $date: Date } };

// enforcing for front-end to have user_admin field to be explicitly defined
type TPrisma_User = Omit<User, "user_admin"> & { user_admin: boolean };

interface IChannel extends channel {
  state: TStateLiteral;
}
// replacing type Date from Prisma model with string for ISO string that it gets from the DB
type TPrismaMessage = Omit<Message, "timestamp"> & {
  timestamp: string;
};

interface IMessage extends TPrismaMessage {
  unread: boolean;
}

// creating type for ChatRooms context based on Prisma model for channel
// omitting fields not used in ChatRooms context
// adding possibility of null for "owner" field because "owner" field is null
// for "presence-system" which only exist for Pusher and not in database
type TPrisma_ChatRooms = Omit<
  IChannel,
  "id" | "messages" | "lastaccess" | "owner" | "lastmessage"
> & {
  owner: TPrisma_User | null;
  users: TPrisma_User[];
  lastmessage: string | null;
};

// ChatData context type. Omitting fields not used in ChatData context
// adding error and extended IMessage type for front-end state
type TPrisma_ChatData = Omit<
  IChannel,
  "id" | "lastaccess" | "owner" | "lastmessage" | "messages"
> & {
  messages: IMessage[];
  error?: Error;
};

// Pagination context type. Omitting everything from IChannel but name.
// extending with limit and hasMore flag for pagination functionality
type TPrisma_PaginationData = Omit<
  IChannel,
  "id" | "messages" | "lastaccess" | "owner" | "lastmessage"
> & {
  limit: number; // amount to fetch per page
  hasMore: boolean; // flag for data availability
};

// ScrollPosition context type. Omitting everything from channel but name.
// extending with variables for scrolling ChatBody
type TPrisma_ScrollPosition = Omit<
  channel,
  "id" | "messages" | "lastaccess" | "owner" | "lastmessage"
> & {
  currentPosition: number; // current scroll position for the room
  isPreviousBottom: boolean; // flag for scrolled to bottom for the room
  previousUnreadMsgCount: number; // unread messages count for the room
};

// UsersTyping context type. Omitting everything from channel but name.
// extending with users: string[] to catch "typing" Pusher event users.
type TPrisma_UsersTyping = Omit<
  channel,
  "id" | "messages" | "lastaccess" | "owner" | "lastmessage"
> & {
  users: string[];
};
