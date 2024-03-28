import { IChatRoomsAddNewRoom } from "@/context/innerContexts/ChatRoomsProvider";
import { TPrisma_User } from "../prisma/prisma";
import { IKnownUsersAddUser } from "@/context/innerContexts/KnownUsersProvider";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

export function apiDB_getAllChannelsList({
  dispatchChatRooms,
  dispatchKnownUsers,
  accessToken,
}: {
  dispatchChatRooms: (action: IChatRoomsAddNewRoom) => void;
  dispatchKnownUsers: (action: IKnownUsersAddUser) => void;
  accessToken: IAccessToken;
}) {
  // populating state with fetch result data
  const callback = (
    result: {
      name: string;
      owner: TPrisma_User;
      lastmessage: string | null;
    }[]
  ) => {
    result.map((channel) => {
      dispatchChatRooms({
        type: "ChatRooms_addNewRoom",
        roomName: channel.name,
        owner: channel.owner,
        lastmessage: channel.lastmessage,
      });

      dispatchKnownUsers({
        type: "KnownUsers_addKnownUser",
        user: channel.owner,
      });
    });
  };

  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: "api/v1/db/channel",
    args: {
      method: "GET",
      headers: {
        "pusher-chat-signature": generateSignature({
          key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
        }),
      },
    },
    accessToken,
    callback,
  });

  // TODO delete
  // fetch(`api/v1/db/channel`, {
  //   method: "GET",
  //   headers: {
  //     "pusher-chat-signature": generateSignature({
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     }),
  //   },
  // })
  //   .then((response) => response.json())
  //   .then(
  //     (
  //       channels: {
  //         name: string;
  //         owner: TPrisma_User;
  //         lastmessage: string | null;
  //       }[]
  //     ) => {
  //       channels.map((channel) => {
  //         dispatchChatRooms({
  //           type: "ChatRooms_addNewRoom",
  //           roomName: channel.name,
  //           owner: channel.owner,
  //           lastmessage: channel.lastmessage,
  //         });

  //         dispatchKnownUsers({
  //           type: "KnownUsers_addKnownUser",
  //           user: channel.owner,
  //         });
  //       });
  //     }
  //   )
  //   .catch((error) => console.log(error)); // TODO error porcessing?
}
