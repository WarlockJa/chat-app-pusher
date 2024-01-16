import { useEffect, useState } from "react";
import { PresenceChannel } from "pusher-js";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { useChatDataContext } from "@/context/ChatDataProvider";
import { addMessage } from "@/util/addMessage";
import { PusherPresence } from "@/context/PusherProvider";

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
  const { roomsList, dispatch } = useChatRoomsContext();
  // local chat data
  const { setChatData } = useChatDataContext();

  useEffect(() => {
    const { user_id, user_admin } = userId;

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

        // TODO process later
        // newChannel.bind("message", function (data: IMessageData) {
        //   // setChatData((prev) =>
        //   //   prev
        //   //     ? [
        //   //         ...prev.filter(
        //   //           (currentRoom) => currentRoom.roomId !== room.roomId
        //   //         ),
        //   //         addMessage(
        //   //           prev.find(
        //   //             (currentRoom) => currentRoom.roomId === room.roomId
        //   //           )!,
        //   //           {
        //   //             author: user_id,
        //   //             readusers: [user_id],
        //   //             text: data.message,
        //   //             timestamp: new Date(),
        //   //           }
        //   //         ),
        //   //       ]
        //   //     : [
        //   //         addMessage(
        //   //           { roomId: room.roomId, messages: [], state: "success" },
        //   //           {
        //   //             author: user_id,
        //   //             readusers: [user_id],
        //   //             text: data.message,
        //   //             timestamp: new Date(),
        //   //           }
        //   //         ),
        //   //       ]
        //   // );
        // });

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
          dispatch({
            type: "addUserToRoomUsersList",
            user: newUser,
            room_id: newChannel.name,
          });

          // admin only logic. users are not subscribed to member_added event on presence-system
          if (newChannel.name === "presence-system") {
            // creating room based on member_added data
            dispatch({
              type: "addNewRoom",
              room_id: `presence-${data.id}`,
            });
          }
        });

        newChannel.bind("pusher:member_removed", (data: ITriggerEventData) => {
          // update users number for the binded channel when a member leaves
          dispatch({
            type: "removeUserFromRoomUsersList",
            room_id: newChannel.name,
            user_id: data.id,
          });
        });

        // fetching list of currently active user rooms upon initial load
        newChannel.bind("pusher:subscription_succeeded", () => {
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
            dispatch({
              type: "addUserToRoomUsersList",
              room_id: newChannel.name,
              user,
            });
          });

          // administrator only. Adding rooms to roomsList based on the list of users subscribed to presence-system
          if (newChannel.name === "presence-system") {
            initialLoadUsersChannel_users.map((user) =>
              dispatch({
                type: "addNewRoom",
                room_id: `presence-${user.user_id}`,
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

    // cleanup function is not required
    // existing subscriptions terminated on pusherClient disconnect
  }, [roomsList.length]);
}
