import { useEffect, useState } from "react";
import { PresenceChannel } from "pusher-js";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { useChatDataContext } from "@/context/ChatDataProvider";
import { addMessage } from "@/util/addMessage";
import { PusherPresence } from "@/context/PusherProvider";

// const getRoomMembers = ({
//   pusher,
//   channel,
// }: {
//   pusher: PusherPresence;
//   channel: string;
// }) => {
//   const allRoomsList = Object.keys(pusher.channel(channel).members.members).map(
//     (member) => {
//       return { users: [userId.user_id], roomId: `presence-${member}` };
//     }
//   );
// };

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
  // list of rooms
  const { roomsList, setRoomsList } = useChatRoomsContext();
  // local chat data
  const { setChatData } = useChatDataContext();

  // TODO uncluster this
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

          // admin only logic. users are not subscribed to member_added event on presence-system
          if (room.roomId === "presence-system") {
            // channel is presence-system a new room must be added based on provided info about the new member
            // method .bind preserves the state of the app at the moment of its call
            // therefore we have to call prev when modifying state inside the .bind
            setRoomsList((prev) => {
              // is admin already subscribed to new user's channel?
              if (
                prev.findIndex(
                  (member_addedFindIndexRoom) =>
                    member_addedFindIndexRoom.roomId === `presence-${data.id}`
                ) === -1
              ) {
                // admin is not subscribed to the new user's channel adding a new room
                // with a default user list of user and admin
                // the actual users list is to be fetched on subscription_succeded event
                // on the next iteration of the loop
                return [
                  ...prev,
                  { users: [userId, newUser], roomId: `presence-${data.id}` },
                ];
              } else {
                // admin is already subscribed to the new user's channel
                // modifying current users list for the room with a new user data
                // the actual users list is to be fetched on subscription_succeded event
                // on the next iteration of the loop
                // return prev.map((member_addedMapRoom) =>
                //   member_addedMapRoom.roomId === `presence-${data.id}`
                //     ? {
                //         ...member_addedMapRoom,
                //         users: [...member_addedMapRoom.users, newUser],
                //       }
                //     : member_addedMapRoom
                // );
                return prev;
              }
            });

            // updating users list for presence-system
            setRoomsList((prev) =>
              prev.map((member_addedUpdatingSystem) =>
                member_addedUpdatingSystem.roomId === "presence-system"
                  ? {
                      ...member_addedUpdatingSystem,
                      users: [...member_addedUpdatingSystem.users, newUser],
                    }
                  : member_addedUpdatingSystem
              )
            );
          }

          // for user: admin subscribed to the user's own channel
          // for admin: user returns to the channel admin already subscribed to
          if (room.roomId !== "presence-system") {
            setRoomsList((prev) => {
              return prev.map((memberAddedRoom) =>
                memberAddedRoom.roomId === room.roomId
                  ? {
                      roomId: memberAddedRoom.roomId,
                      users: [...memberAddedRoom.users, newUser],
                    }
                  : memberAddedRoom
              );
            });
          }
        });

        newChannel.bind("pusher:member_removed", (data: ITriggerEventData) => {
          // update users number when a member leaves
          setRoomsList((prev) =>
            prev.map((memberRemovedRoom) => ({
              ...memberRemovedRoom,
              users: memberRemovedRoom.users.filter(
                (user) => user.user_id !== data.id
              ),
            }))
          );
        });

        // fetching list of currently active user rooms upon initial load
        newChannel.bind("pusher:subscription_succeeded", () => {
          // processing user returning to its own channel that is already subscribed to by an administrator
          // updating channel users count
          if (room.roomId !== "presence-system") {
            // current users for presence-system
            const initialLoadUsersChannel_users: IUserId[] = Object.entries(
              pusher.channel(room.roomId).members.members as IChannelMembers
            ).map(([user_id, user_info]) => ({
              user_id,
              user_admin: user_info.user_admin,
              user_name: user_info.user_name,
            }));

            // adding found users to user list
            setRoomsList((prev) =>
              prev.map((returningUserRoom) =>
                returningUserRoom.roomId === room.roomId
                  ? {
                      ...returningUserRoom,
                      users: initialLoadUsersChannel_users,
                    }
                  : returningUserRoom
              )
            );
          }

          // administrator only subscriptions
          if (room.roomId === "presence-system") {
            const allRoomsList: IChatRoom[] = Object.keys(
              pusher.channel("presence-system").members.members
            ).map((member) => {
              // filtering current user who may yet to be registered as presence-system member
              if (member === userId.user_id)
                return {
                  roomId: `presence-${member}`,
                  users: [userId],
                };

              // generate roomId for each member
              const initialLoadNewRoom_roomId = `presence-${member}`;
              // getting member data from presence-system
              const channelOwnerUserInfo = Object.values(
                pusher.channel("presence-system").members.get(member)
              ) as IChannelGetMember;

              const channelOwnerData: IUserId = {
                user_id: channelOwnerUserInfo[0],
                user_name: channelOwnerUserInfo[1].user_name,
                user_admin: channelOwnerUserInfo[1].user_admin,
              };

              // populating users list for member's channel with initial data
              const initialLoadNewRoom_users = [userId, channelOwnerData];

              return {
                users: initialLoadNewRoom_users,
                roomId: initialLoadNewRoom_roomId,
              };
            });

            // current users for presence-system
            const initialLoadPresenceSystem_users: IUserId[] = Object.entries(
              pusher.channel("presence-system").members
                .members as IChannelMembers
            ).map(([user_id, user_info]) => ({
              user_id,
              user_admin: user_info.user_admin,
              user_name: user_info.user_name,
            }));

            setRoomsList([
              {
                roomId: "presence-system",
                users: initialLoadPresenceSystem_users,
              },
              ...allRoomsList,
            ]);
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
