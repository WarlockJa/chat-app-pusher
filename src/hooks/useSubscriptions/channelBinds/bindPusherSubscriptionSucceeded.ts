import {
  IChatDataAddRoom,
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
} from "@/context/innerContexts/ChatDataProvider";
import {
  IChatRoomsAddNewRoom,
  IChatRooms_addUserToRoomUsersList,
  IChatRooms_updateLastmessage,
} from "@/context/innerContexts/ChatRoomsProvider";
import { IPaginationAddRoom } from "@/context/innerContexts/PaginationProvider";
import { IScrollPositionAddRoom } from "@/context/innerContexts/ScrollPositionProvider";
import { IUsersTypingAddRoom } from "@/context/innerContexts/UsersTypingProvider";
import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import apiDB_createChannel from "@/lib/apiDBMethods/apiDB_createChannel";
import apiDB_getChannelLastmessage from "@/lib/apiDBMethods/apiDB_getChannelLastmessage";
import { apiDB_getUnreadMessages } from "@/lib/apiDBMethods/apiDB_getUnreadMessages";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { PresenceChannel } from "pusher-js";

interface IBindPusherSubscriptionSucceededProps {
  newChannel: PresenceChannel;
  userId: TPrisma_User;
  pusher: PusherPresence;
  dispatchChatData: (
    action: IChatDataAddRoom | IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
  dispatchUsersTyping: (action: IUsersTypingAddRoom) => void;
  dispatchPagination: (action: IPaginationAddRoom) => void;
  dispatchScrollPosition: (action: IScrollPositionAddRoom) => void;
  dispatchChatRooms: (
    action:
      | IChatRoomsAddNewRoom
      | IChatRooms_addUserToRoomUsersList
      | IChatRooms_updateLastmessage
  ) => void;
  knownUsers_addNewUser: (user: TPrisma_User) => void;
}

export default function bindPusherSubscriptionSucceeded({
  newChannel,
  userId,
  pusher,
  dispatchChatData,
  dispatchUsersTyping,
  dispatchPagination,
  dispatchScrollPosition,
  dispatchChatRooms,
  knownUsers_addNewUser,
}: IBindPusherSubscriptionSucceededProps) {
  newChannel.bind("pusher:subscription_succeeded", () => {
    // creating a collection in DB with user data if does not exist
    if (newChannel.name !== "presence-system") {
      // attempting to create a new channel in DB with owner data
      apiDB_createChannel({
        user_id: userId.user_id,
        user_name: userId.user_name,
        user_admin: userId.user_admin,
        channel_name: newChannel.name,
      });
    }
    // creating rooms in contexts
    dispatchChatData({
      type: "ChatData_addRoom",
      roomName: newChannel.name,
    });
    dispatchUsersTyping({
      type: "UsersTyping_addRoom",
      roomName: newChannel.name,
    });
    dispatchPagination({
      type: "Pagination_addRoom",
      roomName: newChannel.name,
    });
    dispatchScrollPosition({
      type: "ScrollPosition_addRoom",
      roomName: newChannel.name,
    });

    // fetching unread messages on subscription_succeeded
    apiDB_getUnreadMessages({
      params: {
        user_id: userId.user_id,
        channel_name: newChannel.name,
      },
      dispatchChatData,
      dispatchChatRooms,
      knownUsers_addNewUser,
    });

    // getting users subscribed to the channel
    const initialLoadUsersChannel_users: TPrisma_User[] = Object.entries(
      pusher.channel(newChannel.name).members.members as IChannelMembers
    ).map(([user_id, user_info]) => ({
      user_id,
      user_admin: user_info.user_admin,
      user_name: user_info.user_name,
    }));

    // adding found users to user list
    initialLoadUsersChannel_users.forEach((user) => {
      dispatchChatRooms({
        type: "ChatRooms_addUserToRoomUsersList",
        roomName: newChannel.name,
        user,
      });
    });

    // administrator only. Adding rooms to roomsList based on the list of users subscribed to presence-system
    if (newChannel.name === "presence-system") {
      initialLoadUsersChannel_users.map((user) => {
        // creating new room in ChatRooms context
        dispatchChatRooms({
          type: "ChatRooms_addNewRoom",
          roomName: `presence-${user.user_id}`,
          owner: user,
          lastmessage: null,
        });

        // fetching last message timestamp from DB to display in ChatRooms
        apiDB_getChannelLastmessage({ owner: user.user_id, dispatchChatRooms });
      });
    }
  });
}
