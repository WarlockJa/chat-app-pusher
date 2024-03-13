import { useEffect, useRef, useState } from "react";
import { PresenceChannel } from "pusher-js";
import { getUnreadMessages } from "@/lib/apiDBMethods/getUnreadMessages";
import {
  TSchemaApiV1PusherMessagePost,
  TSchemaApiV1PusherTypingPost,
} from "@/lib/validators/pusher/generatedTypes";
import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import { usePaginationContext } from "@/context/innerContexts/PaginationProvider";
import { useScrollPositionDataContext } from "@/context/innerContexts/ScrollPositionProvider";
import createChannel from "@/lib/apiDBMethods/createChannel";

// this hook tracks changes in roomsList and adjusts pusher subscriptions
// according to access role of the user
export default function useSubscriptions({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: PusherPresence;
}) {
  const [subscriptions, setSubscriptions] = useState<PresenceChannel[]>([]);
  // roomsList context and useReducer dispatch methods
  const { roomsList, dispatchChatRooms } = useChatRoomsContext();
  // local chat data
  const { dispatchChatData } = useChatDataContext();
  // users typing data
  const { dispatchUsersTyping } = useUsersTypingContext();
  // pagination data
  const { dispatchPagination } = usePaginationContext();
  // scroll position data
  const { dispatchScrollPosition } = useScrollPositionDataContext();
  // timeouts array for typing users. Using ref because bind makes a snapshot of useState and can't access new data
  const typingUsers = useRef<ITypingUserTimeout[]>([]);

  useEffect(() => {
    const { user_admin } = userId;

    // subscribing to channels added to roomsList
    roomsList.forEach((room) => {
      // found subscription channel present in roomsList but not in subscriptions
      if (
        subscriptions.findIndex((channel) => channel.name === room.roomId) ===
        -1
      ) {
        // subscribing to channel with room name, modifying subscriptions state
        const newChannel = pusher.subscribe(room.roomId);
        setSubscriptions((prev) => [...prev, newChannel]);

        // if user is not an administrator no further interactions with presence-system required
        if (room.roomId === "presence-system" && !user_admin) return;

        // binding to the "message" event
        newChannel.bind(
          "message",
          async function (
            data: Omit<TSchemaApiV1PusherMessagePost, "activeRoom">
          ) {
            // adding new message to the chatData
            dispatchChatData({
              type: "addRoomMessage",
              room_id: newChannel.name,
              message: {
                id: data.id,
                text: data.message,
                author: {
                  user_id: data.user_id,
                  user_name: data.user_name,
                  user_admin: data.user_admin,
                },
                timestamp: new Date(),
                unread: true,
              },
            });
          }
        );

        // binding to the "typing" event
        newChannel.bind(
          "typing",
          async function (
            data: Omit<TSchemaApiV1PusherTypingPost, "activeRoom">
          ) {
            // sending typing information to the chatData
            dispatchUsersTyping({
              type: "addTypingUser",
              room_id: newChannel.name,
              user: data.author,
            });

            // creating/refreshing typing notification for the user in the room
            // creating id for the author based on the name and the channel
            const authorId = newChannel.name.concat(data.author);
            // clearing timeout from the typingUsers arra for the author, if already exists
            clearTimeout(
              typingUsers.current.find((user) => user.id === authorId)?.timeout
            );

            // creating a new timeout object
            const typingUser: ITypingUserTimeout = {
              id: authorId,
              timeout: setTimeout(
                () =>
                  dispatchUsersTyping({
                    type: "removeTypingUser",
                    room_id: newChannel.name,
                    user: data.author,
                  }),
                1000
              ),
            };

            // removing previous timeout object, if present, and writing a new one
            typingUsers.current = [
              ...typingUsers.current.filter((user) => user.id !== authorId),
              typingUser,
            ];
          }
        );

        // member_added and member_removed binds used to update number of users on the channel
        // i.e. allows to monitor if admin/user is present
        newChannel.bind("pusher:member_added", (data: ITriggerEventData) => {
          // a new member added to the channel
          const newUser: IUserId = {
            user_id: data.id,
            user_name: data.info.user_name,
            user_admin: data.info.user_admin,
          };

          // for user: admin subscribed to the user's own channel
          // for admin: user returns to the channel admin already subscribed to
          dispatchChatRooms({
            type: "ChatRooms_addUserToRoomUsersList",
            user: newUser,
            room_id: newChannel.name,
          });

          // admin only logic. users are not subscribed to member_added event on presence-system
          if (newChannel.name === "presence-system") {
            // creating room based on member_added data
            dispatchChatRooms({
              type: "ChatRooms_addNewRoom",
              room_id: `presence-${data.id}`,
              owner: {
                user_id: data.id,
                user_name: data.info.user_name,
                user_admin: data.info.user_admin,
              },
            });
          }
        });

        newChannel.bind("pusher:member_removed", (data: ITriggerEventData) => {
          // update users number for the binded channel when a member leaves
          dispatchChatRooms({
            type: "ChatRooms_removeUserFromRoomUsersList",
            room_id: newChannel.name,
            user_id: data.id,
          });
        });

        // fetching list of currently active user rooms upon initial load
        newChannel.bind("pusher:subscription_succeeded", () => {
          // creating a collection in DB with user data if does not exist
          if (newChannel.name !== "presence-system") {
            // attempting to create a new channel in DB with owner data
            createChannel({
              user_id: userId.user_id,
              user_name: userId.user_name,
              user_admin: userId.user_admin,
              channel_name: newChannel.name,
            });
          }
          // creating rooms in contexts
          dispatchChatData({
            type: "ChatData_addRoom",
            room_id: newChannel.name,
          });
          dispatchUsersTyping({
            type: "UsersTyping_addRoom",
            room_id: newChannel.name,
          });
          dispatchPagination({
            type: "Pagination_addRoom",
            room_id: newChannel.name,
          });
          dispatchScrollPosition({
            type: "ScrollPosition_addRoom",
            room_id: newChannel.name,
          });

          // fetching unread messages on subscription_succeeded
          getUnreadMessages({
            params: {
              user_id: userId.user_id,
              channel_name: newChannel.name,
            },
            dispatchChatData,
          });

          // getting users subscribed to the channel
          const initialLoadUsersChannel_users: IUserId[] = Object.entries(
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
              room_id: newChannel.name,
              user,
            });
          });

          // administrator only. Adding rooms to roomsList based on the list of users subscribed to presence-system
          if (newChannel.name === "presence-system") {
            initialLoadUsersChannel_users.map((user) =>
              dispatchChatRooms({
                type: "ChatRooms_addNewRoom",
                room_id: `presence-${user.user_id}`,
                owner: user,
              })
            );
          }
        });
      }
    });

    // unsubscribing from channels removed from roomsList
    subscriptions.forEach((channel) => {
      // found channel that exists in subscriptions but not in roomsList
      if (roomsList.findIndex((room) => room.roomId === channel.name) === -1) {
        // unsubscribing from channel modifying subscriptions state
        channel.unsubscribe();
        setSubscriptions((prev) =>
          prev.filter((removeChannel) => channel !== removeChannel)
        );
      }
    });

    // cleanup
    return () => {
      // clearing users typing timouts
      typingUsers.current.forEach((user) => clearTimeout(user.timeout));
    };
    // cleanup function for subscriptions is not required
    // existing subscriptions terminated on pusherClient disconnect
  }, [roomsList.length]);
}
